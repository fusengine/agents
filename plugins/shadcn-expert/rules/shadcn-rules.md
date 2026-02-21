---
description: "shadcn/ui strict business rules - Detection mandatory before any component work. Never mix Radix UI and Base UI APIs in same file. Radix uses asChild + data-state, Base UI uses render prop + data-[open]. Always consult mcp__shadcn__* + Context7 before adding components. Never manually edit primitives. Keep components.json in sync."
next_step: null
---

# shadcn/ui Business Rules (STRICT)

## Detection Rules

1. **ALWAYS detect** primitive library before any component work
2. **ALWAYS run** detection on first interaction with a project
3. **NEVER assume** Radix UI without running detection
4. **CACHE** detection result for session duration

## Component Rules

1. **ALWAYS consult** shadcn MCP before adding any component
2. **ALWAYS consult** Context7 for latest documentation
3. **ALWAYS use** correct API for detected primitive
4. **NEVER mix** Radix and Base UI APIs in the same component
5. **NEVER mix** import styles (namespace vs named) in same file

## Import Rules

### Radix Projects

```tsx
// CORRECT
import * as Dialog from "@radix-ui/react-dialog"
// WRONG in Radix project
import { Dialog } from "@base-ui/react/Dialog"
```

### Base UI Projects

```tsx
// CORRECT
import { Dialog } from "@base-ui/react/Dialog"
// WRONG in Base UI project
import * as Dialog from "@radix-ui/react-dialog"
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

## Data Attribute Rules

- Radix: `data-state="open"`, `data-state="closed"`
- Base UI: `data-[open]`, `data-[closed]`
- **NEVER mix** attribute styles in CSS selectors

## Registry Rules

1. **ALWAYS use** CLI to add components (`{runner} shadcn@latest add`)
2. **ALWAYS check** registry source via MCP before modifying
3. **NEVER manually** edit primitive internals
4. **KEEP** components.json in sync with actual primitive

## FORBIDDEN

- Using `asChild` in Base UI project
- Using `render` prop in Radix project
- Mixing `@radix-ui` and `@base-ui` imports in same file
- Adding components without MCP consultation
- Skipping primitive detection
- Modifying component primitives without migration plan
