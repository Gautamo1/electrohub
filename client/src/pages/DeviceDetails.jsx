import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Scale, Check, Minus, CalendarDays, Tag } from 'lucide-react';
import { api } from '../services/api.js';
import DeviceVisual from '../components/DeviceVisual.jsx';
import Rating from '../components/Rating.jsx';
import SpecificationTable from '../components/SpecificationTable.jsx';
import DeviceCard from '../components/DeviceCard.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import PageSkeleton from '../components/LoadingSkeleton.jsx';
import { formatPrice, formatDate } from '../utils/format.js';
import { useCompare } from '../context/CompareContext.jsx';

export default function DeviceDetails() {
  const { id } = useParams();
  const { isInCompare, toggleDevice } = useCompare();
  const [state, setState] = useState({ loading: true, error: null, device: null, related: [] });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, device: null, related: [] });
    api.getDevice(id)
      .then((data) => { if (!cancelled) setState({ loading: false, error: null, device: data.device, related: data.related || [] }); })
      .catch((e) => { if (!cancelled) setState({ loading: false, error: e, device: null, related: [] }); });
    return () => { cancelled = true; };
  }, [id]);

  const load = () => {
    setState({ loading: true, error: null, device: null, related: [] });
    api.getDevice(id)
      .then((data) => setState({ loading: false, error: null, device: data.device, related: data.related || [] }))
      .catch((e) => setState({ loading: false, error: e, device: null, related: [] }));
  };

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, device: null, related: [] });
    api.getDevice(id)
      .then((data) => { if (!cancelled) setState({ loading: false, error: null, device: data.device, related: data.related || [] }); })
      .catch((e) => { if (!cancelled) setState({ loading: false, error: e, device: null, related: [] }); });
    return () => { cancelled = true; };
  }, [id]);

  if (state.loading) return <PageSkeleton />;

  if (state.error) {
    const notFound = state.error.status === 404;
    return (
      <div className="container-page py-16">
        <ErrorMessage
          title={notFound ? 'Device not found' : 'Could not load device'}
          message={notFound ? `No device exists with id ${id}.` : state.error.message}
          onRetry={notFound ? undefined : load}
        />
        <div className="mt-6 text-center">
          <Link to="/devices" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to devices
          </Link>
        </div>
      </div>
    );
  }

  const { device, related } = state;
  const inCompare = isInCompare(device.id);

  return (
    <div className="container-page py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-600 dark:hover:text-neon-400">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/devices" className="hover:text-brand-600 dark:hover:text-neon-400">Devices</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/devices?category=${encodeURIComponent(device.category.toLowerCase().replace(/ /g, '-'))}`} className="hover:text-brand-600 dark:hover:text-neon-400">
          {device.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{device.name}</span>
      </nav>

      {/* Hero card */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          <DeviceVisual device={device} size="lg" className="!rounded-none min-h-[300px] lg:min-h-[420px]" />
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge bg-brand-500/10 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300">{device.category}</span>
              <span className="badge bg-slate-500/10 text-slate-600 dark:text-slate-300">{device.brand}</span>
              {device.in_stock
                ? <span className="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">In stock</span>
                : <span className="badge bg-amber-500/10 text-amber-600 dark:text-amber-400">Out of stock</span>}
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{device.name}</h1>
            <Rating value={device.rating} size={16} />

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{device.description}</p>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Released {formatDate(device.release_date)}</span>
              <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" aria-hidden="true" /> Demo price</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatPrice(device.price)}</p>
              <button
                type="button"
                onClick={() => toggleDevice(device)}
                aria-pressed={inCompare}
                className={`btn-primary ${inCompare ? 'from-slate-600 to-slate-500' : ''}`}
              >
                <Scale className="h-4 w-4" aria-hidden="true" />
                {inCompare ? 'Remove from comparison' : 'Add to comparison'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Pros / Cons */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-emerald-600 dark:text-emerald-400">What we like</h2>
          <ul className="space-y-2.5">
            {(device.pros || []).map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-rose-500 dark:text-rose-400">Room for improvement</h2>
          <ul className="space-y-2.5">
            {(device.cons || []).map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" /> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Specifications */}
      <section aria-labelledby="specs-heading" className="mt-8">
        <h2 id="specs-heading" className="section-title mb-4">Full specifications</h2>
        <SpecificationTable specifications={device.specifications} />
      </section>

      {/* Related devices */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-12">
          <h2 id="related-heading" className="section-title mb-6">More from {device.category}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((d) => <DeviceCard key={d.id} device={d} />)}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link to="/devices" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to all devices
        </Link>
      </div>
    </div>
  );
}
