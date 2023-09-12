require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const pool = require('../db/db.js');

const app = express();
app.use(express.json());
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});