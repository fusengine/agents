# Environment Variables

## File Priority
```
.env.local          # Local overrides (gitignored)
.env.development    # Development only
.env.production     # Production only
.env                # All environments
```

## Server-only Variables
```bash
# .env.local
DATABASE_URL=postgresql://localhost:5432/mydb
API_SECRET_KEY=sk_secret_key_here
```

```typescript
// Only in Server Components, Route Handlers, Server Actions
const dbUrl = process.env.DATABASE_URL
```

## Client-side (NEXT_PUBLIC_)
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
```

```typescript
// Accessible anywhere (bundled into client)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## Type Safety
```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXT_PUBLIC_API_URL: string
  }
}
```

## Validation with Zod
```typescript
// modules/cores/env/src/index.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

## Usage
```typescript
// Server Component - all vars
const secret = process.env.API_SECRET_KEY  // OK

// Client Component - only NEXT_PUBLIC_
'use client'
const apiUrl = process.env.NEXT_PUBLIC_API_URL  // OK
// process.env.API_SECRET_KEY → undefined
```

## Docker
```yaml
environment:
  - DATABASE_URL=postgresql://...
  - NEXT_PUBLIC_API_URL=https://...
```
