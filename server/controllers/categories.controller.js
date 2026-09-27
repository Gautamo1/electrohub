/**
 * Categories controller.
 */
const devicesModel = require('../models/devices.model');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/categories
exports.list = asyncHandler(async (req, res) => {
  const categories = await devicesModel.listCategories();
  res.json({
    categories: categories.map((c) => ({
      name: c.category,
      slug: c.category.toLowerCase().replace(/ /g, '-'),
      deviceCount: c.device_count,
      minPrice: Number(c.min_price),
      maxPrice: Number(c.max_price),
      avgRating: Number(c.avg_rating),
    })),
  });
});
