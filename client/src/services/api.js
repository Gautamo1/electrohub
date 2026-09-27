/**
 * Thin fetch wrapper around the ElectroHub REST API.
 * Uses relative /api paths so it works with the Vite dev proxy and
 * with the Express server serving the production build on Render.
 */
const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON response */ }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }
  return data;
}

export const api = {
  health: () => request('/health'),

  /**
   * GET /api/devices with filters.
   * @param {{search?:string, category?:string, brand?:string, minPrice?:number,
   *          maxPrice?:number, sort?:string, page?:number, limit?:number}} params
   */
  getDevices: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
    const s = qs.toString();
    return request(`/devices${s ? `?${s}` : ''}`);
  },

  getDevice: (id) => request(`/devices/${encodeURIComponent(id)}`),
  getBrands: () => request('/devices/brands'),
  getDevicesByCategory: (category, params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')),
    ).toString();
    return request(`/devices/category/${encodeURIComponent(category)}${qs ? `?${qs}` : ''}`);
  },

  getCategories: () => request('/categories'),
  search: (q) => request(`/search?q=${encodeURIComponent(q)}`),

  submitContact: (payload) => request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
