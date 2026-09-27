/**
 * Contact form submissions data access — parameterized queries.
 */
const { query } = require('../config/db');

async function createContact({ name, email, subject, message }) {
  const res = await query(
    `INSERT INTO contacts (name, email, subject, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, subject, created_at`,
    [name, email, subject, message],
  );
  return res.rows[0];
}

// eslint-disable-next-line no-unused-vars
async function countContacts() {
  const res = await query('SELECT COUNT(*)::int AS total FROM contacts');
  return res.rows[0].total;
}

module.exports = { createContact, countContacts };
