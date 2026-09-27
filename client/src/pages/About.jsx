import { Link } from 'react-router-dom';
import { Compass, Database, Layers, Zap, GitCompareArrows, Rocket } from 'lucide-react';

const STACK = [
  { icon: Layers, name: 'React 18 + Vite', detail: 'Component-driven UI with code-split routes and Tailwind CSS.' },
  { icon: Zap, name: 'Node.js + Express', detail: 'RESTful JSON API with validation, CORS, Helmet and compression.' },
  { icon: Database, name: 'PostgreSQL', detail: 'Relational schema: devices, specifications and contact messages.' },
  { icon: Rocket, name: 'Render', detail: 'Single web service + managed Postgres, auto-deploy from Git.' },
];

const VALUES = [
  { icon: Compass, title: 'Discovery first', text: 'Search, filter and browse across 11 electronics categories without drowning in noise.' },
  { icon: GitCompareArrows, title: 'Honest comparisons', text: 'Side-by-side specs with the lowest price and top rating highlighted automatically.' },
];

export default function About() {
  return (
    <div className="container-page py-10">
      {/* Hero */}
      <section className="circuit-bg card relative overflow-hidden p-8 sm:p-12">
        <span className="badge border border-brand-400/40 bg-brand-500/10 text-brand-600 dark:text-brand-300">About ElectroHub</span>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          One hub for every gadget decision
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          ElectroHub is a full-stack demo application that makes browsing consumer electronics
          fast and pleasant. Devices live in a PostgreSQL database, are served through an
          Express REST API and rendered with a modern React frontend — no mock data baked into
          the client. Search across categories, filter by brand and price, open rich detail
          pages and compare up to four devices side by side.
        </p>
      </section>

      {/* Values */}
      <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {VALUES.map((v) => (
          <div key={v.title} className="card p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-neon-500 text-white shadow-glow">
              <v.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{v.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{v.text}</p>
          </div>
        ))}
      </section>

      {/* Tech stack */}
      <section className="mt-10">
        <h2 className="section-title mb-6">Tech stack</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((s) => (
            <div key={s.name} className="card p-5">
              <s.icon className="h-6 w-6 text-brand-500" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{s.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="card mt-10 border-amber-400/40 bg-amber-500/5 p-6">
        <h2 className="text-sm font-bold text-amber-600 dark:text-amber-400">Data disclaimer</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          ElectroHub is built purely as a portfolio/learning project. Product names belong to
          their respective manufacturers; prices, ratings and some specifications are fictional
          demo values and must not be used for purchase decisions. No product imagery is used —
          device visuals are generated with CSS gradients and icons.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/devices" className="btn-primary">Explore devices</Link>
        <Link to="/contact" className="btn-secondary">Talk to us</Link>
      </div>
    </div>
  );
}
