/**
 * PostgreSQL connection pool.
 * Reads DATABASE_URL from the environment (never hardcode credentials).
 * Works with local PostgreSQL and Render-managed PostgreSQL.
 */
require('dotenv').config({
  path: [require('path').join(__dirname, '..', '.env'), require('path').join(__dirname, '..', '..', '.env')],
});

const { Pool } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:***@localhost:5432/electrohub';

// Render (and other managed providers) require SSL; local dev usually does not.
const needsSsl = /render\.com|sslmode=require/i.test(connectionString);

const pool = new Pool({
  connectionString,
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Run a parameterized query.
 * @param {string} text SQL with $1, $2 ... placeholders
 * @param {Array} [params] bind parameters
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
