/**
 * ElectroHub API server.
 * - Serves the REST API under /api
 * - In production (or whenever client/dist exists) also serves the
 *   React production build, so Render runs everything as ONE web service.
 */
require('dotenv').config({
  path: [require('path').join(__dirname, '.env'), require('path').join(__dirname, '..', '.env')],
});

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const healthRoutes = require('./routes/health.routes');
const deviceRoutes = require('./routes/devices.routes');
const categoryRoutes = require('./routes/categories.routes');
const contactRoutes = require('./routes/contact.routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { initDatabase } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;
const DIST_DIR = path.join(__dirname, '..', 'client', 'dist');
const SERVE_CLIENT = fs.existsSync(path.join(DIST_DIR, 'index.html'));

app.set('trust proxy', true);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '100kb' }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ---- API routes ----
app.use('/api/health', healthRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/search', (req, res, next) => {
  // GET /api/search?q=...  (delegates to devices controller.search)
  req.query.search = req.query.search || req.query.q;
  return next();
}, require('./controllers/devices.controller').search);
app.use('/api', notFound);

// ---- Static React build (production) ----
if (SERVE_CLIENT) {
  app.use(express.static(DIST_DIR, { maxAge: '1h', index: false }));
  // SPA fallback: any non-API GET returns index.html
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      name: 'ElectroHub API',
      message: 'Frontend build not found. Run `npm run build` in /client or use the Vite dev server.',
      endpoints: [
        'GET /api/health',
        'GET /api/devices',
        'GET /api/devices/:id',
        'GET /api/devices/brands',
        'GET /api/devices/category/:category',
        'GET /api/categories',
        'GET /api/search?q=',
        'POST /api/contact',
      ],
    });
  });
}

app.use(errorHandler);

// ---- Boot: initialize DB (idempotent), then listen ----
async function main() {
  if (process.env.SKIP_DB_INIT !== 'true') {
    try {
      await initDatabase();
    } catch (err) {
      console.error('Database initialization failed:', err.message);
      if (process.env.DB_DIAGNOSTICS === 'true') {
        try {
          await require('./db/diagnostics').runDbDiagnostics();
        } catch (diagErr) {
          console.error('[diag] crashed:', diagErr.message);
        }
      }
      if (process.env.NODE_ENV === 'production') {
        console.error('Exiting — production requires a working database.');
        process.exit(1);
      }
    }
  }
  app.listen(PORT, () => {
    console.log(`ElectroHub server listening on port ${PORT} (${SERVE_CLIENT ? 'API + client' : 'API only'}, ${process.env.NODE_ENV || 'development'})`);
  });
}

if (require.main === module) main();

module.exports = app;
