---
name: pages-router
description: Legacy Pages Router for migration and gradual app transition
when-to-use: migrating existing v12/v13 apps, coexistence with App Router
keywords: pages, legacy, migration, getServerSideProps, gradual
priority: low
related: app-router.md, upgrade.md
---

# Pages Router (Legacy)

## When to Use

- Migrating existing v12/v13 apps
- Legacy API routes
- Gradual migration strategy
- Coexistence with App Router

## Why Migrate to App Router

| Pages Router | App Router |
|--------------|------------|
| Client-centric | Server-first |
| Full JS bundle | Selective hydration |
| getServerSideProps | Server Components |
| _app.tsx | Nested layouts |

## Status in v16
- Pages Router is **still supported**
- App Router is **recommended** for new projects
- Both can coexist in same project

## Coexistence
```
project/
├── app/              # App Router (recommended)
│   └── dashboard/
│       └── page.tsx
├── pages/            # Pages Router (legacy)
│   └── api/
│       └── legacy.ts
└── ...
```

## When to Use Pages Router
- Migrating existing v12/v13 apps gradually
- Legacy API routes
- Features not yet in App Router

## Migration Strategy
1. **New routes** → App Router (`app/`)
2. **Existing routes** → Migrate gradually
3. **API routes** → Can stay in `pages/api/`

## Key Differences
| Pages Router | App Router |
|--------------|------------|
| `getServerSideProps` | Server Components |
| `getStaticProps` | `generateStaticParams` |
| `_app.tsx` | `layout.tsx` |
| `_document.tsx` | `layout.tsx` (root) |
| `pages/api/` | `app/api/route.ts` |

## Incremental Migration
```typescript
// pages/old-page.tsx (keep working)
export default function OldPage() {
  return <div>Legacy page</div>
}

// app/new-page/page.tsx (new route)
export default function NewPage() {
  return <div>App Router page</div>
}
```

## API Routes Migration
```typescript
// pages/api/users.ts (legacy)
export default function handler(req, res) {
  res.json({ users: [] })
}

// app/api/users/route.ts (v16)
export async function GET() {
  return Response.json({ users: [] })
}
```

## Deprecation Timeline
- v16: Both supported
- Future: Pages Router may be deprecated
- Recommendation: Migrate to App Router
