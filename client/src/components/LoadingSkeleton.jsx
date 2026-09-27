/** Skeleton loading placeholders. */

export function DeviceCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-[4/3] !rounded-none" />
      <div className="space-y-3 p-4">
        <div className="flex justify-between">
          <div className="skeleton h-5 w-20" />
          <div className="skeleton h-5 w-16" />
        </div>
        <div className="skeleton h-4 w-4/5" />
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function DeviceGridSkeleton({ count = 9 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading devices">
      {Array.from({ length: count }).map((_, i) => <DeviceCardSkeleton key={i} />)}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Generic full-page skeleton used as the Suspense fallback. */
export default function PageSkeleton() {
  return (
    <div className="container-page py-10" role="status" aria-label="Loading page">
      <div className="skeleton mb-4 h-8 w-64" />
      <div className="skeleton mb-10 h-4 w-96 max-w-full" />
      <DeviceGridSkeleton count={6} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
