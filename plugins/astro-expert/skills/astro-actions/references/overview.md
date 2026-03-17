---
name: overview
description: Astro Actions overview — what they are, when to use them vs API endpoints
when-to-use: deciding between Actions and API routes, understanding architecture
keywords: actions, overview, concepts, server, type-safe
priority: high
---

# Astro Actions Overview

## What Are Actions?

Astro Actions are type-safe server functions defined in `src/actions/index.ts`. They handle:
- Input validation via Zod (JSON and FormData)
- Standardized error handling with `ActionError`
- Type-safe client calls via `astro:actions` import

## When to Use Actions vs API Endpoints

| Scenario | Use |
|----------|-----|
| Form submission with validation | Actions |
| Server mutations (create, update, delete) | Actions |
| Type-safe client-server communication | Actions |
| File download / binary response | API endpoint |
| Webhook receiver | API endpoint |
| Complex REST API | API endpoint |

## Architecture

```
src/
└── actions/
    ├── index.ts         # Main entry — exports `server` object
    ├── newsletter.ts    # Optional: split into modules
    └── auth.ts          # Optional: split into modules
```

## How Actions Work

1. Define in `src/actions/index.ts` with `defineAction`
2. Call from client with `import { actions } from 'astro:actions'`
3. Astro handles serialization, validation, and errors automatically

```typescript
// Client call
import { actions } from 'astro:actions';

const result = await actions.newsletter.subscribe({ email: 'user@example.com' });
if (result.error) {
  console.error(result.error.message);
} else {
  console.log(result.data);
}
```
