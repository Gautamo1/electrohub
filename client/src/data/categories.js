import {
  Smartphone, Laptop, Tablet, Watch, Headphones, Camera, Gamepad2,
  Tv, Monitor, Home, Cable,
} from 'lucide-react';

/**
 * Static metadata for the 11 device categories.
 * `slug` matches the server slug (category lowercased, spaces -> hyphens).
 * `gradient` powers the CSS-only category visuals (no copyrighted images).
 */
export const CATEGORIES = [
  { slug: 'smartphones', name: 'Smartphones', icon: Smartphone, description: 'Flagship cameras, blazing chips and all-day batteries.', gradient: 'from-blue-500 to-cyan-400' },
  { slug: 'laptops', name: 'Laptops', icon: Laptop, description: 'Ultrabooks, creator machines and gaming beasts.', gradient: 'from-violet-500 to-fuchsia-400' },
  { slug: 'tablets', name: 'Tablets', icon: Tablet, description: 'Sketch, stream and work on vivid slates.', gradient: 'from-sky-500 to-blue-400' },
  { slug: 'smartwatches', name: 'Smartwatches', icon: Watch, description: 'Health, fitness and notifications on your wrist.', gradient: 'from-emerald-500 to-teal-400' },
  { slug: 'headphones', name: 'Headphones', icon: Headphones, description: 'ANC over-ears, true wireless buds and studio cans.', gradient: 'from-amber-500 to-orange-400' },
  { slug: 'cameras', name: 'Cameras', icon: Camera, description: 'Mirrorless full-frame to pocket action cams.', gradient: 'from-rose-500 to-pink-400' },
  { slug: 'gaming-consoles', name: 'Gaming Consoles', icon: Gamepad2, description: 'Home, handheld and PC-handheld gaming.', gradient: 'from-indigo-500 to-purple-400' },
  { slug: 'televisions', name: 'Televisions', icon: Tv, description: 'OLED, QD-OLED and Mini-LED home cinema.', gradient: 'from-cyan-500 to-sky-400' },
  { slug: 'monitors', name: 'Monitors', icon: Monitor, description: '4K workhorse panels and high-Hz gaming displays.', gradient: 'from-teal-500 to-emerald-400' },
  { slug: 'smart-home', name: 'Smart Home', icon: Home, description: 'Hubs, thermostats and lighting that just work.', gradient: 'from-lime-500 to-green-400' },
  { slug: 'accessories', name: 'Accessories', icon: Cable, description: 'Power, storage and desk gear you will actually use.', gradient: 'from-slate-500 to-slate-400' },
];

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const categoryByName = (name) => CATEGORIES.find((c) => c.name === name);
