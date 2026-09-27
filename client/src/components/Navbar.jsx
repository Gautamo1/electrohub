import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Zap, Sun, Moon, Menu, X, Scale } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import SearchBar from './SearchBar.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/devices', label: 'Devices' },
  { to: '/categories', label: 'Categories' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { count } = useCompare();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand-600 dark:text-neon-400'
        : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-neon-400'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-[#0b1020]/85'
          : 'bg-transparent'
      }`}
    >
      <nav aria-label="Main navigation" className="container-page flex h-16 items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="ElectroHub home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-neon-500 shadow-glow">
            <Zap className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Electro<span className="heading-gradient">Hub</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="ml-4 hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
              {l.to === '/compare' && count > 0 && (
                <span className="ml-1.5 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-neon-500 dark:text-slate-900">
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Search (desktop) */}
        <div className="ml-auto hidden w-72 xl:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1.5 xl:ml-2">
          <Link
            to="/compare"
            className="btn-ghost relative hidden !px-2.5 sm:inline-flex"
            aria-label={`Comparison list, ${count} device${count === 1 ? '' : 's'}`}
          >
            <Scale className="h-5 w-5" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white dark:bg-neon-500 dark:text-slate-900">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-ghost !px-2.5"
          >
            {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="btn-ghost !px-2.5 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-slate-200/70 bg-white/95 backdrop-blur-xl transition-[max-height] duration-300 dark:border-slate-700/60 dark:bg-[#0b1020]/95 lg:hidden ${
          mobileOpen ? 'max-h-[480px] border-t' : 'max-h-0'
        }`}
      >
        <div className="container-page space-y-1 py-4">
          <div className="pb-2 xl:hidden">
            <SearchBar onSubmitted={() => setMobileOpen(false)} />
          </div>
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                    : 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/5'
                }`
              }
            >
              {l.label}
              {l.to === '/compare' && count > 0 && (
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-neon-500 dark:text-slate-900">
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
