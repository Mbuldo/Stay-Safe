# Stay-Safe Installation Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- DeepSeek API Key (get from https://platform.deepseek.com)

## Step-by-Step Installation

### 1. Install Root Dependencies
```bash
cd stay-safe
npm install
```

### 2. Install Shared Package
```bash
cd packages/shared
npm install
npm run build
cd ../..
```

### 3. Install Backend (API)
```bash
cd apps/api
npm install
```

**Create `.env` file:**
```bash
cp .env.example .env
```

**Edit `apps/api/.env`:**
```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/stay-safe.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DEEPSEEK_API_KEY=your_deepseek_api_key_here
CORS_ORIGIN=http://localhost:5173
```

**Create database directory:**
```bash
mkdir -p data
```

### 4. Install Frontend (Web)
```bash
cd ../web
npm install
```

**Create `.env` file:**
```bash
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### 5. Start Development

**Option 1 - From root (both servers):**
```bash
cd ../..
npm run dev
```

**Option 2 - Separate terminals:**

Terminal 1 (Backend):
```bash
cd apps/api
npm run dev
```

Terminal 2 (Frontend):
```bash
cd apps/web
npm run dev
```

## Verify Installation

1. Backend: http://localhost:3000/health
2. Frontend: http://localhost:5173

## Common Issues

### Issue: "Cannot find module '@stay-safe/shared'"

**Solution:**
```bash
cd packages/shared
npm run build
```

### Issue: "Database locked"

**Solution:** Only run one instance of the API server.

### Issue: "DEEPSEEK_API_KEY is not configured"

**Solution:** Add your API key to `apps/api/.env`

### Issue: "Port already in use"

**Solution:** Change port in `.env` or kill process using the port.

## Next Steps

1. Register a user account
2. Try the assessment flow
3. View your dashboard
4. Customize the UI

## Getting DeepSeek API Key

1. Visit https://platform.deepseek.com
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy it to your `.env` file