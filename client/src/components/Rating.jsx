import { Star, StarHalf } from 'lucide-react';

/** Accessible star rating (supports halves). */
export default function Rating({ value = 0, showValue = true, size = 14 }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.9;

  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      <span className="flex items-center gap-px text-amber-400" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <Star key={i} size={size} className="fill-amber-400" />;
          if (i === full && hasHalf) return <StarHalf key={i} size={size} className="fill-amber-400" />;
          return <Star key={i} size={size} className="text-slate-300 dark:text-slate-600" />;
        })}
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
