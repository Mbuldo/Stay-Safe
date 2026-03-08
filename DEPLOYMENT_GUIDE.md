# Deployment Guide

## Recommended setup for this repo

- **Frontend:** Vercel
- **API:** Render (or another long-running Node host with persistent disk support)

This split works well because the frontend is a static Vite app, while the API uses a local SQLite database file via `better-sqlite3`.

## Frontend deployment on Vercel

Create a Vercel project that points to this repository.

### Vercel project settings

- **Root Directory:** `apps/web`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build --workspace=packages/shared && npm run build --workspace=apps/web`
- **Output Directory:** `dist`

### Required Vercel environment variable

- `VITE_API_URL=https://your-api-host.example.com/api`

### Notes

- `apps/web/vercel.json` rewrites all routes to `index.html` so React Router works on refresh.
- The frontend app already has its own `package.json`, which is fine for monorepo deployment.

## API deployment on Render

Use a standard **Node Web Service** on Render and keep the service rooted at the **repository root**, not `apps/api`, because the API depends on the shared workspace package.

### Render service settings

- **Root Directory:** repository root
- **Build Command:** `npm install && npm run build --workspace=packages/shared && npm run build --workspace=apps/api`
- **Start Command:** `npm run start --workspace=apps/api`
- **Health Check Path:** `/health`

### Required persistent disk

Because the API uses SQLite, attach a persistent disk and mount it somewhere like:

- **Mount path:** `/var/data`

Then set:

- `DATABASE_PATH=/var/data/stay-safe.db`

Without a persistent disk, your SQLite data will not be reliable across deploys/restarts.

### Recommended API environment variables

- `NODE_ENV=production`
- `PORT=10000`
- `DATABASE_PATH=/var/data/stay-safe.db`
- `JWT_SECRET=your-strong-production-secret`
- `DEEPSEEK_API_KEY=your-deepseek-key`
- `ARTICLE_SYNC_ENABLED=true`
- `ARTICLE_SYNC_INTERVAL_HOURS=12`
- `ARTICLE_SYNC_LIMIT_PER_CATEGORY=4`
- `CORS_ORIGIN=https://your-vercel-frontend-domain.vercel.app`

If you later add a custom frontend domain, include that in `CORS_ORIGIN` too.

## API docs after deployment

Once the API is live, documentation will be available at:

- `https://your-api-host.example.com/docs`
- `https://your-api-host.example.com/openapi.json`

## Shared-package note

You asked whether both app directories can have their own package files even though they share packages.

Yes — and this repo already does that:

- `apps/web/package.json`
- `apps/api/package.json`
- `packages/shared/package.json`

The important deployment detail is that the install/build process must still happen in a way that includes the root workspace and `packages/shared`.