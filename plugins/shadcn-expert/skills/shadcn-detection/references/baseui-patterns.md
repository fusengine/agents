---
name: baseui-patterns
description: Base UI detection signatures - single package, subpath imports, render prop, data attributes
when-to-use: When identifying Base UI signals during primitive detection
keywords: base-ui, detection, render, data-open, subpath, import
priority: high
related: radix-patterns.md, detection-algorithm.md
---

# Base UI Patterns

## Overview

Base UI is the newer primitive option for shadcn/ui (since late 2025). Uses a single package with subpath imports and a different composition model.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Single package** | `@base-ui/react` with subpath imports |
| **render composition** | `render={<Component />}` or `render={(props) => ...}` |
| **data-[attr] style** | Boolean attributes: `data-[open]`, `data-[closed]` |
| **Positioner pattern** | Positioning split into separate `Positioner` component |

---

## Package Signature

```
@base-ui/react   (single package, subpath imports)
```

## Import Patterns

```tsx
// Subpath import (required pattern)
import { Dialog } from "@base-ui/react/Dialog"
import { Select } from "@base-ui/react/Select"
import { Menu } from "@base-ui/react/Menu"

// NOT: import { Dialog } from "@base-ui/react" (wrong)
```

## Composition: `render` Prop

```tsx
// render prop replaces asChild
<Dialog.Trigger render={<Button />}>
  Open
</Dialog.Trigger>

// With render function for more control
<Dialog.Trigger render={(props) => <Button {...props}>Open</Button>} />
```

## Data Attributes

| Attribute | Values | Usage |
|-----------|--------|-------|
| `data-[open]` | present/absent | Dialog, Menu, Popover |
| `data-[closed]` | present/absent | Closing state |
| `data-[side]` | attribute present | Positioned elements |
| `data-[disabled]` | present/absent | Disabled state |
| `data-[checked]` | present/absent | Checkbox, Switch |
| `data-[popup]` | present/absent | Popup elements |

## CSS Targeting

```css
[data-open] { animation: slideDown 200ms; }
[data-closed] { animation: slideUp 200ms; }
[data-popup] { z-index: 50; }
```

## Component Naming

| Component | Parts |
|-----------|-------|
| Dialog | Root, Trigger, Portal, Backdrop, Popup, Close, Title, Description |
| Select | Root, Trigger, Value, Positioner, Popup, Item, Group, GroupLabel |
| Accordion | Root, Item, Trigger, Panel, Header |
| Tooltip | Root (Provider), Trigger, Positioner, Popup, Arrow |

## Key Differences from Radix

| Radix | Base UI | Change |
|-------|---------|--------|
| `DialogContent` | `Dialog.Popup` | Renamed |
| `DialogOverlay` | `Dialog.Backdrop` | Renamed |
| `SelectContent` | `Select.Popup` + `Select.Positioner` | Split |
| `asChild` | `render` prop | Different API |
| `data-state="open"` | `data-[open]` | Attribute style |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing subpath import check | Base UI uses `@base-ui/react/Dialog` not `@base-ui/react` |
| Confusing render prop with React render | It's Base UI composition, not React pattern |
| Ignoring Positioner components | Key signal for Base UI detection |

---

## Related References

- [radix-patterns.md](radix-patterns.md) - Radix UI counterpart
- [detection-algorithm.md](detection-algorithm.md) - Full scoring logic

## Related Templates

- [detection-script.md](templates/detection-script.md) - Complete detection example
