---
name: radix-components
description: Radix UI component APIs for Dialog, Select, Accordion, Tooltip
when-to-use: When building shadcn/ui components with Radix primitives
keywords: radix, dialog, select, accordion, tooltip, asChild, component
priority: high
related: baseui-components.md
---

# Radix UI Component APIs

## Overview

Radix UI components use namespace imports, `asChild` composition, and Portal-based rendering. Each primitive has a consistent part-based API.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Portal** | Required for Overlay/Content to escape DOM stacking |
| **asChild** | Merges props onto single child element |
| **forwardRef** | All parts forward refs for animation libraries |
| **Controlled** | Use `open`/`onOpenChange` for controlled state |

---

## Component Parts Summary

| Component | Key Parts | Import |
|-----------|-----------|--------|
| **Dialog** | Root, Trigger, Portal, Overlay, Content, Title, Description, Close | `@radix-ui/react-dialog` |
| **Select** | Root, Trigger, Value, Portal, Content, Viewport, Item, ItemText | `@radix-ui/react-select` |
| **Accordion** | Root, Item, Header, Trigger, Content | `@radix-ui/react-accordion` |
| **Tooltip** | Provider, Root, Trigger, Portal, Content, Arrow | `@radix-ui/react-tooltip` |

-> See [dialog-example.md](templates/dialog-example.md) for complete implementation

---

## Quick Snippets

### Dialog (minimal)

```tsx
import * as Dialog from "@radix-ui/react-dialog"

<Dialog.Root>
  <Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Accordion (minimal)

```tsx
import * as Accordion from "@radix-ui/react-accordion"

<Accordion.Root type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Header><Accordion.Trigger>Section</Accordion.Trigger></Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing Portal wrapper | Always wrap Overlay+Content in Portal |
| Forgetting asChild on Trigger | Trigger without asChild creates nested button |
| Not providing Title | Accessibility requires DialogTitle |

---

## Related References

- [baseui-components.md](baseui-components.md) - Base UI equivalent

## Related Templates

- [dialog-example.md](templates/dialog-example.md) - Complete component implementations
