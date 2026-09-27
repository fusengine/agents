---
name: baseui-components
description: Base UI component APIs for Dialog, Select, Accordion, Tooltip, Menu, Combobox, Toast
when-to-use: When building shadcn/ui components with Base UI primitives
keywords: base-ui, dialog, select, accordion, tooltip, render, popup, component
priority: high
related: radix-components.md
---

# Base UI Component APIs

## Overview

Base UI components use subpath imports, `render` prop composition, and a Positioner pattern for positioned elements. Single `@base-ui/react` package. Base UI is the default shadcn/ui base for new projects since July 2026 (`base-*` styles; docs `/docs/components/base/<name>`).

The shadcn wrappers keep the same exported names as the Radix versions (`DialogContent`, `PopoverContent`, `AccordionContent`...): the Base UI part names below only appear inside `components/ui/*.tsx`. Wrapper call-site differences: `render` instead of `asChild`, `Accordion defaultValue={[...]}` / `multiple`, `Select items={...}`, `Combobox items={...}` with a `ComboboxList` render function.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Subpath imports** | `import { Dialog } from "@base-ui/react/dialog"` (lowercase subpath; root `@base-ui/react` also re-exports) |
| **render prop** | `render={<Component />}` replaces asChild |
| **Positioner** | Separate positioning layer for popups |
| **Backdrop** | Replaces Radix's Overlay concept |

---

## Component Parts Summary

| Component | Key Parts | Import |
|-----------|-----------|--------|
| **Dialog** | Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close | `@base-ui/react/dialog` |
| **Select** | Root, Trigger, Value, Portal, Positioner, Popup, Item, ItemText | `@base-ui/react/select` |
| **Accordion** | Root, Item, Header, Trigger, Panel | `@base-ui/react/accordion` |
| **Tooltip** | Provider, Root, Trigger, Portal, Positioner, Popup, Arrow | `@base-ui/react/tooltip` |
| **Menu** (DropdownMenu) | Root, Trigger, Portal, Positioner, Popup, Item, Group, GroupLabel, CheckboxItem, RadioGroup, RadioItem, SubmenuRoot, SubmenuTrigger, Separator | `@base-ui/react/menu` |
| **Combobox** | Root, Input, Trigger, Value, Portal, Positioner, Popup, List, Item, Empty, Chips, Chip | `@base-ui/react` (also used by `radix-*` Combobox) |
| **Toast** | `createToastManager()`, Provider, Portal, Viewport, Root, Title, Description, Action, Close (Base UI-only shadcn component) | `@base-ui/react/toast` |

Toast usage (shadcn wrapper, `npx shadcn@latest add toast`, mount `<Toaster />` from `@/components/ui/toast`):

```tsx
import { toast } from "@/components/ui/toast"

const id = toast.add({
  title: "Event created",
  actionProps: { children: "Undo", onClick: () => toast.close(id) },
})
```

-> See [dialog-example.md](templates/dialog-example.md) for complete implementation

---

## Quick Snippets

### Dialog (minimal)

```tsx
import { Dialog } from "@base-ui/react/dialog"

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
import { Accordion } from "@base-ui/react/accordion"

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
| Data attrs | `data-state="open"` | `data-[open]` (+ `data-starting-style` / `data-ending-style`) |
| Side values | `top`/`right`/`bottom`/`left` | also `inline-start` / `inline-end` (RTL-aware, Jan 2026) |
| Package | `radix-ui` (or legacy `@radix-ui/react-*`) | Single `@base-ui/react` |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing Positioner | Select, Tooltip, Popover need Portal > Positioner wrapper |
| Using asChild | Base UI uses `render` prop, not asChild |
| Wrong import path | Subpaths are lowercase kebab-case: `@base-ui/react/dialog`, never `@base-ui/react/Dialog` |

---

## Related References

- [radix-components.md](radix-components.md) - Radix UI equivalent

## Related Templates

- [dialog-example.md](templates/dialog-example.md) - Complete component implementations
