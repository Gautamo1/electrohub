const { ApiError } = require('./errorHandler');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validate POST /api/contact payload.
 * Returns 400 with a per-field `errors` object when invalid.
 */
function validateContact(req, res, next) {
  const errors = {};
  const { name, email, subject, message } = req.body || {};

  if (typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.trim().length > 120) {
    errors.name = 'Name must be 120 characters or fewer.';
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  } else if (email.trim().length > 254) {
    errors.email = 'Email must be 254 characters or fewer.';
  }

  if (typeof subject !== 'string' || subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  } else if (subject.trim().length > 200) {
    errors.subject = 'Subject must be 200 characters or fewer.';
  }

  if (typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  } else if (message.trim().length > 5000) {
    errors.message = 'Message must be 5000 characters or fewer.';
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  // Normalize before it reaches the controller.
  req.contact = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
  };
  return next();
}

module.exports = { validateContact };
