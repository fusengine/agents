---
name: turso-production
description: Deploying Astro DB to production with Turso (libSQL) — env vars, push, CI/CD
when-to-use: Moving Astro DB from local SQLite to production Turso database
keywords: Turso, libSQL, ASTRO_DB_REMOTE_URL, ASTRO_DB_APP_TOKEN, production
priority: high
related: seed-data.md
---

# Turso for Production

## When to Use

- Deploying Astro DB beyond local development
- Needing a managed, edge-replicated SQLite database
- CI/CD pipeline with schema migrations

## Setup Turso

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create my-astro-db

# Get connection URL
turso db show my-astro-db --url

# Create auth token
turso db tokens create my-astro-db
```

## Environment Variables

```bash
# .env.production (never commit to git)
ASTRO_DB_REMOTE_URL=libsql://my-astro-db-your-org.turso.io
ASTRO_DB_APP_TOKEN=your-auth-token-here
```

## Push Schema to Turso

```bash
# Sync local schema to Turso
npx astro db push

# With explicit remote URL (for CI)
ASTRO_DB_REMOTE_URL=libsql://... ASTRO_DB_APP_TOKEN=... npx astro db push
```

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
- name: Push DB Schema
  env:
    ASTRO_DB_REMOTE_URL: ${{ secrets.ASTRO_DB_REMOTE_URL }}
    ASTRO_DB_APP_TOKEN: ${{ secrets.ASTRO_DB_APP_TOKEN }}
  run: npx astro db push

- name: Build
  run: npm run build
```

## Turso Limits (Free Tier)

| Resource | Free Limit |
|----------|------------|
| Databases | 500 |
| Storage | 9 GB total |
| Rows read/month | 1 billion |
| Rows written/month | 25 million |

## Key Rules

- Never commit `.env` with Turso credentials
- Always run `astro db push` before deploying schema changes
- Use secrets in CI/CD — never hardcode tokens
- Turso free tier is sufficient for most production apps
