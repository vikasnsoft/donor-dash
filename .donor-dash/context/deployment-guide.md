# Deployment Guide

## Environment Setup

### Required Environment Variables
```bash
# Server
NODE_ENV=development|production
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/donor-dash

# Authentication
JWT_SECRET=<32+ character random string>

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001/api
FRONTEND_URL=http://localhost:3000
```

### Optional Environment Variables
```bash
# Error Tracking
SENTRY_DSN=https://...@sentry.io/...

# Background Jobs (Phase 2.4)
REDIS_URL=redis://localhost:6379

# File Storage
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# Bank Integration (Phase 2.5)
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox|development|production

# OCR (Phase 2.4)
GOOGLE_CLOUD_VISION_API_KEY=...
```

## Local Development

```bash
# Install dependencies
npm install

# Start both backend and frontend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Seed database
npm run data:import

# Clear database
npm run data:destroy
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| Backend (Express) | 5001 | API server |
| Frontend (Next.js) | 3000 | Web application |
| MongoDB | 27017 | Database |
| Redis | 6379 | Background jobs (Phase 2.4) |

## Production Deployment

### Backend (Node.js)
```bash
# Build
npm run build

# Start
NODE_ENV=production node backend/server.js
```

### Frontend (Next.js)
```bash
cd frontend
npm run build
npm start
```

### Docker (Future)
```dockerfile
# Backend
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5001
CMD ["node", "backend/server.js"]
```

### Database
- MongoDB Atlas (recommended for production)
- Or self-hosted MongoDB with replica set

## CI/CD Pipeline (Future)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  test:
    - npm test
    - npm run lint
    - npm run build
  
  deploy:
    needs: test
    - Deploy backend
    - Deploy frontend
    - Run migrations
    - Smoke test
```

## Health Checks

```bash
# Backend health
curl http://localhost:5001/health

# Response
{ "status": "ok", "timestamp": "2026-01-15T10:00:00.000Z" }
```

## Rollback

1. Keep previous deployment artifacts
2. Revert database migrations (if any)
3. Redeploy previous version
4. Monitor error rates
