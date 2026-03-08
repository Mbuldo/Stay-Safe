# Stay-Safe

Stay-Safe is a sexual and reproductive health (SRH) platform for university students. It combines trusted educational content, guided risk assessments, student-friendly support resources, and optional AI-assisted guidance in a single monorepo.

## Features

- Guided SRH risk assessments with practical next steps
- Educational article library and curated campus/community resources
- Authentication, profile management, and assessment history
- Optional DeepSeek-powered AI responses with deterministic fallback behavior
- Swagger-style API docs at `/docs` and raw OpenAPI spec at `/openapi.json`
- Automated API and frontend tests using Node's built-in test runner

## Tech stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Radix UI
- Backend: Node.js, Express, TypeScript
- Database: SQLite via `better-sqlite3`
- Shared package: `@stay-safe/shared` for schemas and types
- Validation: Zod
- Monorepo: npm workspaces

## Repository structure

- `apps/web` — frontend application
- `apps/api` — backend API
- `packages/shared` — shared schemas and types

## Links
- Deployed version: https://stay-safe-web-c6iz.vercel.app/
- Video demo: 'https://youtu.be/xwycqnnsN0g'
- GitHub: `https://github.com/Mbuldo/Stay-Safe.git`
- Figma mockup: `https://www.figma.com/design/dyqVXVrypKJZ0NhF7nB1VN/Stay-Safe-Mockup?node-id=1-2&t=TGetYAMkqzf3uXNC-1`

## Local development

### Prerequisites

- Node.js `>= 20`
- npm `>= 9`

### Install dependencies

```bash
npm install
```

### Configure the API

Create `apps/api/.env` with values like:

```dotenv
PORT=3000
DATABASE_PATH=./data/stay-safe.db
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
JWT_SECRET=stay-safe-dev-secret
ARTICLE_SYNC_ENABLED=false
DEEPSEEK_API_KEY=
```

Notes:

- `JWT_SECRET` is required in production.
- `DEEPSEEK_API_KEY` is optional; if omitted, AI features fall back gracefully.
- The API uses SQLite, so production hosting must provide persistent disk storage.

### Configure the frontend

For local development, the Vite dev server already proxies `/api` to `http://localhost:3000`, so `VITE_API_URL` is optional.

If you want to point the frontend at a deployed API, create `apps/web/.env` and set:

```dotenv
VITE_API_URL=https://stay-safe.onrender.com/api
```

### Start the apps

```bash
npm run dev
```

Local URLs:

- Web: `http://localhost:5173`
- API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- API docs: `http://localhost:3000/docs`
- OpenAPI spec: `http://localhost:3000/openapi.json`

## Available scripts

From the repo root:

- `npm run dev` — run web and API in development
- `npm run build` — build all workspaces
- `npm run build:web` — build the frontend
- `npm run build:api` — build the API
- `npm run test` — run API and frontend tests
- `npm run test:api` — run backend integration tests
- `npm run test:web` — run frontend logic tests
- `npm run lint` — run workspace lint scripts
- `npm run type-check` — run workspace type checks

## Testing

The project currently uses Node's built-in test runner for lightweight automated coverage.

Current coverage includes:

- API docs and OpenAPI endpoints
- auth flows
- articles and resources endpoints
- assessment flows
- frontend API service behavior
- frontend utility functions

Run everything:

```bash
npm test
```

## Deployment notes

Recommended deployment for the current architecture:

- Frontend: Vercel or Render Static Site
- API: Render Web Service or another host with persistent disk

Important:

- The API should **not** be deployed to Vercel serverless in its current form because it depends on local SQLite storage.
- Set `CORS_ORIGIN` on the API to the exact frontend origin, with no trailing slash.
- Set `VITE_API_URL` on the frontend to the deployed API base URL ending in `/api`.

## License

MIT
