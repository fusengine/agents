---
name: dialog-example
description: Complete Dialog component examples for Radix UI, Base UI and React Aria
keywords: dialog, radix, base-ui, component, example
---

# Dialog Component Examples

## Radix UI Dialog

```tsx
// components/ui/dialog.tsx (Radix UI version)
// Unified package, as in the shadcn registry. Legacy per-component packages
// (import * as Dialog from "@radix-ui/react-dialog") still work;
// `{runner} shadcn@latest migrate radix` rewrites them to "radix-ui".
import { Dialog } from "radix-ui"

<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close asChild>
        <Button>Close</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## Base UI Dialog

```tsx
// components/ui/dialog.tsx (Base UI version)
import { Dialog } from "@base-ui/react/dialog"

<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 bg-black/50" />
    <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close render={<Button />}>Close</Dialog.Close>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

## React Aria Dialog

Primitive structure used by the `aria-*` registry `dialog.tsx` (source: `ui.shadcn.com/r/styles/aria-nova/dialog.json`). No `asChild`/`render`: `DialogTrigger` wraps a pressable child and the overlay; close and title are wired through `slot`.

```tsx
// components/ui/dialog.tsx (React Aria version)
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components"

<DialogTrigger>
  <Button>Open</Button>
  <ModalOverlay isDismissable className="fixed inset-0 bg-black/50 data-entering:animate-in data-exiting:animate-out">
    <Modal className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Dialog>
        <Heading slot="title">Title</Heading>
        <p>Description</p>
        <Button slot="close">Close</Button>
      </Dialog>
    </Modal>
  </ModalOverlay>
</DialogTrigger>
```

shadcn wrapper usage for this base (no `DialogContent`; `Dialog` renders overlay + modal):

```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<DialogTrigger>
  <Button variant="outline">Open</Button>
  <Dialog>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </Dialog>
</DialogTrigger>
```

## Radix UI Select

```tsx
import { Select } from "radix-ui"

<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Choose..." />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Viewport>
        <Select.Item value="a"><Select.ItemText>A</Select.ItemText></Select.Item>
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

## Base UI Select

```tsx
import { Select } from "@base-ui/react/select"

<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Choose..." />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.Item value="a"><Select.ItemText>A</Select.ItemText></Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

## Radix UI Accordion

```tsx
import { Accordion } from "radix-ui"

<Accordion.Root type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Section 1</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Base UI Accordion

```tsx
import { Accordion } from "@base-ui/react/accordion"

<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Section 1</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>Content here</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

## Radix UI Tooltip

```tsx
import { Tooltip } from "radix-ui"

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Button>Hover</Button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={5}>
        Tooltip text
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Base UI Tooltip

```tsx
import { Tooltip } from "@base-ui/react/tooltip"

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger render={<Button />}>Hover</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={5}>
        <Tooltip.Popup>
          Tooltip text
          <Tooltip.Arrow />
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```
