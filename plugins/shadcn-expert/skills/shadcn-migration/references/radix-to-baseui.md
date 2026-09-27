---
name: radix-to-baseui
description: Step-by-step migration guide from Radix UI to Base UI primitives
when-to-use: When migrating a project from Radix to Base UI
keywords: migration, radix, base-ui, transform, rename, asChild, render
priority: high
requires: ../SKILL.md
related: baseui-to-radix.md
---

# Migration: Radix UI -> Base UI

## Overview

Migrating from Radix UI to Base UI involves 6 steps: package changes, import transformation, composition pattern, component renaming, data attributes, and positioning updates.

Optional since July 2026: Base UI is the default for new projects, Radix stays fully supported and "you do not need to migrate". The official path is the shadcn skill (`npx skills add shadcn/ui`, then ask "migrate accordion to base-ui"): progressive, one component per commit on a branch, a report per component in `.migration/`, behavior changes flagged rather than patched. The steps below are the manual equivalent at primitive level (source: ui.shadcn.com/docs/changelog/2026-07-base-ui-default).

At the `components/ui` wrapper level most shadcn names do not change (`DialogContent` stays `DialogContent`); the call-site changes are `asChild` -> `render`, `Accordion type="single" collapsible defaultValue="a"` -> `defaultValue={["a"]}` (`type="multiple"` -> `multiple`), and `Select` taking an `items` prop.

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Package swap** | Remove `radix-ui` (or legacy per-component `@radix-ui/*`), add single `@base-ui/react` (Combobox in `radix-*` styles already imports `@base-ui/react`) |
| **asChild -> render** | Composition pattern change: `asChild` becomes `render` prop |
| **Overlay -> Backdrop** | Radix Overlay is renamed to Base UI Backdrop |
| **Positioner** | New wrapping element required for positioned components (Select, Tooltip, Popover) |

---

## Step 1: Package Changes

```bash
# Remove Radix packages (unified or legacy per-component)
npm uninstall radix-ui @radix-ui/react-dialog @radix-ui/react-select ...

# Add Base UI
npm install @base-ui/react

# Update components.json
# Change style from "radix-*"/"new-york" to the matching "base-*" (e.g. "radix-nova" -> "base-nova")
```

## Step 2: Import Transformation

```tsx
// BEFORE (Radix)
import { Dialog } from "radix-ui"
// or legacy: import * as Dialog from "@radix-ui/react-dialog"

// AFTER (Base UI)
import { Dialog } from "@base-ui/react/dialog"
```

## Step 3: Composition Pattern

```tsx
// BEFORE (Radix - asChild)
<Dialog.Trigger asChild>
  <Button>Open</Button>
</Dialog.Trigger>
```

```tsx
// AFTER (Base UI - render)
<Dialog.Trigger render={<Button />}>
  Open
</Dialog.Trigger>
```

## Step 4: Component Renaming

| Radix | Base UI | Notes |
|-------|---------|-------|
| `Dialog.Content` | `Dialog.Popup` | Main content area |
| `Dialog.Overlay` | `Dialog.Backdrop` | Background overlay |
| `Select.Content` | `Select.Positioner` + `Select.Popup` | Split into two |
| `Tooltip.Content` | `Tooltip.Positioner` + `Tooltip.Popup` | Split into two |
| `Accordion.Content` | `Accordion.Panel` | Renamed |
| `Popover.Content` | `Popover.Positioner` + `Popover.Popup` | Split into two |

## Step 5: Data Attributes

```css
/* BEFORE (Radix) */
[data-state="open"] { opacity: 1; }
[data-state="closed"] { opacity: 0; }
[data-side="top"] { bottom: 100%; }

/* AFTER (Base UI) */
[data-open] { opacity: 1; }
[data-closed] { opacity: 0; }
[data-side="top"] { bottom: 100%; }
```

Tailwind classes using the `data-open:` / `data-closed:` / `data-checked:` variants need no change: `shadcn/tailwind.css` defines them to match both `[data-state="open"]` (Radix) and `[data-open]` (Base UI). Only raw `data-[state=open]:` selectors must be rewritten.

## Step 6: Positioning

```tsx
// BEFORE (Radix - built into Content)
<Select.Content position="popper" sideOffset={4}>
  {/* items */}
</Select.Content>
```

```tsx
// AFTER (Base UI - separate Positioner)
<Select.Positioner sideOffset={4}>
  <Select.Popup>
    {/* items */}
  </Select.Popup>
</Select.Positioner>
```

## Validation

```
[ ] All radix-ui / @radix-ui imports replaced
[ ] asChild -> render prop converted
[ ] Content -> Popup renamed
[ ] Overlay -> Backdrop renamed
[ ] Positioner added where needed
[ ] data-state="open" -> data-[open] in CSS
[ ] Tests pass
[ ] No mixed APIs
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting Positioner wrappers | Select, Tooltip, Popover need Positioner |
| Not updating CSS selectors | data-state -> data-[open] in all stylesheets |
| Keeping old Radix packages | Clean uninstall after migration |

---

## Related References

- [baseui-to-radix.md](baseui-to-radix.md) - Reverse migration

## Related Templates

- [migration-dialog.md](templates/migration-dialog.md) - Complete migration example
