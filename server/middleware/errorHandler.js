/**
 * Shared error helpers + async route wrapper.
 */
class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

/** Wrap async express handlers so rejections hit the error middleware. */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Postgres unique violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Duplicate record', details: err.detail });
  }
  // Invalid text representation (e.g. bad number in query string)
  if (err.code === '22P02') {
    return res.status(400).json({ error: 'Invalid parameter value' });
  }

  const status = err.statusCode || 500;
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('API error:', err);
  }
  return res.status(status).json({
    error: status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
  });
}

/** 404 for unknown /api/* routes — must be mounted after all API routes. */
function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { ApiError, asyncHandler, errorHandler, notFound };
