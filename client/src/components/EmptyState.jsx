import { PackageSearch } from 'lucide-react';

/** Friendly empty state (e.g. no search results). */
export default function EmptyState({
  icon: Icon = PackageSearch,
  title = 'No devices found',
  message = 'Try adjusting your search or filters.',
  action,
}) {
  return (
    <div className="card mx-auto flex max-w-md flex-col items-center gap-3 p-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {action}
    </div>
  );
}
