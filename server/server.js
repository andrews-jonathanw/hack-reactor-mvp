require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const port = process.env.PORT || 5000;
const pool = require('../db/db.js');

const app = express();
app.use(express.json());
app.use(cors());

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
    // Connect to the database
    const client = await pool.connect();

    // Query the database to get high scores with usernames
    const result = await client.query(
      'SELECT users.username, scores.score FROM users JOIN scores ON users.id = scores.user_id ORDER BY scores.score DESC LIMIT 10'
    );

    // Release the database connection
    client.release();

    // Send the high scores data as JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching high scores data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    // Extract user data from the request body
    const { username, password, email } = req.body;

    // Validate user data (you can add more validation here)
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    // Insert the new user into the "users" table
    const insertUserQuery = `
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
    `;

    const result = await pool.query(insertUserQuery, [username, password, email]);

    // Respond with the newly created user
    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating a new user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    // Extract user credentials from the request body
    const { username, password } = req.body;

    // Validate user credentials (you can add more validation here)
    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid user credentials' });
    }

    // Query the database to find the user by username
    const findUserQuery = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(findUserQuery, [username]);

    // Check if the user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if the provided password matches the stored password
    const user = result.rows[0];
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Authentication successful, respond with user data or token
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/submitScore', async (req, res) => {
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