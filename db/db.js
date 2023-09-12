const { Pool } = require('pg');

const pool = new Pool({
  user: 'jandrews',
  host: 'localhost',
  database: 'spacewars',
  port: 5432,
});

module.exports = pool;