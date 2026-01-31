# Better Auth - All Framework Integrations

## Expo (React Native)

```bash
bun add @better-auth/expo
```

```typescript
// Server
import { expo } from "@better-auth/expo"
plugins: [expo()]

// Client
import { createAuthClient } from "@better-auth/expo"
const authClient = createAuthClient({ baseURL: "https://yourapi.com" })
```

## NestJS

```typescript
// auth.module.ts
@Module({
  providers: [{ provide: "AUTH", useValue: auth }]
})

// auth.controller.ts
@Controller("api/auth")
export class AuthController {
  @All("*")
  async handler(@Req() req, @Res() res) {
    return auth.handler(req)
  }
}
```

## SolidStart

```typescript
// src/routes/api/auth/[...all].ts
import { auth } from "~/auth"
export const GET = ({ request }) => auth.handler(request)
export const POST = ({ request }) => auth.handler(request)
```

## TanStack Start

```typescript
// app/routes/api/auth/$.ts
import { auth } from "~/auth"
export const Route = createAPIFileRoute("/api/auth/$")({
  GET: ({ request }) => auth.handler(request),
  POST: ({ request }) => auth.handler(request)
})
```

## Convex

```typescript
// convex/auth.ts
import { auth } from "./authConfig"
export const { query, mutation } = auth.convex()
```

## Elysia

```typescript
import { Elysia } from "elysia"
const app = new Elysia()
  .all("/api/auth/*", ({ request }) => auth.handler(request))
```

## Nitro

```typescript
// server/routes/api/auth/[...all].ts
export default defineEventHandler((event) => auth.handler(toWebRequest(event)))
```

## Lynx

```typescript
app.all("/api/auth/*", (c) => auth.handler(c.req))
```

## Waku

```typescript
// src/entries.tsx
export const entries = { "api/auth": auth.handler }
```

## Common Pattern
All frameworks mount `auth.handler` at `/api/auth/*`. Client uses `createAuthClient()`.
