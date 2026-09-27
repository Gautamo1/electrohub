import { Link } from 'react-router-dom';
import { Frown, Home as HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="heading-gradient text-7xl font-extrabold sm:text-8xl">404</p>
      <h1 className="mt-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Frown className="h-6 w-6 text-brand-500" aria-hidden="true" />
        This circuit doesn't exist
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for was moved, removed, or never assembled.
        Let's get you back to the good stuff.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          <HomeIcon className="h-4 w-4" aria-hidden="true" /> Back home
        </Link>
        <Link to="/devices" className="btn-secondary">Browse devices</Link>
      </div>
    </div>
  );
}
