/** Formatting helpers shared across the app. */

export const formatPrice = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num);
};

export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/** "Smart Home" -> "smart-home" */
export const toSlug = (s) => String(s).toLowerCase().replace(/\s+/g, '-');

/** "gaming-consoles" -> "Gaming Consoles" */
export const fromSlug = (slug) =>
  String(slug)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const SPEC_LABELS = {
  display: 'Display',
  processor: 'Processor',
  ram: 'RAM',
  storage: 'Storage',
  battery: 'Battery',
  camera: 'Camera',
  connectivity: 'Connectivity',
  operating_system: 'Operating System',
  dimensions: 'Dimensions',
  weight: 'Weight',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

export const PRICE_RANGES = [
  { label: 'Any price', min: '', max: '' },
  { label: 'Under $100', min: '', max: 100 },
  { label: '$100 – $300', min: 100, max: 300 },
  { label: '$300 – $700', min: 300, max: 700 },
  { label: '$700 – $1,500', min: 700, max: 1500 },
  { label: 'Over $1,500', min: 1500, max: '' },
];
