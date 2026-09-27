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

Base UI has been selectable since `npx shadcn create` (December 2025), got full docs in January 2026 and became the **default base for new projects on July 2, 2026** (`npx shadcn init` picks it; Radix remains fully supported). Uses a single package with subpath imports and a different composition model. Styles: `base-{vega,nova,maia,lyra,mira,luma,sera,rhea}`; docs at `/docs/components/base/<name>`.

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
// Subpath import (lowercase kebab-case, used by shadcn registry)
import { Dialog } from "@base-ui/react/dialog"
import { Select } from "@base-ui/react/select"
import { Menu } from "@base-ui/react/menu"

// Root import is also valid (package re-exports every component)
import { Dialog } from "@base-ui/react"

// NOT: "@base-ui/react/Dialog" (PascalCase subpath does not exist)
```

## Composition: `render` Prop

```tsx
// render prop replaces asChild
<Dialog.Trigger render={<Button />}>
  Open
</Dialog.Trigger>
```

```tsx
// With render function for more control
<Dialog.Trigger render={(props) => <Button {...props}>Open</Button>} />
```

## Data Attributes

| Attribute | Values | Usage |
|-----------|--------|-------|
| `data-[open]` | present/absent | Dialog, Menu, Popover |
| `data-[closed]` | present/absent | Closing state |
| `data-side` | `"top"`, `"bottom"`, `"left"`, `"right"`, ... | Positioned elements |
| `data-[disabled]` | present/absent | Disabled state |
| `data-[checked]` / `data-[unchecked]` | present/absent | Checkbox, Switch |
| `data-[popup-open]` | present/absent | Trigger while its popup is open |
| `data-[starting-style]` / `data-[ending-style]` | present/absent | Enter/exit animation frames |

`data-[open]` above is Tailwind arbitrary-variant notation; the DOM attribute is a bare `data-open`. Registry code uses the `data-open:` / `data-closed:` variants from `shadcn/tailwind.css`, which match both `[data-open]` and Radix's `[data-state="open"]`, so they are not a Base UI signal on their own. Base UI-only signals: `data-starting-style`, `data-ending-style`, `data-popup-open`, `data-side=inline-start|inline-end`.

## CSS Targeting

```css
[data-open] { animation: slideDown 200ms; }
[data-closed] { animation: slideUp 200ms; }
[data-starting-style], [data-ending-style] { opacity: 0; }
```

## Component Naming

| Component | Parts |
|-----------|-------|
| Dialog | Root, Trigger, Portal, Backdrop, Popup, Close, Title, Description |
| Select | Root, Trigger, Value, Positioner, Popup, Item, Group, GroupLabel |
| Accordion | Root, Item, Trigger, Panel, Header |
| Tooltip | Root (Provider), Trigger, Portal, Positioner, Popup, Arrow |

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
| Missing subpath import check | Match both `@base-ui/react/<component>` and root `@base-ui/react` imports |
| Treating `@base-ui/react` as proof of a Base UI project | `radix-*` Combobox also imports it (`import { Combobox as ComboboxPrimitive } from "@base-ui/react"`); confirm with the style prefix |
| Confusing with React Aria | `aria-*` styles import `react-aria-components`, use `data-entering`/`data-exiting` and no `render` prop |
| Confusing render prop with React render | It's Base UI composition, not React pattern |
| Ignoring Positioner components | Key signal for Base UI detection |

---

## Related References

- [radix-patterns.md](radix-patterns.md) - Radix UI counterpart
- [detection-algorithm.md](detection-algorithm.md) - Full scoring logic

## Related Templates

- [detection-script.md](templates/detection-script.md) - Complete detection example
