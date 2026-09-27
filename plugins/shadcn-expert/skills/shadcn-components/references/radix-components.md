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

Radix UI components use namespace imports from the unified `radix-ui` package, `asChild` composition, and Portal-based rendering. Each primitive has a consistent part-based API. Radix is no longer the default base for new projects (Base UI is, since July 2026) but stays fully supported: `init -b radix`, `radix-*` styles, docs `/docs/components/radix/<name>`.

Exceptions in `radix-*` styles: Combobox is built on `@base-ui/react` (no Radix Combobox), Toast is Base UI-only (use Sonner), Questionnaire/MessageScroller use `@shadcn/react`.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Portal** | Required for Overlay/Content to escape DOM stacking |
| **asChild** | Merges props onto single child element |
| **Refs** | Radix parts accept refs; shadcn wrappers no longer use `forwardRef` (React 19: `ref` is a regular prop) |
| **Controlled** | Use `open`/`onOpenChange` for controlled state |

---

## Component Parts Summary

| Component | Key Parts | Import |
|-----------|-----------|--------|
| **Dialog** | Root, Trigger, Portal, Overlay, Content, Title, Description, Close | `import { Dialog } from "radix-ui"` |
| **Select** | Root, Trigger, Value, Portal, Content, Viewport, Item, ItemText | `import { Select } from "radix-ui"` |
| **Accordion** | Root, Item, Header, Trigger, Content | `import { Accordion } from "radix-ui"` |
| **Tooltip** | Provider, Root, Trigger, Portal, Content, Arrow | `import { Tooltip } from "radix-ui"` |

Legacy per-component packages (`@radix-ui/react-dialog`, ...) still work; `{runner} shadcn@latest migrate radix` rewrites their imports to `radix-ui`.

-> See [dialog-example.md](templates/dialog-example.md) for complete implementation

---

## Quick Snippets

### Dialog (minimal)

```tsx
import { Dialog } from "radix-ui"

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
import { Accordion } from "radix-ui"

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
