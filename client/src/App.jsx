import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import PageSkeleton from './components/LoadingSkeleton.jsx';

// Lazy-loaded pages keep the initial bundle small.
const Home = lazy(() => import('./pages/Home.jsx'));
const Devices = lazy(() => import('./pages/Devices.jsx'));
const DeviceDetails = lazy(() => import('./pages/DeviceDetails.jsx'));
const Compare = lazy(() => import('./pages/Compare.jsx'));
const Categories = lazy(() => import('./pages/Categories.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Suspense fallback={<PageSkeleton />}><Home /></Suspense>} />
        <Route path="/devices" element={<Suspense fallback={<PageSkeleton />}><Devices /></Suspense>} />
        <Route path="/devices/:id" element={<Suspense fallback={<PageSkeleton />}><DeviceDetails /></Suspense>} />
        <Route path="/categories" element={<Suspense fallback={<PageSkeleton />}><Categories /></Suspense>} />
        <Route path="/compare" element={<Suspense fallback={<PageSkeleton />}><Compare /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><About /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<PageSkeleton />}><Contact /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageSkeleton />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  );
}
