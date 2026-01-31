---
name: Docker Deployment
description: Deploy Prisma with Docker multi-stage builds and container orchestration
when-to-use: Self-hosted, Kubernetes, Docker Compose, container-based deployments
keywords: [docker, multi-stage-builds, docker-compose, kubernetes, container-registry]
priority: high
requires: [basic-usage, database]
related: [flyio, railway, render]
---

# Docker Deployment with Prisma

## Dockerfile Multi-Stage Build

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npx prisma generate

# Runtime stage
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

## Docker Compose Setup

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Build Command

```bash
docker build -t myapp:latest .
```

## Run Locally

```bash
docker-compose up
```

## Production Compose

```yaml
version: '3.8'

services:
  app:
    image: myregistry/myapp:latest
    restart: always
    environment:
      DATABASE_URL: postgresql://user:pass@db-host:5432/app
      NODE_ENV: production
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Health Check

```dockerfile
# Health check configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1))"
```

## Prisma Migrations in Container

```dockerfile
RUN npm run prisma:migrate

# or in docker-compose
services:
  migrate:
    build: .
    command: npx prisma migrate deploy
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/app
    depends_on:
      - db
```

## Environment Variables

Create `.env.docker`:

```env
DATABASE_URL=postgresql://user:password@db:5432/app
NODE_ENV=production
```

Pass to container:

```bash
docker run --env-file .env.docker myapp:latest
```

## Layer Caching Optimization

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first (cache layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy source (invalidates cache if changed)
COPY . .
RUN npm run build && npx prisma generate

EXPOSE 3000
CMD ["npm", "start"]
```

## Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prisma-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: prisma-app
  template:
    metadata:
      labels:
        app: prisma-app
    spec:
      containers:
      - name: app
        image: myregistry/prisma-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

## Push to Registry

```bash
docker tag myapp:latest myregistry/myapp:v1.0.0
docker push myregistry/myapp:v1.0.0
```

## Size Optimization

```dockerfile
# Use smaller base image
FROM node:20-alpine

# Install only production deps
RUN npm ci --only=production

# Multi-stage keeps final image small (~200MB)
```

Final image size: ~200-300MB with Node.js + Prisma.
