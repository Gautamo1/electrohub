/**
 * Contact controller — stores validated submissions in PostgreSQL.
 */
const contactModel = require('../models/contact.model');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/contact
exports.create = asyncHandler(async (req, res) => {
  const saved = await contactModel.createContact(req.contact);
  res.status(201).json({
    message: 'Thanks! Your message has been received.',
    id: saved.id,
    createdAt: saved.created_at,
  });
});
