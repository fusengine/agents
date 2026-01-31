---
name: runtime
description: Choosing between Edge and Node.js runtime for routes and functions
when-to-use: runtime selection, latency optimization, API capabilities
keywords: runtime, Edge, Node.js, cold start, performance
priority: medium
requires: app-router.md, api-routes.md
related: proxy.md, route-segment-config.md
---

# Runtime (Edge vs Node.js)

## When to Use

- Node.js: Database, files, native
- Edge: Low latency, geo-routing
- Choosing runtime per route
- proxy.ts considerations

## Why Different Runtimes

| Runtime | Best For |
|---------|----------|
| Node.js | Full capabilities |
| Edge | Fast cold starts |
| Node.js | Heavy computation |
| Edge | Simple transforms |

## Node.js Runtime (Default)
```typescript
// app/api/node/route.ts
export const runtime = 'nodejs'  // Default

import fs from 'fs'
import path from 'path'

export async function GET() {
  // Full Node.js APIs available
  const filePath = path.join(process.cwd(), 'data.json')
  const data = fs.readFileSync(filePath, 'utf-8')
  return Response.json(JSON.parse(data))
}
```

## Edge Runtime
```typescript
// app/api/edge/route.ts
export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  // Limited APIs - no fs, limited crypto
  const data = await fetch(`https://api.example.com/${id}`)
  return Response.json(await data.json())
}
```

## Comparison
| Feature | Node.js | Edge |
|---------|---------|------|
| Cold start | Slower | Fast (~0ms) |
| File system | Yes | No |
| Native modules | Yes | No |
| Streaming | Yes | Yes |
| WebSocket | Yes | Limited |
| Crypto | Full | Limited |
| Memory | Higher | 128MB max |

## When to Use Edge
- Auth validation
- Geolocation routing
- A/B testing
- Simple transformations

## When to Use Node.js
- Database connections
- File operations
- Heavy computation
- Native modules (Sharp, etc.)

## Page Runtime
```typescript
// app/dashboard/page.tsx
export const runtime = 'edge'  // Page runs on Edge

export default async function DashboardPage() {
  return <div>Edge-rendered page</div>
}
```

## proxy.ts Runtime
```typescript
// proxy.ts (always runs on Node.js in v16)
export function proxy(request: NextRequest) {
  // Node.js runtime by default
  return NextResponse.next()
}
```
