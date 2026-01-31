---
name: api-routes
description: Building REST APIs with Route Handlers, streaming, and CORS
when-to-use: creating REST endpoints, handling webhooks, streaming responses
keywords: Route Handlers, REST API, HTTP methods, streaming, CORS
priority: high
requires: app-router.md
related: server-components.md, streaming.md
---

# API Routes (Route Handlers)

## When to Use

- Building REST APIs
- Handling webhooks
- Creating streaming responses
- Implementing CORS endpoints

## Why Route Handlers

| Feature | Benefit |
|---------|---------|
| Web APIs | Standard Request/Response |
| Colocation | Routes next to pages |
| Streaming | ReadableStream support |
| HTTP Methods | GET, POST, PUT, DELETE, etc |

## Basic Route Handler
```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(await db.user.findMany())
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json(await db.user.create({ data: body }), { status: 201 })
}
```

## Dynamic Route Handler
```typescript
// app/api/users/[id]/route.ts
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await db.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.user.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
```

## Request Helpers
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const auth = request.headers.get('authorization')
  return NextResponse.json({ page })
}
```

## CORS
```typescript
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

## Streaming Response
```typescript
export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of ['Hello', ' ', 'World']) {
        controller.enqueue(encoder.encode(chunk))
        await new Promise(r => setTimeout(r, 100))
      }
      controller.close()
    },
  })
  return new Response(stream)
}
```
