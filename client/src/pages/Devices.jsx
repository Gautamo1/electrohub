import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { api } from '../services/api.js';
import DeviceCard from '../components/DeviceCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { DeviceGridSkeleton } from '../components/LoadingSkeleton.jsx';
import { SORT_OPTIONS, fromSlug } from '../utils/format.js';
import { useDebounce } from '../hooks/useDebounce.js';

const PAGE_SIZE = 9;

export default function Devices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilters, setMobileFilters] = useState(false);
  const fetchSeq = useRef(0);

  // ---- URL params are the single source of truth ----
  const filters = useMemo(() => ({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Math.max(1, parseInt(searchParams.get('page'), 10) || 1),
  }), [searchParams]);

  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedInput = useDebounce(searchInput, 400);

  // Keep input in sync when the URL changes externally (navbar search, links)
  useEffect(() => { setSearchInput(filters.search); }, [filters.search]);

  // Push debounced typing into the URL (resets to page 1)
  useEffect(() => {
    if (debouncedInput === filters.search) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedInput) next.set('search', debouncedInput);
    else next.delete('search');
    next.delete('page');
    setSearchParams(next, { replace: true });
  }, [debouncedInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    api.getBrands().then((d) => setBrands(d.brands || [])).catch(() => {});
  }, []);

  const applyFilters = (f) => {
    const next = new URLSearchParams();
    if (f.search) next.set('search', f.search);
    if (f.category) next.set('category', f.category);
    if (f.brand) next.set('brand', f.brand);
    if (f.minPrice) next.set('minPrice', String(f.minPrice));
    if (f.maxPrice) next.set('maxPrice', String(f.maxPrice));
    if (f.sort && f.sort !== 'newest') next.set('sort', f.sort);
    if (f.page > 1) next.set('page', String(f.page));
    setSearchParams(next);
  };

  const clearAll = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const gotoPage = (p) => {
    const next = new URLSearchParams(searchParams);
    if (p > 1) next.set('page', String(p));
    else next.delete('page');
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---- Fetch on every param change ----
  useEffect(() => {
    const seq = ++fetchSeq.current;
    setLoading(true);
    setError(null);
    api.getDevices({ ...filters, limit: PAGE_SIZE })
      .then((res) => { if (seq === fetchSeq.current) { setData(res); setLoading(false); } })
      .catch((e) => { if (seq === fetchSeq.current) { setError(e.message); setLoading(false); } });
  }, [filters]);

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.brand || filters.minPrice || filters.maxPrice,
  );

  const heading = filters.category
    ? fromSlug(filters.category)
    : filters.search ? `Results for “${filters.search}”` : 'All devices';

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="section-title">{heading}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {loading ? 'Loading…' : `${data?.total ?? 0} device${data?.total === 1 ? '' : 's'} found`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setMobileFilters(true)} className="btn-secondary lg:hidden" aria-expanded={mobileFilters}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filters
            </button>
            <label htmlFor="sort-select" className="sr-only">Sort devices</label>
            <select
              id="sort-select"
              value={filters.sort}
              onChange={(e) => applyFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="input !w-auto !py-2.5 text-sm"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        {/* Local search box (keeps URL in sync via debounce above) */}
        <div className="max-w-md">
          <label htmlFor="page-search" className="sr-only">Search devices</label>
          <input
            id="page-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Filter devices…"
            className="input"
          />
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.category && (
              <span className="badge bg-brand-500/10 text-brand-700 dark:text-brand-300">
                {fromSlug(filters.category)}
                <button type="button" aria-label="Clear category filter" className="ml-1 hover:text-rose-500" onClick={() => applyFilters({ ...filters, category: '', page: 1 })}><X className="h-3 w-3" aria-hidden="true" /></button>
              </span>
            )}
            {filters.brand && (
              <span className="badge bg-brand-500/10 text-brand-700 dark:text-brand-300">
                {filters.brand}
                <button type="button" aria-label="Clear brand filter" className="ml-1 hover:text-rose-500" onClick={() => applyFilters({ ...filters, brand: '', page: 1 })}><X className="h-3 w-3" aria-hidden="true" /></button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="badge bg-brand-500/10 text-brand-700 dark:text-brand-300">
                ${filters.minPrice || 0} – ${filters.maxPrice || '∞'}
                <button type="button" aria-label="Clear price filter" className="ml-1 hover:text-rose-500" onClick={() => applyFilters({ ...filters, minPrice: '', maxPrice: '', page: 1 })}><X className="h-3 w-3" aria-hidden="true" /></button>
              </span>
            )}
            <button type="button" onClick={clearAll} className="text-xs font-semibold text-slate-400 underline-offset-2 hover:text-rose-500 hover:underline">
              Clear all
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filters (desktop sticky / mobile overlay) */}
        <div className={mobileFilters ? 'fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 lg:static lg:bg-transparent lg:p-0' : 'hidden lg:block'}>
          <FilterPanel
            filters={filters}
            brands={brands}
            open
            onChange={(f) => { applyFilters(f); setMobileFilters(false); }}
            onClear={() => { clearAll(); setMobileFilters(false); }}
            onClose={() => setMobileFilters(false)}
          />
        </div>

        {/* Results */}
        <div>
          {error ? (
            <ErrorMessage message={error} onRetry={() => applyFilters(filters)} />
          ) : loading ? (
            <DeviceGridSkeleton count={6} />
          ) : data.devices.length === 0 ? (
            <EmptyState message="No devices match your current search and filters." action={
              hasActiveFilters
                ? <button type="button" onClick={clearAll} className="btn-primary mt-1">Clear filters</button>
                : null
            } />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.devices.map((d) => <DeviceCard key={d.id} device={d} />)}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => gotoPage(filters.page - 1)}
                    disabled={filters.page <= 1}
                    aria-label="Previous page"
                    className="btn-secondary !p-2.5 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => gotoPage(p)}
                      aria-current={p === filters.page ? 'page' : undefined}
                      className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
                        p === filters.page
                          ? 'bg-gradient-to-r from-brand-600 to-neon-500 text-white shadow-glow'
                          : 'border border-slate-300 text-slate-600 hover:border-brand-400 dark:border-slate-600 dark:text-slate-300 dark:hover:border-neon-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => gotoPage(filters.page + 1)}
                    disabled={filters.page >= data.totalPages}
                    aria-label="Next page"
                    className="btn-secondary !p-2.5 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
