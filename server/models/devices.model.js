/**
 * Devices data access — all queries are parameterized.
 */
const { query } = require('../config/db');

const DEVICE_COLUMNS = `
  d.id, d.name, d.brand, d.category, d.price, d.rating, d.description,
  d.image_url, d.pros, d.cons, d.in_stock, d.release_date, d.created_at
`;

const SORTABLE = {
  price_asc: 'd.price ASC',
  price_desc: 'd.price DESC',
  rating: 'd.rating DESC, d.name ASC',
  newest: 'd.release_date DESC NULLS LAST, d.id DESC',
};

/** Build WHERE clause + params from filter options. */
function buildFilters({ search, category, brand, minPrice, maxPrice }) {
  const conditions = [];
  const params = [];

  if (search && search.trim()) {
    params.push(`%${search.trim().toLowerCase()}%`);
    const i = params.length;
    conditions.push(
      `(LOWER(d.name) LIKE $${i} OR LOWER(d.brand) LIKE $${i} OR LOWER(d.category) LIKE $${i} OR LOWER(d.description) LIKE $${i} OR LOWER(COALESCE(s.processor,'')) LIKE $${i} OR LOWER(COALESCE(s.operating_system,'')) LIKE $${i})`,
    );
  }
  if (category) {
    params.push(category);
    conditions.push(`LOWER(REPLACE(d.category, ' ', '-')) = LOWER($${params.length})`);
  }
  if (brand) {
    params.push(brand);
    conditions.push(`LOWER(d.brand) = LOWER($${params.length})`);
  }
  if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
    params.push(Number(minPrice));
    conditions.push(`d.price >= $${params.length}`);
  }
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    params.push(Number(maxPrice));
    conditions.push(`d.price <= $${params.length}`);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
}

/**
 * List devices with filters, sorting and pagination.
 * @returns {{devices: Array, total: number, page: number, limit: number, totalPages: number}}
 */
async function listDevices(opts = {}) {
  const page = Math.max(1, parseInt(opts.page, 10) || 1);
  const limit = Math.min(48, Math.max(1, parseInt(opts.limit, 10) || 9));
  const offset = (page - 1) * limit;
  const orderBy = SORTABLE[opts.sort] || SORTABLE.newest;
  const { where, params } = buildFilters(opts);

  const countRes = await query(
    `SELECT COUNT(*)::int AS total FROM devices d LEFT JOIN specifications s ON s.device_id = d.id ${where}`,
    params,
  );
  const total = countRes.rows[0].total;

  const listParams = [...params, limit, offset];
  const res = await query(
    `SELECT ${DEVICE_COLUMNS}
     FROM devices d
     LEFT JOIN specifications s ON s.device_id = d.id
     ${where}
     ORDER BY ${orderBy}
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    listParams,
  );

  return {
    devices: res.rows,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/** Device with full specifications, or null. */
async function getDeviceById(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId < 1) return null;

  const devRes = await query(
    `SELECT ${DEVICE_COLUMNS} FROM devices d WHERE d.id = $1`,
    [numId],
  );
  if (devRes.rows.length === 0) return null;

  const specRes = await query(
    `SELECT display, processor, ram, storage, battery, camera,
            connectivity, operating_system, dimensions, weight
     FROM specifications WHERE device_id = $1`,
    [numId],
  );
  return { ...devRes.rows[0], specifications: specRes.rows[0] || null };
}

/** Up to `limit` devices in the same category, excluding `excludeId`. */
async function getRelatedDevices(category, excludeId, limit = 4) {
  const res = await query(
    `SELECT ${DEVICE_COLUMNS}
     FROM devices d
     WHERE LOWER(d.category) = LOWER($1) AND d.id <> $2
     ORDER BY d.rating DESC
     LIMIT $3`,
    [category, Number(excludeId), Math.min(8, limit)],
  );
  return res.rows;
}

/** Search suggestions (autocomplete) — devices + matching categories. */
async function searchDevices(q, limit = 8) {
  const term = `%${String(q || '').trim().toLowerCase()}%`;
  const res = await query(
    `SELECT d.id, d.name, d.brand, d.category, d.price, d.rating
     FROM devices d
     LEFT JOIN specifications s ON s.device_id = d.id
     WHERE LOWER(d.name) LIKE $1 OR LOWER(d.brand) LIKE $1
        OR LOWER(d.category) LIKE $1 OR LOWER(d.description) LIKE $1
        OR LOWER(COALESCE(s.processor,'')) LIKE $1
     ORDER BY d.rating DESC, d.name ASC
     LIMIT $2`,
    [term, Math.min(20, limit)],
  );
  return res.rows;
}

/** Distinct brands for filters. */
async function listBrands() {
  const res = await query(
    `SELECT brand, COUNT(*)::int AS count FROM devices GROUP BY brand ORDER BY brand ASC`,
  );
  return res.rows;
}

/** Category aggregates: name, count, price range. */
async function listCategories() {
  const res = await query(
    `SELECT category,
            COUNT(*)::int AS device_count,
            MIN(price)::numeric(10,2) AS min_price,
            MAX(price)::numeric(10,2) AS max_price,
            AVG(rating)::numeric(3,2) AS avg_rating
     FROM devices
     GROUP BY category
     ORDER BY category ASC`,
  );
  return res.rows;
}

module.exports = {
  listDevices,
  getDeviceById,
  getRelatedDevices,
  searchDevices,
  listBrands,
  listCategories,
};
