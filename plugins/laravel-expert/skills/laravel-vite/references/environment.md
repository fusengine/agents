---
name: environment
description: Environment variables and VITE_ prefix
when-to-use: Exposing config to frontend JavaScript
keywords: env, environment, VITE_, import.meta.env
---

# Environment Variables

## Decision Tree

```
Need variable in frontend JS?
├── YES → Use VITE_ prefix
└── NO → Keep in Laravel .env only
```

## Variable Access

| Scope | Prefix | Access |
|-------|--------|--------|
| Frontend | `VITE_` | `import.meta.env.VITE_*` |
| Backend only | None | `env()` in PHP |

## Built-in Variables

| Variable | Value |
|----------|-------|
| `import.meta.env.MODE` | 'development' or 'production' |
| `import.meta.env.PROD` | boolean |
| `import.meta.env.DEV` | boolean |
| `import.meta.env.SSR` | boolean |
| `import.meta.env.BASE_URL` | Base URL |

## .env File

| Variable | Exposed | Access |
|----------|---------|--------|
| `VITE_APP_NAME` | YES | `import.meta.env.VITE_APP_NAME` |
| `VITE_API_URL` | YES | `import.meta.env.VITE_API_URL` |
| `DB_PASSWORD` | NO | Only in PHP |
| `APP_KEY` | NO | Only in PHP |

## Custom Define

| Purpose | Method |
|---------|--------|
| Build-time constants | `define` in config |
| Non-VITE prefix | `define` in config |

## Security Rules

| DO | DON'T |
|----|-------|
| API URLs | API keys |
| App name | Secrets |
| Feature flags | Passwords |
| Public config | Tokens |

## TypeScript Support

| File | Purpose |
|------|---------|
| `env.d.ts` | Type definitions |
| `vite-env.d.ts` | Vite types |

→ **Code examples**: See [ViteConfig.js.md](templates/ViteConfig.js.md)
