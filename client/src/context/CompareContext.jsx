import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext.jsx';

const CompareContext = createContext(null);
const STORAGE_KEY = 'electrohub-compare';
export const MAX_COMPARE = 4;

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }) {
  const toast = useToast();
  const [compareIds, setCompareIds] = useState(loadStored);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds)); } catch { /* noop */ }
  }, [compareIds]);

  const isInCompare = useCallback((id) => compareIds.includes(Number(id)), [compareIds]);

  const addDevice = useCallback((device) => {
    const id = Number(device.id);
    let ok = false;
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        toast.info(`${device.name} is already in the comparison list.`);
        return prev;
      }
      if (prev.length >= MAX_COMPARE) {
        toast.error(`You can compare at most ${MAX_COMPARE} devices. Remove one first.`);
        return prev;
      }
      toast.success(`${device.name} added to comparison.`);
      ok = true;
      return [...prev, id];
    });
    return ok;
  }, [toast]);

  const removeDevice = useCallback((id) => {
    const numId = Number(id);
    setCompareIds((prev) => prev.filter((x) => x !== numId));
  }, []);

  const clearComparison = useCallback(() => {
    setCompareIds([]);
    toast.info('Comparison list cleared.');
  }, [toast]);

  const toggleDevice = useCallback((device) => {
    if (compareIds.includes(Number(device.id))) removeDevice(device.id);
    else addDevice(device);
  }, [compareIds, addDevice, removeDevice]);

  const value = useMemo(() => ({
    compareIds,
    count: compareIds.length,
    isInCompare,
    addDevice,
    removeDevice,
    toggleDevice,
    clearComparison,
    max: MAX_COMPARE,
  }), [compareIds, isInCompare, addDevice, removeDevice, toggleDevice, clearComparison]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
