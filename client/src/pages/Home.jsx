import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, GitCompareArrows, ShieldCheck, Database, Search } from 'lucide-react';
import { api } from '../services/api.js';
import { CATEGORIES } from '../data/categories.js';
import SearchBar from '../components/SearchBar.jsx';
import DeviceCard from '../components/DeviceCard.jsx';
import { DeviceGridSkeleton } from '../components/LoadingSkeleton.jsx';

const FEATURES = [
  { icon: Search, title: 'Powerful search', text: 'Find any device by name, brand, category or even chipset — with instant autocomplete.' },
  { icon: GitCompareArrows, title: 'Side-by-side compare', text: 'Stack up to 4 devices and instantly see the best price and top rating.' },
  { icon: Database, title: 'Live data, real API', text: 'Every card is served by an Express + PostgreSQL API — no hardcoded frontend data.' },
  { icon: ShieldCheck, title: 'Modern & accessible', text: 'Responsive from phone to desktop, with a slick dark mode and keyboard-friendly UI.' },
];

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.getDevices({ sort: 'rating', limit: 6 })
      .then((data) => { if (!cancelled) setFeatured(data.devices); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="circuit-bg relative overflow-hidden">
        <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
          <span className="badge animate-fade-in-up border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-brand-600 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Discover · Explore · Compare
          </span>
          <h1 className="mt-5 max-w-3xl animate-fade-in-up text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl dark:text-white" style={{ animationDelay: '80ms' }}>
            Find your next device in{' '}
            <span className="heading-gradient">seconds, not hours</span>
          </h1>
          <p className="mt-4 max-w-2xl animate-fade-in-up text-base text-slate-600 sm:text-lg dark:text-slate-300" style={{ animationDelay: '160ms' }}>
            ElectroHub brings smartphones, laptops, gaming gear and more into one
            beautiful hub — with instant search and side-by-side comparison.
          </p>
          <div className="mt-8 w-full max-w-xl animate-fade-in-up" style={{ animationDelay: '240ms' }}>
            <SearchBar size="lg" placeholder="Try “gaming”, “OLED”, “iPhone”…" />
          </div>
          <div className="mt-6 flex animate-fade-in-up flex-wrap items-center justify-center gap-3" style={{ animationDelay: '320ms' }}>
            <Link to="/devices" className="btn-primary">
              Browse all devices <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/compare" className="btn-secondary">
              <GitCompareArrows className="h-4 w-4" aria-hidden="true" /> Compare devices
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 h-72 w-72 animate-float rounded-full bg-brand-500/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 animate-float rounded-full bg-neon-400/15 blur-3xl" style={{ animationDelay: '2s' }} />
      </section>

      {/* ============ CATEGORIES ============ */}
      <section aria-labelledby="cat-heading" className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 id="cat-heading" className="section-title">Browse by category</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">11 categories, dozens of devices.</p>
          </div>
          <Link to="/categories" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:flex dark:text-neon-400">
            View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/devices?category=${c.slug}`}
              className="card card-hover group relative flex flex-col items-center gap-3 overflow-hidden p-5 text-center"
            >
              <span className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} aria-hidden="true" />
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <c.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
      {/* ============ FEATURED ============ */}
      <section aria-labelledby="featured-heading" className="container-page pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading" className="section-title">Top rated right now</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The highest-rated devices across every category.</p>
          </div>
          <Link to="/devices?sort=rating" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:flex dark:text-neon-400">
            See all <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {error ? (
          <p className="card p-6 text-center text-sm text-rose-500">Could not load featured devices: {error}</p>
        ) : !featured ? (
          <DeviceGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => <DeviceCard key={d.id} device={d} />)}
          </div>
        )}
      </section>

      {/* ============ FEATURES ============ */}
      <section aria-labelledby="why-heading" className="border-y border-slate-200/60 bg-white/50 py-16 backdrop-blur dark:border-slate-700/40 dark:bg-white/[0.02]">
        <div className="container-page">
          <h2 id="why-heading" className="section-title text-center">Why ElectroHub?</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-neon-500 text-white shadow-glow">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="container-page py-16">
        <div className="card relative overflow-hidden bg-gradient-to-r from-brand-700 to-brand-500 p-10 text-center text-white sm:p-14 dark:from-brand-800 dark:to-brand-600">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2),transparent_60%)]" />
          <h2 className="relative text-2xl font-extrabold sm:text-3xl">Ready to compare your shortlist?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
            Add up to four devices and see specs, prices and ratings side by side.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/devices" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-slate-100 active:scale-[0.98]">
              Start browsing <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.98]">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
