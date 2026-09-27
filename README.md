# ⚡ ElectroHub

A modern electronics **discovery & comparison** website — browse smartphones, laptops,
gaming consoles, TVs and more; filter, search and compare up to four devices side by side.

**Stack:** React 18 · Vite · Tailwind CSS · Lucide icons · Node.js · Express · PostgreSQL · Render

## Features

- 🔎 **Autocomplete search** across names, brands, categories, descriptions and chipsets
- 🗂 **11 categories** with live counts and price ranges (34 seeded demo devices)
- 🎛 **Filters** (category / brand / price) + sorting — all synced to the URL
- ⚖️ **Compare up to 4 devices** (persisted in `localStorage`), best price/rating highlighted
- 📄 Rich device pages: specs table, pros/cons, related devices
- 🌗 Dark / light mode · fully responsive · accessible (ARIA, keyboard, reduced motion)
- ✉️ Contact form persisted to PostgreSQL with server-side validation

## Project structure

```
├── client/            React + Vite + Tailwind frontend
│   └── src/
│       ├── components/   Navbar, DeviceCard, SearchBar, CompareTable, …
│       ├── context/      Theme, Toast, Compare providers
│       ├── layouts/      MainLayout
│       ├── pages/        Home, Devices, DeviceDetails, Compare, Categories, About, Contact, 404
│       ├── services/     REST API client
│       └── utils/ data/ hooks/
├── server/            Express REST API
│   ├── config/db.js      pg pool (DATABASE_URL, SSL-aware)
│   ├── db/               schema.sql · seed-data.js · init.js (idempotent)
│   ├── models/ controllers/ routes/ middleware/
│   └── server.js         Serves /api + the built client (single service)
└── render.yaml        Render Blueprint (web service + free Postgres)
```

## API

| Method | Endpoint | Description |
|---|---|---|
| GET  | `/api/health` | `{ "status": "ok" }` when API + DB are healthy |
| GET  | `/api/devices` | List — `q, category, brand, minPrice, maxPrice, sort, page, limit` |
| GET  | `/api/devices/:id` | Device + specs + related |
| GET  | `/api/devices/brands` | Brand facet list |
| GET  | `/api/devices/category/:category` | By category slug (e.g. `gaming-consoles`) |
| GET  | `/api/categories` | Category aggregates |
| GET  | `/api/search?q=` | Lightweight search / autocomplete |
| POST | `/api/contact` | Store a message (validated) |

Sorts: `newest` (default), `price_asc`, `price_desc`, `rating`.

## Local development

Requirements: Node ≥ 18, PostgreSQL ≥ 13 running locally.

```bash
# 1. Install everything (root postinstall installs server/ and client/)
npm install

# 2. Configure the environment
cp .env.example .env       # then set DATABASE_URL to your local credentials
# e.g. postgresql://postgres:***@localhost:5432/electrohub
# (create the DB once: createdb electrohub, or CREATE DATABASE electrohub;)

# 3. Create schema + seed data (also runs automatically on server boot)
npm run db:init

# 4. Run API (:5000) and Vite dev server (:5173, /api proxied) together
npm run dev
```

## Production build

```bash
npm run build              # builds client/dist
npm start                  # Express serves API + client/dist on one port
```

## Deploy to Render (single web service)

The included **Blueprint** creates one web service + a free PostgreSQL database.

1. Push this repo to GitHub.
2. On Render: **New → Blueprint**, pick the repo.
3. Deploy. `DATABASE_URL` is injected automatically from the Blueprint database.
4. Verify `https://<your-app>.onrender.com/api/health` → `{"status":"ok"}`.

Manual setup instead: create a **Web Service**, runtime Node, build command

```
npm install --omit=dev --prefix server && npm ci --prefix client && npm run build --prefix client
```

start command `npm start --prefix server`, health check path `/api/health`,
env var `NODE_ENV=production`, and a **PostgreSQL** instance whose
`DATABASE_URL` is attached to the service. Schema + seed run on first boot.

## Disclaimer

Portfolio demo. Product names belong to their respective owners; prices, ratings and
some specifications are **fictional demo values**. Device visuals are pure CSS — no
product photography is bundled.
