---
name: 02-features-plan
description: Create detailed implementation plan for Next.js features
prev_step: references/nextjs/01-analyze-code.md
next_step: references/nextjs/03-execution.md
---

# 02 - Features Plan (Next.js)

**Create detailed implementation plan for Next.js features (APEX Phase P).**

## When to Use

- After code analysis complete
- Before writing any code
- When scope is understood

---

## Next.js Component Planning

### File Size Rules

| Component Type | Max Lines | Split At |
| --- | --- | --- |
| Page (app/) | 50 | 40 |
| Server Component | 80 | 70 |
| Client Component | 60 | 50 |
| Server Action | 30 | 25 |
| API Route | 50 | 40 |

---

## Module Structure Planning

### Feature Module Template

```text
modules/[feature]/
├── api/                    # API routes (if needed)
│   └── route.ts
├── components/             # UI components
│   ├── FeatureForm.tsx     # Client Component
│   └── FeatureList.tsx     # Server Component
└── src/
    ├── interfaces/         # Types ONLY
    │   └── feature.interface.ts
    ├── services/           # Business logic
    │   └── feature.service.ts
    ├── hooks/              # React hooks
    │   └── useFeature.ts
    └── actions/            # Server Actions
        └── feature.actions.ts
```

---

## Route Planning

### App Router Structure

```text
app/
├── (public)/               # Public routes
│   ├── page.tsx            # Home
│   └── about/page.tsx
├── (auth)/                 # Auth routes
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/            # Protected routes
│   ├── layout.tsx          # Dashboard layout
│   └── page.tsx
└── api/                    # API routes
    └── [resource]/route.ts
```

### Route File Template

```typescript
// app/(dashboard)/users/page.tsx - ONLY orchestration
import { UserList } from '@/modules/users/components/UserList'
import { getUsers } from '@/modules/users/src/services/user.service'

export default async function UsersPage() {
  const users = await getUsers()
  return <UserList users={users} />
}
```

---

## Server Actions Planning

### Action File Structure

```typescript
// modules/auth/src/actions/auth.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import type { LoginInput } from '../interfaces/auth.interface'

/**
 * Login user with credentials.
 */
export async function loginAction(input: LoginInput) {
  // Validation
  // Business logic
  // Revalidation
  revalidatePath('/dashboard')
}
```

---

## Task Breakdown Template

```markdown
# Feature: [Name]

## Overview
[1-2 sentence description]

## Tasks

### 1. Interfaces (~20 lines)
- [ ] Create modules/[feature]/src/interfaces/feature.interface.ts

### 2. Service (~40 lines)
- [ ] Create modules/[feature]/src/services/feature.service.ts

### 3. Server Actions (~30 lines)
- [ ] Create modules/[feature]/src/actions/feature.actions.ts

### 4. Server Component (~60 lines)
- [ ] Create modules/[feature]/components/FeatureList.tsx

### 5. Client Component (~50 lines)
- [ ] Create modules/[feature]/components/FeatureForm.tsx

### 6. Page (~30 lines)
- [ ] Create app/(dashboard)/feature/page.tsx

### 7. Tests (~80 lines split)
- [ ] Create modules/[feature]/components/Feature.test.tsx
- [ ] Create modules/[feature]/src/services/feature.service.test.ts

## File Structure
```
modules/feature/
├── components/
│   ├── FeatureList.tsx
│   └── FeatureForm.tsx
└── src/
    ├── interfaces/feature.interface.ts
    ├── services/feature.service.ts
    └── actions/feature.actions.ts

app/(dashboard)/feature/
└── page.tsx
```

## Estimated Total: ~280 lines (7 files)
```

---

## Rendering Strategy Decision

### Choose Per-Route

```text
Static (SSG):
→ Marketing pages, blog posts
→ export const dynamic = 'force-static'

Dynamic (SSR):
→ User-specific content, auth pages
→ export const dynamic = 'force-dynamic'

ISR (Incremental):
→ Product pages, listings
→ export const revalidate = 60
```

---

## Validation Checklist

```text
[ ] TodoWrite plan created
[ ] All files <100 lines each
[ ] Interfaces in modules/[feature]/src/interfaces/
[ ] Server/Client boundary defined
[ ] Server Actions planned
[ ] Rendering strategy chosen
[ ] Dependencies mapped
```

---

## Next Phase

Proceed to `03-execution.md`
