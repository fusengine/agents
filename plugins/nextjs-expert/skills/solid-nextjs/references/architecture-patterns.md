---
name: architecture-patterns
description: Modular architecture guide for Next.js - Folder structure, imports, organization
when-to-use: new project, code organization, module structure, imports
keywords: architecture, modules, structure, folders, imports, cores, features
priority: high
related: single-responsibility.md, templates/
---

# Modular Architecture for Next.js

**Code organization in feature modules + shared cores**

---

## Why This Architecture?

### Problems Without Structure

- Files scattered everywhere
- Complex relative imports (`../../../lib/utils`)
- Cannot tell where to put new file
- Coupling between features
- Hard to remove a feature

### Modular Architecture Benefits

- Each feature is isolated and autonomous
- Clear imports (`@/modules/auth/...`)
- New file → obvious location
- Remove feature = delete folder
- Sharing via `cores`, no direct coupling

---

## Folder Structure

### Overview

```
src/
├── app/                    # Routes ONLY
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   └── page.tsx
│   └── layout.tsx
│
└── modules/                # ALL CODE HERE
    ├── cores/              # Globally shared
    └── [feature]/          # Per feature
```

---

## `cores` Module (Shared)

### Contents

```
modules/cores/
├── components/     # Shared UI (Button, Modal, Card)
├── database/       # Prisma singleton
├── hooks/          # Shared hooks (useAuth, useTheme)
├── stores/         # Global Zustand stores
├── lib/            # Utilities, helpers
│   └── factories/  # DI factories
├── middleware/     # Auth middleware, rate-limit
└── i18n/           # Global translations
```

### Rules

- Contains ONLY what's used by 2+ features
- No feature-specific business logic
- Stable, rarely changes
- Any module can import from `cores`

---

## Feature Module

### Feature Structure

```
modules/[feature]/
├── api/                    # API route handlers
│   └── route.ts
├── components/             # Feature UI components
│   ├── FeatureList.tsx
│   └── FeatureCard.tsx
└── src/
    ├── interfaces/         # TYPES ONLY
    │   ├── feature.interface.ts
    │   └── props.interface.ts
    ├── services/           # Business logic
    │   └── feature.service.ts
    ├── queries/            # Database queries
    │   └── feature.queries.ts
    ├── hooks/              # Feature hooks
    │   └── useFeature.ts
    ├── stores/             # Zustand stores
    │   └── feature.store.ts
    ├── validators/         # Zod validation
    │   └── feature.validator.ts
    ├── actions/            # Server Actions
    │   └── feature.actions.ts
    ├── constants/          # Feature constants
    │   └── feature.constants.ts
    └── i18n/               # Feature translations
        ├── en.json
        └── fr.json
```

### Rules

- Self-contained: has everything for the feature
- Types in `src/interfaces/` ONLY
- No imports from another feature (except cores)
- Can be deleted without breaking the rest

---

## Import Rules

### What's Allowed

| From | To | Allowed? |
|------|-----|----------|
| `app/` | `modules/*` | ✅ Yes |
| `modules/[feature]/` | `modules/cores/` | ✅ Yes |
| `modules/[feature]/components/` | `modules/[feature]/src/` | ✅ Yes |
| `modules/[feature]/` | `modules/[other-feature]/` | ❌ No |
| `modules/cores/` | `modules/[feature]/` | ❌ No |

### Correct Examples

```typescript
// app/page.tsx → imports from module
import { LoginForm } from '@/modules/auth/components/LoginForm'

// modules/auth/services → imports from cores
import { prisma } from '@/modules/cores/database/prisma'

// modules/auth/components → imports from its src
import type { LoginFormProps } from '../src/interfaces/props.interface'
```

### Forbidden Examples

```typescript
// ❌ Feature imports another feature
import { UserCard } from '@/modules/users/components/UserCard'
// → Put UserCard in cores if shared

// ❌ Cores imports a feature
import { authService } from '@/modules/auth/src/services'
// → Cores must not depend on features
```

---

## Where to Put What?

### Decision Guide

| File Type | Location |
|-----------|----------|
| Route/Page | `app/` |
| Feature UI component | `modules/[feature]/components/` |
| Shared UI component | `modules/cores/components/` |
| Types/Interfaces | `modules/[feature]/src/interfaces/` |
| Business service | `modules/[feature]/src/services/` |
| Database queries | `modules/[feature]/src/queries/` |
| Feature hook | `modules/[feature]/src/hooks/` |
| Shared hook | `modules/cores/hooks/` |
| Feature store | `modules/[feature]/src/stores/` |
| Global store | `modules/cores/stores/` |
| Validation | `modules/[feature]/src/validators/` |
| Server Action | `modules/[feature]/src/actions/` |
| API Route | `modules/[feature]/api/` |
| Feature translations | `modules/[feature]/src/i18n/` |
| Global translations | `modules/cores/i18n/` |
| Shared utility | `modules/cores/lib/` |
| DI Factory | `modules/cores/lib/factories/` |
| Prisma client | `modules/cores/database/` |

---

## Creating a New Feature

1. Create folder `modules/[feature]/`
2. Create structure `api/`, `components/`, `src/`
3. In `src/`, create `interfaces/`, `services/`, `hooks/`
4. Define interfaces first
5. Implement services
6. Create components
7. Connect in `app/`

---

## When to Move to Cores?

A file should go in `cores` if:

1. **Used by 2+ features** (not before!)
2. **Generic** (no feature-specific logic)
3. **Stable** (doesn't change often)

Don't anticipate: start in feature, move if reused.

---

## Architecture Checklist

- [ ] All code in `modules/`, not in `app/`
- [ ] One feature = one self-contained folder
- [ ] Types in `src/interfaces/` only
- [ ] Stores in `src/stores/` (feature) or `cores/stores/` (global)
- [ ] Translations in `src/i18n/` (feature) or `cores/i18n/` (global)
- [ ] No imports between features
- [ ] Sharing via `cores` only
- [ ] Imports with `@/modules/...` alias
- [ ] Pages < 50 lines, delegate to modules
