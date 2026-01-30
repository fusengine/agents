# App Router

## File Structure (SOLID Architecture)
```
app/
├── layout.tsx              # Root layout (required)
├── page.tsx                # → modules/public/home
├── loading.tsx             # Global loading UI
├── error.tsx               # Global error boundary
├── not-found.tsx           # 404 page
├── dashboard/
│   └── page.tsx            # → modules/auth/dashboard
└── api/route.ts            # API routes

modules/
├── public/                 # Public pages (no auth)
│   ├── home/src/
│   │   ├── components/
│   │   └── services/
│   └── about/src/
└── auth/                   # Authenticated pages
    ├── dashboard/src/
    └── settings/src/
```

## Root Layout (Required)
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Page as Module Import
```typescript
// app/page.tsx
import { HomePage } from '@/modules/public/home/src/components/HomePage'
export default HomePage

// app/dashboard/page.tsx
import { DashboardPage } from '@/modules/auth/dashboard/src/components/DashboardPage'
export default DashboardPage
```

## Dynamic Routes (v16: async params)
```typescript
// app/blog/[slug]/page.tsx
import { BlogPost } from '@/modules/public/blog/src/components/BlogPost'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params  // Async in v16!
  return <BlogPost slug={slug} />
}
```

## Route Groups
```
app/
├── (marketing)/about/page.tsx    # /about → modules/public/about
└── (dashboard)/settings/page.tsx # /settings → modules/auth/settings
```

## Loading & Error
```typescript
// app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}

// app/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>Try again</button>
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
