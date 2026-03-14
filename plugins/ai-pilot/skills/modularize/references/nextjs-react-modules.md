# Next.js / React Modular Architecture Reference

## 1. Detection

| Signal | Condition |
|---|---|
| **Next.js modular** | `modules/` dir exists AND `next.config.*` file exists |
| **React modular** | `modules/` dir exists AND `package.json` has React (no `next.config.*`) |

## 2. Target Structure

```
modules/
  cores/                        # Central shared hub
    lib/         hooks/         components/
    stores/      interfaces/
  {feature}/
    src/
      components/   hooks/      stores/
      interfaces/   lib/        utils/
```

## 3. What Stays in app/ vs What Moves to modules/ (Next.js)

**Stays in `app/`** — Next.js convention files ONLY:
`page`, `layout`, `loading`, `error`, `not-found`, `route`, `template`, `default`,
`opengraph-image`, `icon`, `sitemap`, `robots`, `middleware`

**Moves to `modules/{feature}/src/`:**
- All business logic components and hooks
- Feature-specific stores, utilities, and interfaces
- Any non-convention file currently living in `app/`

## 4. Migration Steps

1. **Identify feature** — group files by domain/responsibility
2. **Create `modules/{feature}/src/`** — with subdirs: `components/`, `hooks/`, `stores/`, `interfaces/`, `lib/`, `utils/`
3. **Move components** — relocate all UI components from `app/` or root to `modules/{feature}/src/components/`
4. **Move hooks** — relocate custom hooks to `modules/{feature}/src/hooks/`
5. **Extract shared code** — any code used by 2+ features goes to `modules/cores/{lib|hooks|components|stores|interfaces}/`
6. **Update imports** — replace old paths; feature imports from `modules/cores/`, never from sibling modules
7. **Validate** — run detection hook; confirm no cross-module imports and no business logic in `app/`

## 5. Cross-Module Isolation Rules

- Modules **NEVER import from each other** directly
- ALL shared code **must go through `modules/cores/`**
- `app/` files import from `modules/{feature}/src/` or `modules/cores/` only
- Business logic components and hooks are **blocked** from living in `app/`

## 6. Import Rule Examples

```ts
// CORRECT — feature imports from cores
import { useAuth } from "@/modules/cores/hooks/useAuth";
import { Button } from "@/modules/cores/components/Button";

// CORRECT — app/ page imports from its feature module
import { Dashboard } from "@/modules/dashboard/src/components/Dashboard";

// INCORRECT — direct cross-module import (blocked)
import { CartItem } from "@/modules/cart/src/components/CartItem"; // inside modules/checkout/

// INCORRECT — business logic in app/ (blocked)
// app/dashboard/UserTable.tsx  <-- must move to modules/dashboard/src/components/
```
