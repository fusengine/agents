---
name: 01-analyze-code
description: Understand Next.js codebase before making changes
prev_step: references/nextjs/00-init-branch.md
next_step: references/nextjs/02-features-plan.md
---

# 01 - Analyze Code (Next.js)

**Understand Next.js codebase before making changes (APEX Phase A).**

## When to Use

- After creating feature branch
- Before writing ANY code
- When unfamiliar with affected areas

---

## Next.js Structure Analysis

### App Router Structure

```text
src/
├── app/                    # Routes (orchestration ONLY)
│   ├── (auth)/             # Route groups
│   │   └── login/page.tsx
│   ├── api/                # API routes
│   │   └── users/route.ts
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
└── modules/                # Feature modules (SOLID)
    ├── cores/              # Shared utilities
    │   ├── components/     # Shared UI
    │   ├── database/       # Prisma client
    │   └── lib/            # Utilities
    └── [feature]/          # Feature modules
        ├── components/
        └── src/
            ├── interfaces/
            ├── services/
            └── hooks/
```

---

## Dual-Agent Analysis

### Launch in Parallel (ONE message)

```text
Agent 1: explore-codebase
→ Map App Router structure
→ Identify Server vs Client Components
→ Find existing patterns

Agent 2: research-expert
→ Verify Next.js 16 APIs
→ Confirm Server Actions patterns
→ Check Prisma 7 methods
```

---

## Server vs Client Analysis

### Identify Component Types

```text
Server Components (default):
[ ] No 'use client' directive
[ ] Can use async/await
[ ] Can access database directly
[ ] Cannot use hooks (useState, useEffect)

Client Components:
[ ] Has 'use client' at top
[ ] Can use React hooks
[ ] Can use browser APIs
[ ] Cannot be async
```

### Check Existing Patterns

```typescript
// Server Component (default)
export default async function Page() {
  const data = await getData()
  return <div>{data}</div>
}

// Client Component
'use client'
export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

---

## API Routes Analysis

### Route Handlers (Next.js 16)

```text
Check app/api/ structure:
[ ] HTTP methods (GET, POST, PUT, DELETE)
[ ] Request/Response types
[ ] Authentication patterns
[ ] Error handling
```

### Server Actions

```text
Check for 'use server' functions:
[ ] Form handling patterns
[ ] Revalidation usage
[ ] Error boundaries
```

---

## Key Questions

```text
[ ] What rendering strategy is used? (SSG, SSR, ISR)
[ ] Are Server Actions used for mutations?
[ ] What database adapter? (Prisma 7?)
[ ] What auth solution? (Better Auth?)
[ ] What state management? (Zustand?)
[ ] What form library? (TanStack Form?)
```

---

## Output Requirements

### From explore-codebase

```markdown
## Next.js Codebase Analysis

### App Router Structure
- Routes: [list routes]
- Route groups: [list groups]
- API routes: [list endpoints]

### Component Patterns
- Server Components: [locations]
- Client Components: [locations]
- Server Actions: [locations]

### Module Structure
- modules/cores/: [utilities found]
- modules/[feature]/: [features found]

### Data Fetching
- Pattern used: [RSC fetch / Server Actions / API routes]
- Caching strategy: [use cache / revalidate]
```

### From research-expert

```markdown
## Next.js 16 Research

### APIs to Use
- [relevant Next.js 16 APIs]
- [Server Component patterns]

### Best Practices
- [rendering recommendations]
- [caching strategies]

### Warnings
- [deprecated patterns to avoid]
- [breaking changes from v15]
```

---

## Validation Checklist

```text
[ ] explore-codebase completed
[ ] research-expert completed
[ ] Server/Client boundary understood
[ ] Existing patterns documented
[ ] APIs verified with Next.js 16 docs
[ ] Change locations identified
```

---

## Next Phase

Proceed to `02-features-plan.md`
