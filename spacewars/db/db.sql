Copy code
CREATE DATABASE IF NOT EXISTS spacewars;

-- Create the "users" table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

-- Create the "scores" table if it doesn't exist
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  score INT NOT NULL
);


-- Insert dummy users into the "users" table
INSERT INTO users (username, password, email)
VALUES
  ('user1', 'password1', 'user1@example.com'),
  ('user2', 'password2', 'user2@example.com'),
  ('user3', 'password3', 'user3@example.com');

-- Insert dummy scores into the "scores" table
INSERT INTO scores (user_id, score)
VALUES
  (1, 9999),
  (2, 9455),
  (3, 6425);

-- Add more user and score data as needed

-- Create an index on the "username" column of the "users" table
CREATE INDEX IF NOT EXISTS idx_username ON users (username);

-- Create an index on the "email" column of the "users" table
CREATE INDEX IF NOT EXISTS idx_email ON users (email);

-- Create an index on the "user_id" column of the "scores" table
CREATE INDEX IF NOT EXISTS idx_user_id ON scores (user_id);
