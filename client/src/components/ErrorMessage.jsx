import { AlertTriangle, RotateCcw } from 'lucide-react';

/** Error state with optional retry. */
export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div role="alert" className="card mx-auto flex max-w-md flex-col items-center gap-3 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      {message && <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>}
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary mt-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
