/**
 * Devices controller — thin HTTP layer over devices.model.
 */
const devicesModel = require('../models/devices.model');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

// GET /api/devices
exports.list = asyncHandler(async (req, res) => {
  const { q, search, category, brand, minPrice, maxPrice, sort, page, limit } = req.query;
  const result = await devicesModel.listDevices({
    search: q || search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
  });
  res.json(result);
});

// GET /api/devices/brands
exports.brands = asyncHandler(async (req, res) => {
  res.json({ brands: await devicesModel.listBrands() });
});

// GET /api/devices/category/:category
exports.byCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page, limit, sort } = req.query;
  const result = await devicesModel.listDevices({ category, page, limit, sort });
  if (result.total === 0) {
    // Still a valid empty list — but flag unknown categories clearly.
    const all = await devicesModel.listCategories();
    const known = all.some(
      (c) => c.category.toLowerCase().replace(/ /g, '-') === String(category).toLowerCase(),
    );
    if (!known) throw new ApiError(404, `Unknown category: ${category}`);
  }
  res.json(result);
});

// GET /api/devices/:id
exports.byId = asyncHandler(async (req, res) => {
  const device = await devicesModel.getDeviceById(req.params.id);
  if (!device) throw new ApiError(404, `Device not found: id=${req.params.id}`);
  const related = await devicesModel.getRelatedDevices(device.category, device.id, 4);
  res.json({ device, related });
});

// GET /api/search?q=
exports.search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || req.query.search || '').trim();
  if (!q) throw new ApiError(400, 'Query parameter "q" is required');
  const results = await devicesModel.searchDevices(q, 10);
  res.json({ query: q, count: results.length, results });
});
