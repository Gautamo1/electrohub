const router = require('express').Router();
const { query } = require('../config/db');

/**
 * GET /api/health — liveness + database connectivity.
 * Responds { "status": "ok" } when the API and DB are healthy.
 */
router.get('/', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Health check DB failure:', err.message);
    res.status(503).json({ status: 'error', error: 'database unreachable' });
  }
});

module.exports = router;
