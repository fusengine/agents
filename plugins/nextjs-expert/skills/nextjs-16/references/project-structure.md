# Project Structure

## SOLID Architecture
```
project/
├── proxy.ts                  # Route protection
├── instrumentation.ts        # Server monitoring
├── next.config.ts
├── app/
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # → modules/public/home
│   ├── loading.tsx           # Global loading
│   ├── error.tsx             # Global error
│   ├── not-found.tsx         # 404 page
│   ├── (public)/             # Public routes group
│   │   └── about/page.tsx    # → modules/public/about
│   ├── (auth)/               # Auth routes group
│   │   └── dashboard/page.tsx# → modules/auth/dashboard
│   └── api/                  # API routes
│       └── [...]/route.ts
├── modules/
│   ├── public/               # Public pages
│   │   ├── home/src/
│   │   └── about/src/
│   ├── auth/                 # Auth pages
│   │   ├── dashboard/src/
│   │   └── settings/src/
│   ├── cores/                # Shared modules
│   │   ├── database/         # Prisma client
│   │   ├── auth/             # Better Auth
│   │   └── ui/               # UI components
│   └── [feature]/src/
│       ├── components/
│       ├── services/
│       ├── hooks/
│       └── interfaces/
└── public/                   # Static assets
    ├── images/
    └── fonts/
```

## File Conventions
| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared UI |
| `loading.tsx` | Loading UI |
| `error.tsx` | Error UI |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint |
| `template.tsx` | Re-rendered layout |
| `default.tsx` | Parallel route fallback |

## Route Groups
```
app/
├── (marketing)/      # No URL impact
│   ├── about/
│   └── contact/
└── (dashboard)/      # No URL impact
    └── settings/
```

## src Directory (Optional)
```
src/
├── app/
├── modules/
└── ...
```
