// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'SOPORTE',
//   host: 'localhost',
//   database: 'BD_SG',
//   password: '210108',
//   port: 5432,
// });

// module.exports = pool;

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;

