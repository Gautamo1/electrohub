import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompareArrows, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { useCompare, MAX_COMPARE } from '../context/CompareContext.jsx';
import CompareTable from '../components/CompareTable.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { DeviceGridSkeleton } from '../components/LoadingSkeleton.jsx';

export default function Compare() {
  const { compareIds, removeDevice, clearComparison } = useCompare();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    if (compareIds.length === 0) {
      setDevices([]);
      setLoading(false);
      setError(null);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all(compareIds.map((id) => api.getDevice(id).then((d) => d.device).catch(() => null)))
      .then((list) => {
        if (cancelled) return;
        const found = list.filter(Boolean);
        // Drop ids that no longer exist server-side
        found.forEach((d, i) => { if (!list[i]) removeDevice(compareIds[i]); });
        setDevices(found);
        setLoading(false);
      })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [compareIds, removeDevice]);

  useEffect(() => load(), [load]);

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <GitCompareArrows className="h-7 w-7 text-brand-500" aria-hidden="true" />
            Compare devices
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {compareIds.length === 0
              ? 'Your comparison list is empty.'
              : `${compareIds.length} of ${MAX_COMPARE} slots used — your list is saved in this browser.`}
          </p>
        </div>
        {compareIds.length > 0 && (
          <button type="button" onClick={clearComparison} className="btn-secondary !border-rose-300 hover:!border-rose-400 dark:!border-rose-500/40">
            <Trash2 className="h-4 w-4 text-rose-500" aria-hidden="true" /> Clear list
          </button>
        )}
      </div>

      {loading ? (
        <DeviceGridSkeleton count={Math.max(2, compareIds.length)} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : compareIds.length === 0 ? (
        <EmptyState
          icon={GitCompareArrows}
          title="Nothing to compare yet"
          message={`Browse devices and hit “Compare” on any card — you can stack up to ${MAX_COMPARE} side by side.`}
          action={<Link to="/devices" className="btn-primary mt-2">Browse devices</Link>}
        />
      ) : (
        <>
          <CompareTable devices={devices} onRemove={removeDevice} />

          {devices.length < MAX_COMPARE && (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add another device to sharpen the comparison — {MAX_COMPARE - devices.length} slot
                {MAX_COMPARE - devices.length === 1 ? '' : 's'} left.
              </p>
              <Link to="/devices" className="btn-primary mt-4">Add a device</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
