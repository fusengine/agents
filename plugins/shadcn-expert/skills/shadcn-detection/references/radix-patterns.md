---
name: radix-patterns
description: Radix UI detection signatures - packages, imports, composition, data attributes
when-to-use: When identifying Radix UI signals during primitive detection
keywords: radix, detection, asChild, data-state, import, namespace
priority: high
related: baseui-patterns.md, detection-algorithm.md
---

# Radix UI Patterns

## Overview

Radix UI is the original primitive library for shadcn/ui (since 2021). Detection relies on 4 key signals: package names, import style, composition API, and data attributes.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Namespace imports** | `import * as X from "@radix-ui/react-*"` |
| **asChild composition** | Merges props onto single child element |
| **data-state attrs** | `data-state="open"`, `data-state="closed"` |
| **Per-component packages** | Each primitive is a separate npm package |

---

## Package Signatures

```
@radix-ui/react-dialog
@radix-ui/react-select
@radix-ui/react-dropdown-menu
@radix-ui/react-accordion
@radix-ui/react-tooltip
@radix-ui/react-tabs
@radix-ui/react-popover
@radix-ui/react-checkbox
@radix-ui/react-radio-group
@radix-ui/react-switch
@radix-ui/react-slider
```

## Import Patterns

```tsx
// Namespace import (most common)
import * as Dialog from "@radix-ui/react-dialog"
import * as Select from "@radix-ui/react-select"

// Named import (also valid)
import { Root, Trigger, Content } from "@radix-ui/react-dialog"
```

## Composition: `asChild`

```tsx
<Dialog.Trigger asChild>
  <Button>Open</Button>
</Dialog.Trigger>
```

## Data Attributes

| Attribute | Values | Usage |
|-----------|--------|-------|
| `data-state` | `"open"`, `"closed"` | Dialog, Accordion |
| `data-state` | `"checked"`, `"unchecked"` | Checkbox, Switch |
| `data-side` | `"top"`, `"bottom"`, `"left"`, `"right"` | Popover, Tooltip |
| `data-orientation` | `"horizontal"`, `"vertical"` | Tabs, Separator |
| `data-disabled` | `""` | Any disabled element |

## CSS Targeting

```css
[data-state="open"] { animation: slideDown 200ms; }
[data-state="closed"] { animation: slideUp 200ms; }
[data-side="top"] { transform-origin: bottom; }
```

## Component Naming

| Component | Parts |
|-----------|-------|
| Dialog | Root, Trigger, Portal, Overlay, Content, Close, Title, Description |
| Select | Root, Trigger, Value, Content, Item, Group, Label, Separator |
| Accordion | Root, Item, Trigger, Content, Header |
| Tooltip | Root (Provider), Trigger, Portal, Content, Arrow |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Checking only package.json | Also check imports and data-attrs |
| Ignoring transitive deps | Prioritize direct dependencies |
| Missing namespace imports | Search for both `import *` and `import {` |

---

## Related References

- [baseui-patterns.md](baseui-patterns.md) - Base UI counterpart
- [detection-algorithm.md](detection-algorithm.md) - Full scoring logic

## Related Templates

- [detection-script.md](templates/detection-script.md) - Complete detection example
