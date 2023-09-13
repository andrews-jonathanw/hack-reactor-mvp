const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = new Pool({
  user: 'jandrews',
  host: 'localhost',
  database: 'spacewars',
  port: 5432,
});

async function hashOldPasswords() {
  try {
    const users = await pool.query('SELECT id, password FROM users');

    for (const user of users.rows) {
      const { id, password } = user;
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
    }
    console.log("Successfully hashed all passwords");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
// use this function to hash old passwords from database that wasnt using bcrypt
// hashOldPasswords();

module.exports = pool;