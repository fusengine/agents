---
name: baseui-components
description: Base UI component APIs for Dialog, Select, Accordion, Tooltip
when-to-use: When building shadcn/ui components with Base UI primitives
keywords: base-ui, dialog, select, accordion, tooltip, render, popup, component
priority: high
related: radix-components.md
---

# Base UI Component APIs

## Overview

Base UI components use subpath imports, `render` prop composition, and a Positioner pattern for positioned elements. Single `@base-ui/react` package.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Subpath imports** | `import { Dialog } from "@base-ui/react/Dialog"` |
| **render prop** | `render={<Component />}` replaces asChild |
| **Positioner** | Separate positioning layer for popups |
| **Backdrop** | Replaces Radix's Overlay concept |

---

## Component Parts Summary

| Component | Key Parts | Import |
|-----------|-----------|--------|
| **Dialog** | Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close | `@base-ui/react/Dialog` |
| **Select** | Root, Trigger, Value, Portal, Positioner, Popup, Item, ItemText | `@base-ui/react/Select` |
| **Accordion** | Root, Item, Header, Trigger, Panel | `@base-ui/react/Accordion` |
| **Tooltip** | Provider, Root, Trigger, Positioner, Popup, Arrow | `@base-ui/react/Tooltip` |

-> See [dialog-example.md](templates/dialog-example.md) for complete implementation

---

## Quick Snippets

### Dialog (minimal)

```tsx
import { Dialog } from "@base-ui/react/Dialog"

<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 bg-black/50" />
    <Dialog.Popup>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

### Accordion (minimal)

```tsx
import { Accordion } from "@base-ui/react/Accordion"

<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Header><Accordion.Trigger>Section</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

---

## Key Differences from Radix

| Pattern | Radix | Base UI |
|---------|-------|---------|
| Composition | `asChild` | `render` prop |
| Positioning | Built into Content | Separate `Positioner` |
| Overlay | `Overlay` | `Backdrop` |
| Content | `Content` | `Popup` |
| Accordion body | `Content` | `Panel` |
| Data attrs | `data-state="open"` | `data-[open]` |
| Package | Many `@radix-ui/*` | Single `@base-ui/react` |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing Positioner | Select, Tooltip, Popover need Positioner wrapper |
| Using asChild | Base UI uses `render` prop, not asChild |
| Wrong import path | Must use subpath: `@base-ui/react/Dialog` |

---

## Related References

- [radix-components.md](radix-components.md) - Radix UI equivalent

## Related Templates

- [dialog-example.md](templates/dialog-example.md) - Complete component implementations
