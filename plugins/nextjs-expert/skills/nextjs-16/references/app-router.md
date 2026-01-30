# App Router

## File Structure

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI
├── error.tsx           # Error boundary
├── not-found.tsx       # 404 page
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/
│       └── page.tsx    # /blog/:slug
└── api/
    └── route.ts        # API route
```

## Root Layout (Required)

```typescript
// app/layout.tsx
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Page Component

```typescript
// app/page.tsx
export default function HomePage() {
  return <h1>Welcome</h1>
}
```

## Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params  // Async in v16!
  return <h1>Post: {slug}</h1>
}
```

## Route Groups

```
app/
├── (marketing)/
│   ├── about/page.tsx      # /about
│   └── contact/page.tsx    # /contact
└── (dashboard)/
    └── settings/page.tsx   # /settings
```

## Loading UI

```typescript
// app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

## Error Handling

```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## API Routes

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ users: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ created: true })
}
```
