require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const port = process.env.PORT || 5000;
const pool = require('../db/db.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', null];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Auth
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token)
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const userId = user.id;

      const findUserQuery = 'SELECT * FROM users WHERE id = $1';
      try {
        const result = await pool.query(findUserQuery, [userId]);
        const dbUser = result.rows[0];

        req.user = {
          ...user,
          username: dbUser.username,
          email: dbUser.email

        };
      } catch (error) {
        console.error("Failed to fetch additional user info:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      next();
    });
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};



// Initialize a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Keep track of connected clients
let connectedClients = [];

// Broadcasts data to all connected WebSocket clients
const broadcast = (data) => {
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// WebSocket connection setup
wss.on('connection', (ws) => {
  // Add this client to the connectedClients array
  connectedClients.push(ws);

  ws.on('close', () => {
    // Remove this client from connectedClients array
    connectedClients = connectedClients.filter((client) => client !== ws);
  });
});

app.get('/api/highscores', async (req, res) => {
  try {
    const client = await pool.connect();
    let query = `
      SELECT users.username, scores.score, scores.created_at
      FROM users
      JOIN scores ON users.id = scores.user_id`;
    if (req.query.userScores === 'true' && req.query.username) {
      query += `
        WHERE users.username = $1
        ORDER BY scores.score DESC`;
      const result = await client.query(query, [req.query.username]);
      client.release();
      res.json(result.rows);
    } else {
      if (req.query.top10 === 'true') {
        query += ' ORDER BY scores.score DESC LIMIT 10';
      } else {
        query += ' ORDER BY scores.score DESC';
      }
      const result = await client.query(query);
      client.release();
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching high scores data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/api/user-recent-highscores', async (req, res) => {
  const { username } = req.query;
  console.log('trying to get user scores', req.query);
  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT scores.score, scores.created_at FROM users JOIN scores ON users.id = scores.user_id WHERE users.username = $1 ORDER BY scores.created_at DESC LIMIT 5',
      [username]
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/user-highscores', async (req, res) => {
  const { username } = req.query;
  console.log('trying to get user scores', req.query)
  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT scores.score, scores.created_at FROM users JOIN scores ON users.id = scores.user_id WHERE users.username = $1 ORDER BY scores.score DESC LIMIT 5',
      [username]
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/api/users', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertUserQuery = `
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
    `;

    const result = await pool.query(insertUserQuery, [username, hashedPassword, email]);

    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating a new user:', error);

    // Unique violation
    if (error.code === '23505') {
      if (error.detail.includes('username')) {
        return res.status(400).json({ error: 'Username already in use' });
      }
      if (error.detail.includes('email')) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/update/:field', authenticateJWT, async (req, res) => {
  const { field } = req.params;
  const { value } = req.body;
  const userId = req.user.id;

  // Fetch the user's existing data
  const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = userResult.rows[0];

  let query;
  let newValue = value;

  if (field === 'username') {
    if (user.username === value) {
      return res.status(400).json({ error: 'New username cannot be the same as the old username' });
    }
    query = 'UPDATE users SET username = $1 WHERE id = $2';
  } else if (field === 'email') {
    query = 'UPDATE users SET email = $1 WHERE id = $2';
  } else if (field === 'password') {
    const isSamePassword = await bcrypt.compare(value, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }
    newValue = await bcrypt.hash(value, 10);
    query = 'UPDATE users SET password = $1 WHERE id = $2';
  } else {
    return res.status(400).json({ error: 'Invalid field' });
  }

  try {
    const result = await pool.query(query, [newValue, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Update successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid user credentials' });
    }

    const findUserQuery = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(findUserQuery, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // expires in 1 day
    });

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const expiresDate = new Date(Date.now() + oneDayInMilliseconds);

    res.cookie('token', token, {
      httpOnly: true,
      expires: expiresDate,
    });
    res.cookie('user_info', JSON.stringify(userData), {
      expires: expiresDate,
    });
    res.status(200).json({ message: 'Login successful', userData });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/rehydrate', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});


app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('user_info');
  res.status(200).json({ message: 'Logged out' });
});

app.post('/api/submitScore', authenticateJWT, async (req, res) => {
  console.log(req.body);
  try {
    const { userId, score } = req.body;

    if (!userId || !score) {
      return res.status(400).json({ error: 'Invalid score data' });
    }

    const insertScoreQuery = `
      INSERT INTO scores (user_id, score)
      VALUES ($1, $2)
      RETURNING id, user_id, score;
    `;

    const result = await pool.query(insertScoreQuery, [userId, score]);
    const newScore = result.rows[0];

    // Notify all connected WebSocket clients about the new high score
    broadcast({ event: 'newHighScore', newScore });

    res.status(201).json(newScore);
  } catch (error) {
    console.error('Error creating a new score:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Integrate WebSocket into existing HTTP server
app.server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle WebSocket upgrade requests
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});