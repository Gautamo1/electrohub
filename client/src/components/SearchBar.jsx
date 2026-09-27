import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { api } from '../services/api.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { formatPrice } from '../utils/format.js';

/**
 * Global search bar with autocomplete dropdown.
 * Enter (or clicking a suggestion) navigates to /devices?search=…
 */
export default function SearchBar({ autoFocus = false, size = 'md', placeholder = 'Search devices, brands, categories…', onSubmitted }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const boxRef = useRef(null);
  const debounced = useDebounce(query, 250);

  const big = size === 'lg';

  // Fetch suggestions when the debounced query changes
  useEffect(() => {
    let cancelled = false;
    if (debounced.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }
    api.search(debounced.trim())
      .then((data) => { if (!cancelled) { setSuggestions(data.results || []); setOpen(true); } })
      .catch(() => { if (!cancelled) setSuggestions([]); });
    return () => { cancelled = true; };
  }, [debounced]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (term) => {
    const t = (term ?? query).trim();
    if (!t) return;
    setOpen(false);
    onSubmitted?.();
    navigate(`/devices?search=${encodeURIComponent(t)}`);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlight >= 0 && suggestions[highlight]) {
        navigate(`/devices/${suggestions[highlight].id}`);
        setOpen(false);
      } else {
        go();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlight(-1);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full" role="combobox" aria-expanded={open && suggestions.length > 0} aria-haspopup="listbox" aria-owns="search-suggestions">
      <label htmlFor="global-search" className="sr-only">Search devices</label>
      <div className="relative">
        <Search className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 ${big ? 'h-5 w-5' : 'h-4 w-4'}`} aria-hidden="true" />
        <input
          id="global-search"
          type="search"
          role="searchbox"
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setHighlight(-1); }}
          onKeyDown={onKeyDown}
          onFocus={() => suggestions.length && setOpen(true)}
          placeholder={placeholder}
          aria-controls="search-suggestions"
          aria-activedescendant={highlight >= 0 ? `suggestion-${highlight}` : undefined}
          className={`input pl-10 ${query ? 'pr-10' : ''} ${big ? '!py-3.5 !text-base' : ''}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95"
        >
          {suggestions.map((s, i) => (
            <li key={s.id} id={`suggestion-${i}`} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => navigate(`/devices/${s.id}`) || (setOpen(false))}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${i === highlight ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200'}`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{s.name}</span>
                  <span className="block text-xs text-slate-400">{s.brand} · {s.category}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">{formatPrice(s.price)}</span>
              </button>
            </li>
          ))}
          <li className="border-t border-slate-100 px-3 pb-1 pt-2 dark:border-slate-700">
            <button type="button" onClick={() => go()} className="text-xs font-semibold text-brand-600 hover:underline dark:text-neon-400">
              See all results for “{query.trim()}” →
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
