/**
 * Database initialization:
 *  1. Applies server/db/schema.sql (idempotent — CREATE TABLE IF NOT EXISTS).
 *  2. Seeds devices + specifications only when the devices table is empty.
 *
 * Usage:  npm run db:init          (standalone)
 * Called automatically from server.js on boot unless SKIP_DB_INIT=true.
 */
require('dotenv').config({
  path: [require('path').join(__dirname, '..', '.env'), require('path').join(__dirname, '..', '..', '.env')],
});

const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');
const { DEVICES } = require('./seed-data');

async function initDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM devices');
  if (rows[0].count > 0) {
    console.log(`db:init — devices table already has ${rows[0].count} rows, skipping seed.`);
    return { seeded: 0, existing: rows[0].count };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let inserted = 0;
    for (const d of DEVICES) {
      const devRes = await client.query(
        `INSERT INTO devices (name, brand, category, price, rating, description, image_url, pros, cons, in_stock, release_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11)
         RETURNING id`,
        [
          d.name, d.brand, d.category, d.price, d.rating, d.description,
          d.image_url || null,
          JSON.stringify(d.pros || []),
          JSON.stringify(d.cons || []),
          d.in_stock !== false,
          d.release_date || null,
        ],
      );
      const s = d.specs || {};
      await client.query(
        `INSERT INTO specifications
           (device_id, display, processor, ram, storage, battery, camera, connectivity, operating_system, dimensions, weight)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          devRes.rows[0].id,
          s.display || null, s.processor || null, s.ram || null, s.storage || null,
          s.battery || null, s.camera || null, s.connectivity || null,
          s.operating_system || null, s.dimensions || null, s.weight || null,
        ],
      );
      inserted += 1;
    }
    await client.query('COMMIT');
    console.log(`db:init — seeded ${inserted} devices with specifications.`);
    return { seeded: inserted, existing: 0 };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('db:init failed:', err.message);
      process.exit(1);
    });
}

module.exports = { initDatabase };
