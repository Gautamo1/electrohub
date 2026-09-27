# ElectroHub — Render deployment notes

Live app: **https://electrohub-ety6.onrender.com** (Render service `electrohub`, free plan, oregon)
Database: `electrohub-db` (free Postgres 16, oregon, internal-only — external connections blocked)
Source:   https://github.com/Gautamo1/electrohub (branch `master`)

## Architecture
- ONE web service: Express serves `/api/*` and the Vite production build (`client/dist`).
- On boot the server runs an idempotent schema init + seed (`server/db/init.js`), so no
  manual DB setup is needed once `DATABASE_URL` is configured.
- Build command (service): `npm install --omit=dev --prefix server && npm ci --prefix client && npm run build --prefix client`
- Start command: `node server/server.js`

## One-time setup (account owner only)
The DB password is only visible in the Render dashboard, so the final env-var value must
be pasted by the account owner (never commit it):

1. Open https://dashboard.render.com/d/dpg-daseg5l9fdbs73d3d2e0-a
   → copy **Internal connection string**.
2. Open https://dashboard.render.com/web/srv-dasehjh7lnhs738rh7i0/env-vars
   → set `DATABASE_URL` to that value (replace the placeholder) → **Save** (auto-redeploys).
3. Verify: https://electrohub-ety6.onrender.com/api/health returns `{"status":"ok",...}`.

## Gotchas solved (already handled — keep them!)
- `NODE_ENV=production` makes npm skip devDependencies → the client build toolchain
  (vite, tailwind, postcss…) lives in `client/package.json` **dependencies**, not devDependencies.
- `npm run --prefix` does not put `client/node_modules/.bin` on PATH → `npm run build`
  goes through `client/scripts/vite-build.mjs`, which locates the vite CLI in either
  `client/node_modules` or the repo-root `node_modules`.
- `pg` >= 8.14 treats `?sslmode=require` in the URL as `verify-full`, which breaks against
  Render's cert chain → do NOT put `sslmode=` in `DATABASE_URL`; `server/config/db.js`
  enables TLS via the pool `ssl: { rejectUnauthorized: false }` option instead.
- Use the **Internal connection string** exactly as shown in the dashboard. Its host is the
  short internal name `dpg-daseg5l9fdbs73d3d2e0-a` (no `.oregon-postgres.render.com` suffix).
  The public domain routes to an external proxy, which this DB's empty IP-allowlist rejects
  ("Connection terminated unexpectedly").
- The Render service was created via API and Render's GitHub app is NOT installed on the
  repo, so **pushes do not auto-deploy**. Trigger deploys manually (dashboard/CLI) or
  install the Render GitHub app on Gautamo1/electrohub to enable auto-deploy.

## Free-tier limits
- Web service spins down after ~15 min idle (first request pays ~30-60 s cold start).
- Free Postgres expires after 30 days — upgrade/keep-alive if you want it permanent.
