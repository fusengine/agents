---
description: "shadcn/ui strict business rules - Detection mandatory before any component work (base = base | radix | aria). Never mix Base UI, Radix and React Aria APIs in same file. Radix uses asChild + data-state, Base UI uses render prop + data-[open], React Aria uses trigger wrappers + onPress + data-entering. Always consult mcp__shadcn__* + Context7 before adding components. Never manually edit primitives. Keep components.json in sync."
next_step: null
---

# shadcn/ui Business Rules (STRICT)

## Detection Rules

1. **ALWAYS detect** primitive library before any component work (`{runner} shadcn@latest info --json` -> `config.base` first)
2. **ALWAYS run** detection on first interaction with a project
3. **NEVER assume** a base without running detection: new projects default to Base UI since July 2026, Radix stays supported, React Aria is the third base
4. **CACHE** detection result for session duration

## Component Rules

1. **ALWAYS consult** shadcn MCP before adding any component
2. **ALWAYS consult** Context7 for latest documentation
3. **ALWAYS use** correct API for detected primitive
4. **NEVER mix** Base UI, Radix and React Aria APIs in the same component
5. **NEVER mix** import styles (namespace vs named) in same file
6. **IMPORT `cn`** from the `cn` package in new component code (`import { cn } from "cn"`); `lib/utils.ts` re-exports it

## Import Rules

### Radix Projects

```tsx
// CORRECT (unified package; legacy "@radix-ui/react-dialog" still works)
import { Dialog } from "radix-ui"
// WRONG in Radix project
import { Dialog } from "@base-ui/react/dialog"
```

### Base UI Projects

```tsx
// CORRECT (lowercase subpath; root import "@base-ui/react" also valid)
import { Dialog } from "@base-ui/react/dialog"
// WRONG in Base UI project
import { Dialog } from "radix-ui"
```

Exception: the `radix-*` Combobox imports `@base-ui/react` by design (Radix has no Combobox); leave it.

### React Aria Projects

```tsx
// CORRECT
import { DialogTrigger, Modal, ModalOverlay } from "react-aria-components"
// WRONG in React Aria project
import { Dialog } from "@base-ui/react/dialog"
```

## Composition Rules

### Radix: Use `asChild`

```tsx
<Dialog.Trigger asChild>
  <Button>Open</Button>
</Dialog.Trigger>
```

### Base UI: Use `render`

```tsx
<Dialog.Trigger render={<Button />}>
  Open
</Dialog.Trigger>
```

### React Aria: trigger wrapper

```tsx
<DialogTrigger>
  <Button>Open</Button>
  <Dialog>...</Dialog>
</DialogTrigger>
```

## Data Attribute Rules

- Radix: `data-state="open"`, `data-state="closed"`
- Base UI: `data-[open]`, `data-[closed]`
- React Aria: `data-entering`, `data-exiting`, `data-[placement=...]`, `data-focused`, `data-pressed`
- Shared `data-open:` / `data-closed:` Tailwind variants (from `shadcn/tailwind.css`) match Radix and Base UI: prefer them in Radix/Base UI code
- **NEVER mix** attribute styles in CSS selectors

## Registry Rules

1. **ALWAYS use** CLI to add components (`{runner} shadcn@latest add`)
2. **ALWAYS check** registry source via MCP before modifying
3. **NEVER manually** edit primitive internals
4. **KEEP** components.json in sync with actual primitive

## FORBIDDEN

- Using `asChild` in Base UI or React Aria project
- Using `render` prop in Radix or React Aria project
- Mixing `radix-ui`/`@radix-ui`, `@base-ui` and `react-aria-components` imports in same file
- Adding components without MCP consultation
- Skipping primitive detection
- Modifying component primitives without migration plan
