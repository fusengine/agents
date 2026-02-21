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
| **Package split** | Replace single `@base-ui/react` with multiple `@radix-ui/*` packages |
| **render -> asChild** | Composition pattern change: `render` prop becomes `asChild` |
| **Backdrop -> Overlay** | Base UI Backdrop is renamed to Radix Overlay |
| **Portal required** | Radix requires explicit `Portal` wrapper for overlay components |

---

## Step 1: Package Changes

```bash
# Remove Base UI
npm uninstall @base-ui/react
# Add Radix packages (one per component)
npm install @radix-ui/react-dialog @radix-ui/react-select \
  @radix-ui/react-accordion @radix-ui/react-tooltip \
  @radix-ui/react-popover @radix-ui/react-dropdown-menu
# Update components.json: change style from "base-vega" to "new-york"
```

## Step 2: Import Transformation

```tsx
// BEFORE (Base UI)
import { Dialog } from "@base-ui/react/Dialog"

// AFTER (Radix)
import * as Dialog from "@radix-ui/react-dialog"
```

## Step 3: Composition Pattern

```tsx
// BEFORE (Base UI - render)
<Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>

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
| Installing wrong packages | Each Radix primitive is a separate package |

---

## Related References

- [radix-to-baseui.md](radix-to-baseui.md) - Reverse migration

## Related Templates

- [migration-dialog.md](templates/migration-dialog.md) - Complete migration example
