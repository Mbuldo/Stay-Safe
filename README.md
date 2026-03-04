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


Video Demo

https://www.youtube.com/watch?v=vC0KnBUGuuI

GitHub Repo Link 

https://github.com/Mbuldo/Stay-Safe.git

Figma mockup

https://www.figma.com/design/dyqVXVrypKJZ0NhF7nB1VN/Stay-Safe-Mockup?node-id=1-2&t=TGetYAMkqzf3uXNC-1

Deployment Plan

The app will be containerized using Docker and deployed on a cloud platform like AWS or Azure for scalability and accessibility. The deployment process will include building Docker images, pushing them to a registry, and provisioning resources with Terraform. Once deployed, users can access the app through a web link and experience all functionalities from education to the symptom checker.


## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0

### Installation

1. Install workspace dependencies from repo root:
```bash
npm install
```

2. Configure backend environment:
```bash
cd apps/api
cp .env.example .env
mkdir data
```

3. Configure frontend environment:
```bash
cd ../web
cp .env.example .env
```

4. Set required API env values:
```bash
DEEPSEEK_API_KEY=deepseek-api-key
DATABASE_PATH=./data/stay-safe.db
PORT=3000
JWT_SECRET=stay-safe
```

5. Start development servers from root:
```bash
npm run dev
```

The web app will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

## License

MIT License
