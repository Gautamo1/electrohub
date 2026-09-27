import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import { CATEGORIES } from '../data/categories.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatPrice } from '../utils/format.js';

export default function Categories() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    setStats(null);
    api.getCategories()
      .then((d) => setStats(d.categories || []))
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const metaBySlug = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">All categories</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Every category in the hub, with live counts and price ranges from the database.
        </p>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : !stats ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading categories">
          {Array.from({ length: 9 }).map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => {
            const meta = metaBySlug[s.slug] || {};
            const Icon = meta.icon || null;
            const gradient = meta.gradient || 'from-brand-500 to-neon-400';
            return (
              <Link key={s.slug} to={`/devices?category=${s.slug}`} className="card card-hover group relative overflow-hidden p-6">
                <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} aria-hidden="true" />
                <div className="flex items-start justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                  </span>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-500" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{s.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                  {meta.description || `Explore ${s.deviceCount} ${s.name.toLowerCase()} options.`}
                </p>
                <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex gap-1.5">
                    <dt className="font-semibold text-slate-700 dark:text-slate-200">{s.deviceCount}</dt>
                    <dd>devices</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>from</dt>
                    <dd className="font-semibold text-emerald-600 dark:text-emerald-400">{formatPrice(s.minPrice)}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>avg</dt>
                    <dd className="font-semibold text-amber-500">{Number(s.avgRating).toFixed(1)} ★</dd>
                  </div>
                </dl>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
