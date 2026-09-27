---
name: baseui-to-radix
description: Step-by-step migration guide from Base UI to Radix UI primitives
when-to-use: When migrating a project from Base UI to Radix
keywords: migration, base-ui, radix, transform, rename, render, asChild
priority: high
requires: ../SKILL.md
related: radix-to-baseui.md
---

# Migration: Base UI -> Radix UI

## Overview

Migrating from Base UI to Radix UI involves 7 steps: package changes, import transformation, composition pattern, component renaming, data attributes, Positioner removal, and Portal addition.

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Package swap** | Replace `@base-ui/react` with the unified `radix-ui` package (or legacy per-component `@radix-ui/*`) |
| **render -> asChild** | Composition pattern change: `render` prop becomes `asChild` |
| **Backdrop -> Overlay** | Base UI Backdrop is renamed to Radix Overlay |
| **Portal required** | Radix requires explicit `Portal` wrapper for overlay components |

---

## Step 1: Package Changes

Keep `@base-ui/react` if the project uses Combobox or Toast: Radix has no Combobox primitive (the `radix-*` Combobox imports `@base-ui/react`), and Toast only exists for Base UI (Radix projects use Sonner).

```bash
# Remove Base UI (unless Combobox/Toast still need it)
npm uninstall @base-ui/react
# Add Radix (unified package, used by current shadcn/ui registry)
npm install radix-ui
# Legacy alternative: one package per component (@radix-ui/react-dialog, ...)
# Update components.json: change style from "base-*" to the matching "radix-*" (e.g. "base-nova" -> "radix-nova")
```

## Step 2: Import Transformation

```tsx
// BEFORE (Base UI)
import { Dialog } from "@base-ui/react/dialog"

// AFTER (Radix)
import { Dialog } from "radix-ui"
// legacy: import * as Dialog from "@radix-ui/react-dialog"
```

## Step 3: Composition Pattern

```tsx
// BEFORE (Base UI - render)
<Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>
```

```tsx
// AFTER (Radix - asChild)
<Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
```

## Step 4: Component Renaming

| Base UI | Radix | Notes |
|---------|-------|-------|
| `Dialog.Popup` | `Dialog.Content` | Main content area |
| `Dialog.Backdrop` | `Dialog.Overlay` | Background overlay |
| `Select.Positioner` + `Select.Popup` | `Select.Content` | Merge into one |
| `Tooltip.Positioner` + `Tooltip.Popup` | `Tooltip.Content` | Merge into one |
| `Accordion.Panel` | `Accordion.Content` | Renamed |
| `Popover.Positioner` + `Popover.Popup` | `Popover.Content` | Merge into one |

## Step 5: Data Attributes

```css
/* BEFORE (Base UI) */
[data-open] { opacity: 1; }
[data-closed] { opacity: 0; }

/* AFTER (Radix) */
[data-state="open"] { opacity: 1; }
[data-state="closed"] { opacity: 0; }
```

Tailwind `data-open:` / `data-closed:` variants from `shadcn/tailwind.css` match both conventions and need no change. Wrapper call sites: `Accordion defaultValue={["a"]}` -> `type="single" collapsible defaultValue="a"`, `multiple` -> `type="multiple"`.

## Step 6: Remove Positioners

Radix has built-in positioning. Remove `Positioner` wrappers and move props to `Content`:

```tsx
// BEFORE: <Select.Positioner sideOffset={4}><Select.Popup>...</Select.Popup></Select.Positioner>
// AFTER:  <Select.Content position="popper" sideOffset={4}>...</Select.Content>
```

## Step 7: Add Portals

Radix requires explicit Portal wrapping for overlay components:

```tsx
<Dialog.Portal>
  <Dialog.Overlay />
  <Dialog.Content>...</Dialog.Content>
</Dialog.Portal>
```

## Validation

```
[ ] All @base-ui imports replaced
[ ] render prop -> asChild converted
[ ] Popup -> Content renamed
[ ] Backdrop -> Overlay renamed
[ ] Positioners removed and merged
[ ] Portals added where needed
[ ] data-[open] -> data-state="open" in CSS
[ ] Tests pass
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting Portal wrappers | Radix requires Portal for Overlay+Content |
| Not removing Positioners | Radix has built-in positioning |
| Installing wrong packages | Use unified `radix-ui` (legacy: one `@radix-ui/react-*` per primitive) |

---

## Related References

- [radix-to-baseui.md](radix-to-baseui.md) - Reverse migration

## Related Templates

- [migration-dialog.md](templates/migration-dialog.md) - Complete migration example
