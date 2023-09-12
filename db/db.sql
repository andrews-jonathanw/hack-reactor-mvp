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


INSERT INTO users (username, password, email)
VALUES
  ('daniel', 'password1', 'daniel@example.com'),
  ('heith', 'password2', 'heith@example.com'),
  ('jon', 'password3', 'jon@example.com'),
  ('khurram', 'password4', 'khurram@example.com'),
  ('lederius', 'password5', 'lederius@example.com'),
  ('michael', 'password6', 'michael@example.com'),
  ('beck', 'password7', 'beck@example.com'),
  ('kurt', 'password8', 'kurt@example.com'),
  ('vinny', 'password9', 'vinny@example.com'),
  ('alisa', 'password10', 'alisa@example.com'),
  ('amelia', 'password11', 'amelia@example.com'),
  ('ben', 'password12', 'ben@example.com'),
  ('jonathan', 'password13', 'jonathan@example.com'),
  ('victor', 'password14', 'victor@example.com');

-- Insert random scores for these users into the "scores" table (assuming their ids are 1-14 in sequence)
INSERT INTO scores (user_id, score)
VALUES
  (1, 7842),
  (2, 13900),
  (3, 10023),
  (4, 4159),
  (5, 8876),
  (6, 9241),
  (7, 6829),
  (8, 12340),
  (9, 6584),
  (10, 9322),
  (11, 2388),
  (12, 11864),
  (13, 14495),
  (14, 9629);

-- Create an index on the "username" column of the "users" table
CREATE INDEX IF NOT EXISTS idx_username ON users (username);

-- Create an index on the "email" column of the "users" table
CREATE INDEX IF NOT EXISTS idx_email ON users (email);

-- Create an index on the "user_id" column of the "scores" table
CREATE INDEX IF NOT EXISTS idx_user_id ON scores (user_id);
