---
name: react-integration
description: React frontend integration in FuseCore modules
when-to-use: Adding React components to modules, understanding frontend structure
keywords: react, frontend, vite, tanstack, typescript
priority: medium
related: module-structure.md, i18n.md
---

# React Integration

## Overview

FuseCore supports isolated React applications per module. Each module can have its own React components, stores, and routes.

## React Structure Per Module

```
FuseCore/{Module}/Resources/React/
├── pages/                # Page components
├── components/           # Reusable components
├── hooks/                # Custom hooks
├── stores/               # Zustand stores
├── interfaces/           # TypeScript interfaces
├── schemas/              # Validation schemas (Zod)
├── constants/            # Constants
├── utils/                # Utility functions
└── i18n/locales/         # Translations
```

## Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI library | 19 |
| TypeScript | Type safety | 5.8 |
| Vite | Build tool | 6 |
| TanStack Router | Routing | Latest |
| TanStack Query | Data fetching | Latest |
| Zustand | State management | 5 |
| shadcn/ui | Components | Latest |
| Tailwind CSS | Styling | 4 |

## Directory Responsibilities

### pages/

Full page components that map to routes:

| File | Route |
|------|-------|
| `LoginPage.tsx` | `/login` |
| `DashboardPage.tsx` | `/dashboard` |
| `ProfilePage.tsx` | `/profile` |

### components/

Reusable UI components organized by feature:

```
components/
├── auth/           # Auth-related components
├── profile/        # Profile components
└── common/         # Shared components
```

### hooks/

Custom React hooks for module logic:

| Hook | Purpose |
|------|---------|
| `useAuthMutations.ts` | Auth API calls |
| `useProfile.ts` | Profile data |
| `useModuleData.ts` | Module-specific data |

### stores/

Zustand stores for state management:

| Store | Purpose |
|-------|---------|
| `authStore.ts` | Authentication state |
| `uiStore.ts` | UI state (modals, theme) |

### interfaces/

TypeScript interfaces:

| Interface | Purpose |
|-----------|---------|
| `User.ts` | User type definition |
| `ApiResponse.ts` | API response types |

### schemas/

Validation schemas (Zod):

| Schema | Purpose |
|--------|---------|
| `loginSchema.ts` | Login form validation |
| `profileSchema.ts` | Profile form validation |

## Vite Configuration

### Aliases

Each module gets a Vite alias:

| Module | Alias | Path |
|--------|-------|------|
| User | `@user` | `FuseCore/User/Resources/React` |
| Dashboard | `@dashboard` | `FuseCore/Dashboard/Resources/React` |

### Cross-Module Imports

Import from other modules using aliases:

```typescript
import { useAuth } from '@user/hooks/useAuth';
import { UserCard } from '@user/components/UserCard';
```

## Build Configuration

### Development

| Setting | Value |
|---------|-------|
| Dev server | `http://localhost:5173` |
| HMR | Enabled |
| Source maps | Enabled |

### Production

| Setting | Value |
|---------|-------|
| Build path | `public/build/` |
| Minification | Enabled |
| Code splitting | Per module |

## Best Practices

### 1. Component Organization

| Type | Location |
|------|----------|
| Page components | `pages/` |
| Shared UI | `components/common/` |
| Feature components | `components/{feature}/` |

### 2. State Management

| Scope | Solution |
|-------|----------|
| Server state | TanStack Query |
| Global client state | Zustand |
| Local component state | useState |

### 3. Type Safety

| Rule | Implementation |
|------|----------------|
| All components typed | TypeScript |
| API responses typed | interfaces/ |
| Form data typed | Zod schemas |

### 4. File Limits

| Type | Max Lines |
|------|-----------|
| Components | 100 |
| Hooks | 100 |
| Stores | 100 |

Split large files as needed.

## Common Patterns

### Page Component

Standard page structure with layout.

### API Hook

Hook using TanStack Query for data fetching.

### Form Component

Form with TanStack Form + Zod validation.

## Related Templates

| Template | Purpose |
|----------|---------|
| [ReactStructure.md](templates/ReactStructure.md) | Complete structure |

## Related References

- [i18n.md](i18n.md) - Internationalization
- [module-structure.md](module-structure.md) - Overall structure
