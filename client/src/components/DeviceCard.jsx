import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import DeviceVisual from './DeviceVisual.jsx';
import Rating from './Rating.jsx';
import { formatPrice } from '../utils/format.js';
import { useCompare } from '../context/CompareContext.jsx';

/** Device grid card with visual, price, rating and add-to-compare. */
export default function DeviceCard({ device }) {
  const { isInCompare, toggleDevice } = useCompare();
  const inCompare = isInCompare(device.id);

  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <Link
        to={`/devices/${device.id}`}
        aria-label={`View details for ${device.name}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <DeviceVisual device={device} className="transition-transform duration-500 group-hover:scale-[1.06]" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="badge bg-brand-500/10 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300">
            {device.category}
          </span>
          <Rating value={device.rating} />
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
          <Link to={`/devices/${device.id}`} className="hover:text-brand-600 dark:hover:text-neon-400">
            {device.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div>
            <p className="text-base font-bold text-slate-900 dark:text-white">{formatPrice(device.price)}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">demo price</p>
          </div>
          <button
            type="button"
            onClick={() => toggleDevice(device)}
            aria-pressed={inCompare}
            aria-label={inCompare ? `Remove ${device.name} from comparison` : `Add ${device.name} to comparison`}
            className={`btn-secondary !px-3 !py-2 ${inCompare
              ? '!border-brand-500 !text-brand-600 dark:!border-neon-400 dark:!text-neon-400'
              : ''}`}
          >
            <Scale className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs">{inCompare ? 'Added' : 'Compare'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
