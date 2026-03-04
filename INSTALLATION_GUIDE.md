# Stay-Safe Installation Guide

## Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- DeepSeek API Key (https://platform.deepseek.com)

## Step-by-Step Installation

### 1. Install Workspace Dependencies

From repository root:

```bash
npm install
```

### 2. Configure Backend Environment

```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env` as needed:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/stay-safe.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DEEPSEEK_API_KEY=your_deepseek_api_key_here
ARTICLE_SYNC_ENABLED=true
ARTICLE_SYNC_INTERVAL_HOURS=12
ARTICLE_SYNC_LIMIT_PER_CATEGORY=4
CORS_ORIGIN=http://localhost:5173
```

Create database directory:

```bash
mkdir data
```

### 3. Configure Frontend Environment

```bash
cd ../web
cp .env.example .env
```

### 4. Start Development

From repo root:

```bash
npm run dev
```

Optional: force content refresh/seed manually:

```bash
npm run seed:content --workspace=apps/api
```

## Verify Installation

1. Backend health: `http://localhost:3000/health`
2. Frontend app: `http://localhost:5173`
3. Articles endpoint: `http://localhost:3000/api/articles`
4. Nairobi resources endpoint: `http://localhost:3000/api/resources?city=Nairobi`

## Common Issues

### Issue: `DEEPSEEK_API_KEY is not configured`

Set `DEEPSEEK_API_KEY` in `apps/api/.env`.

### Issue: AI still looks inactive after setting key

Restart the API server after editing `.env`, then check `GET /api/ai/status` (authenticated).

### Issue: `Database locked`

Run only one API server instance against the same SQLite file.

### Issue: `Port already in use`

Change `PORT` in `apps/api/.env` and/or `VITE_API_URL` in `apps/web/.env`.

## Next Steps

1. Register a user account.
2. Complete an assessment.
3. Explore the dashboard, resource library, and campus resources.
