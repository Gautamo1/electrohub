import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { CATEGORIES } from '../data/categories.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-white/60 backdrop-blur dark:border-slate-700/50 dark:bg-white/[0.02]">
      <div className="container-page grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2" aria-label="ElectroHub home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-neon-500">
              <Zap className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              Electro<span className="heading-gradient">Hub</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Discover, explore and compare the latest electronics — all in one modern hub.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {[
              { icon: Github, label: 'GitHub' },
              { icon: Twitter, label: 'Twitter / X' },
              { icon: Linkedin, label: 'LinkedIn' },
              { icon: Mail, label: 'Email us', href: 'mailto:hello@electrohub.example' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href || '#'}
                aria-label={label}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-neon-400 dark:hover:text-neon-400"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Footer exploration links">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: '/devices', label: 'All Devices' },
              { to: '/categories', label: 'Categories' },
              { to: '/compare', label: 'Compare Devices' },
              { to: '/about', label: 'About ElectroHub' },
              { to: '/contact', label: 'Contact' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-neon-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Popular categories */}
        <nav aria-label="Popular categories">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">Popular categories</h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/devices?category=${c.slug}`} className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-neon-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Disclaimer */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">About the data</h3>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            ElectroHub is a portfolio demo. Device names belong to their respective owners;
            prices and some specs are fictional demo values and are not purchase advice.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200/70 py-5 dark:border-slate-700/50">
        <p className="container-page text-center text-xs text-slate-400 dark:text-slate-500">
          © {year} ElectroHub — React · Express · PostgreSQL. Built as a full-stack demo.
        </p>
      </div>
    </footer>
  );
}
