import { Link } from 'react-router-dom';
import { X, Trophy } from 'lucide-react';
import DeviceVisual from './DeviceVisual.jsx';
import Rating from './Rating.jsx';
import { formatPrice, SPEC_LABELS } from '../utils/format.js';

/**
 * Side-by-side comparison table (up to 4 devices).
 * Highlights the lowest price and highest rating.
 */
export default function CompareTable({ devices, onRemove }) {
  if (!devices.length) return null;

  const cheapest = Math.min(...devices.map((d) => Number(d.price)));
  const topRated = Math.max(...devices.map((d) => Number(d.rating)));

  const specKeys = Object.keys(SPEC_LABELS);
  const rows = specKeys
    .map((key) => ({ key, values: devices.map((d) => d.specifications?.[key] || '—') }))
    .filter((r) => r.values.some((v) => v !== '—'));

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[720px] border-collapse bg-white/70 text-sm backdrop-blur dark:bg-white/[0.03]">
        <caption className="sr-only">Device comparison</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 z-10 w-40 bg-slate-50 p-4 text-left align-bottom text-xs font-bold uppercase tracking-wide text-slate-500 dark:bg-[#0e1428] dark:text-slate-400">
              Spec
            </th>
            {devices.map((d) => (
              <th key={d.id} scope="col" className="min-w-[200px] bg-slate-50/80 p-4 text-left align-top dark:bg-[#0e1428]/90">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => onRemove(d.id)}
                    aria-label={`Remove ${d.name} from comparison`}
                    className="absolute -right-1 -top-1 rounded-full bg-slate-200 p-1 text-slate-500 transition hover:bg-rose-500 hover:text-white dark:bg-slate-700 dark:text-slate-300"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <div className="h-24 w-24 overflow-hidden rounded-xl">
                    <DeviceVisual device={d} size="md" className="!min-h-0 !rounded-xl" />
                  </div>
                  <Link to={`/devices/${d.id}`} className="mt-2 block text-sm font-semibold leading-snug text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-neon-400">
                    {d.name}
                  </Link>
                  <p className="text-xs text-slate-400">{d.brand} · {d.category}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-200 dark:border-slate-700">
            <th scope="row" className="sticky left-0 z-10 bg-white p-4 text-left font-semibold text-slate-600 dark:bg-[#0b1020] dark:text-slate-300">Price</th>
            {devices.map((d) => {
              const best = Number(d.price) === cheapest;
              return (
                <td key={d.id} className={`p-4 font-bold ${best ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>
                  <span className="flex items-center gap-1.5">
                    {formatPrice(d.price)}
                    {best && devices.length > 1 && <Trophy className="h-4 w-4" aria-label="Lowest price" />}
                  </span>
                  {best && <span className="block text-[10px] font-medium uppercase tracking-wide opacity-70">lowest price</span>}
                </td>
              );
            })}
          </tr>
          <tr className="border-t border-slate-200 bg-slate-900/[0.03] dark:border-slate-700 dark:bg-white/[0.03]">
            <th scope="row" className="sticky left-0 z-10 bg-inherit p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Rating</th>
            {devices.map((d) => {
              const best = Number(d.rating) === topRated;
              return (
                <td key={d.id} className="p-4">
                  <span className={`flex items-center gap-1.5 ${best && devices.length > 1 ? 'font-bold' : ''}`}>
                    <Rating value={d.rating} />
                    {best && devices.length > 1 && <Trophy className="h-4 w-4 text-amber-500" aria-label="Highest rating" />}
                  </span>
                </td>
              );
            })}
          </tr>
          <tr className="border-t border-slate-200 dark:border-slate-700">
            <th scope="row" className="sticky left-0 z-10 bg-white p-4 text-left font-semibold text-slate-600 dark:bg-[#0b1020] dark:text-slate-300">Availability</th>
            {devices.map((d) => (
              <td key={d.id} className="p-4">
                <span className={`badge ${d.in_stock ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                  {d.in_stock ? 'In stock' : 'Out of stock'}
                </span>
              </td>
            ))}
          </tr>
          {rows.map((row, i) => (
            <tr key={row.key} className={`border-t border-slate-200 dark:border-slate-700 ${i % 2 ? 'bg-slate-900/[0.03] dark:bg-white/[0.03]' : ''}`}>
              <th scope="row" className={`sticky left-0 z-10 p-4 text-left font-semibold text-slate-600 dark:text-slate-300 ${i % 2 ? 'bg-[#f4f6fa] dark:bg-[#101830]' : 'bg-white dark:bg-[#0b1020]'}`}>
                {SPEC_LABELS[row.key]}
              </th>
              {row.values.map((v, j) => (
                <td key={j} className="p-4 text-slate-700 dark:text-slate-200">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
