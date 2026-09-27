import { categoryByName } from '../data/categories.js';

/**
 * CSS-only device "image": category icon on a gradient tile with the brand
 * initial. Avoids copyrighted product photography entirely.
 */
export default function DeviceVisual({ device, size = 'md', className = '' }) {
  const meta = categoryByName(device?.category);
  const Icon = meta?.icon ?? null;
  const gradient = meta?.gradient ?? 'from-brand-500 to-neon-400';
  const sizes = {
    sm: 'h-12 w-12 rounded-xl',
    md: 'h-full w-full min-h-[180px] rounded-t-2xl',
    lg: 'h-full w-full min-h-[280px] rounded-2xl',
  };

  return (
    <div
      role="img"
      aria-label={`${device?.name || 'Device'} visual`}
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${sizes[size]} ${className}`}
    >
      {/* decorative gloss */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" aria-hidden="true" />
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
      {device?.brand && (
        <span className="absolute left-3 top-3 rounded-lg bg-black/25 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          {device.brand}
        </span>
      )}
      {Icon ? (
        <Icon className="h-2/5 w-2/5 max-h-24 max-w-24 text-white drop-shadow-lg" strokeWidth={1.4} aria-hidden="true" />
      ) : (
        <span className="text-5xl font-black text-white/90">{(device?.name || '?').charAt(0)}</span>
      )}
      {device?.in_stock === false && size !== 'sm' && (
        <span className="badge absolute right-3 top-3 bg-slate-900/70 text-amber-300">Out of stock</span>
      )}
    </div>
  );
}
