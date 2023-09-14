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
  score INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
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
INSERT INTO scores (user_id, score, created_at)
VALUES
  (1, 7842, NOW() - INTERVAL '1 day' * (random() * 3)),
  (2, 13900, NOW() - INTERVAL '1 day' * (random() * 3)),
  (3, 10023, NOW() - INTERVAL '1 day' * (random() * 3)),
  (4, 4159, NOW() - INTERVAL '1 day' * (random() * 3)),
  (5, 8876, NOW() - INTERVAL '1 day' * (random() * 3)),
  (6, 9241, NOW() - INTERVAL '1 day' * (random() * 3)),
  (7, 6829, NOW() - INTERVAL '1 day' * (random() * 3)),
  (8, 12340, NOW() - INTERVAL '1 day' * (random() * 3)),
  (9, 6584, NOW() - INTERVAL '1 day' * (random() * 3)),
  (10, 9322, NOW() - INTERVAL '1 day' * (random() * 3)),
  (11, 2388, NOW() - INTERVAL '1 day' * (random() * 3)),
  (12, 11864, NOW() - INTERVAL '1 day' * (random() * 3)),
  (13, 14495, NOW() - INTERVAL '1 day' * (random() * 3)),
  (14, 9629, NOW() - INTERVAL '1 day' * (random() * 3));

-- Create an index on the "username" column of the "users" table
CREATE INDEX IF NOT EXISTS idx_username ON users (username);

-- Create an index on the "email" column of the "users" table
CREATE INDEX IF NOT EXISTS idx_email ON users (email);

-- Create an index on the "user_id" column of the "scores" table
CREATE INDEX IF NOT EXISTS idx_user_id ON scores (user_id);

CREATE OR REPLACE FUNCTION before_insert_score() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM scores WHERE user_id = NEW.user_id) >= 10 THEN
    DELETE FROM scores
    WHERE user_id = NEW.user_id
    AND score = (SELECT MIN(score) FROM scores WHERE user_id = NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
