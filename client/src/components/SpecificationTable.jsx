import { SPEC_LABELS } from '../utils/format.js';

/** Two-column table of a device's full specifications. */
export default function SpecificationTable({ specifications }) {
  if (!specifications) return null;
  const entries = Object.entries(specifications).filter(([, v]) => v);

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <caption className="sr-only">Full specifications</caption>
        <tbody>
          {entries.map(([key, value], i) => (
            <tr key={key} className={i % 2 ? 'bg-slate-900/[0.03] dark:bg-white/[0.03]' : ''}>
              <th scope="row" className="w-2/5 px-4 py-3 text-left align-top font-semibold text-slate-600 dark:text-slate-300">
                {SPEC_LABELS[key] || key}
              </th>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
