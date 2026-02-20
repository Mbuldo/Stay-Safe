# Stay-Safe 

A comprehensive Sexual and Reproductive Health (SRH) application powered by AI to provide personalized health education, risk assessment, and support for university students.

##  Features

- **Personalized Risk Assessment**: AI-powered analysis using DeepSeek
- **Educational Resources**: Curated SRH information and guides
- **Privacy-First**: All data stored locally with SQLite
- **User Profiles**: Track health journey and preferences
- **Smart Recommendations**: Personalized advice based on user data

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Shadcn UI
- **Backend**: Node.js + Express + SQLite
- **AI**: DeepSeek API for intelligent recommendations
- **Validation**: Zod for type-safe schemas
- **Monorepo**: npm workspaces


##Video Demo

https://www.youtube.com/watch?v=vC0KnBUGuuI

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install all workspace dependencies:
```bash
cd apps/api && npm install
cd ../web && npm install
cd ../../packages/shared && npm install
```

3. Set up environment variables:
```bash
# In apps/api/.env
DEEPSEEK_API_KEY=deepseek-api-key
DATABASE_PATH=./data/stay-safe.db
PORT=3000
JWT_SECRET=stay-safe

# In apps/web/.env
VITE_API_URL=http://localhost:3000/api
```

4. Build shared package:
```bash
cd packages/shared
npm run build
```

5. Create database directory:
```bash
cd apps/api
mkdir -p data
```

6. Start development servers:
```bash
# From root directory
npm run dev
```

The web app will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

## License

MIT License
