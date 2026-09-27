import { SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../data/categories.js';
import { PRICE_RANGES } from '../utils/format.js';

/**
 * Filter panel: category, brand, price range.
 * Controlled component — `filters` + `onChange`.
 */
export default function FilterPanel({ filters, brands = [], onChange, onClear, open = true, onClose }) {
  const set = (patch) => onChange({ ...filters, ...patch, page: 1 });

  return (
    <aside
      aria-label="Device filters"
      className={`card sticky top-24 p-5 ${open ? '' : 'hidden lg:block'}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filters
        </h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onClear} className="text-xs font-semibold text-brand-600 hover:underline dark:text-neon-400">
            Clear all
          </button>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Close filters" className="btn-ghost !p-1.5 lg:hidden">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <fieldset className="mb-5">
        <legend className="label">Category</legend>
        <div className="max-h-56 space-y-1 overflow-auto pr-1">
          <button
            type="button"
            onClick={() => set({ category: '' })}
            aria-pressed={!filters.category}
            className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${!filters.category ? 'bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/5'}`}
          >
            All categories
          </button>
          {CATEGORIES.map((c) => {
            const active = filters.category === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => set({ category: active ? '' : c.slug })}
                aria-pressed={active}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${active ? 'bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/5'}`}
              >
                <c.icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                {c.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mb-5">
        <legend className="label">Brand</legend>
        <select
          value={filters.brand || ''}
          onChange={(e) => set({ brand: e.target.value })}
          className="input"
          aria-label="Filter by brand"
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b.brand} value={b.brand}>{b.brand} ({b.count})</option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="label">Price range</legend>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const active = String(filters.minPrice ?? '') === String(r.min) && String(filters.maxPrice ?? '') === String(r.max);
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => set({ minPrice: r.min, maxPrice: r.max })}
                aria-pressed={active}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${active ? 'bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/5'}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-price" className="sr-only">Minimum price</label>
            <input id="min-price" type="number" min="0" placeholder="Min $" value={filters.minPrice ?? ''}
              onChange={(e) => set({ minPrice: e.target.value })} className="input !py-2 text-xs" />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">Maximum price</label>
            <input id="max-price" type="number" min="0" placeholder="Max $" value={filters.maxPrice ?? ''}
              onChange={(e) => set({ maxPrice: e.target.value })} className="input !py-2 text-xs" />
          </div>
        </div>
      </fieldset>
    </aside>
  );
}
