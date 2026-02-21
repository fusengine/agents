---
name: dialog-example
description: Complete Dialog component examples for both Radix UI and Base UI
keywords: dialog, radix, base-ui, component, example
---

# Dialog Component Examples

## Radix UI Dialog

```tsx
// components/ui/dialog.tsx (Radix UI version)
import * as Dialog from "@radix-ui/react-dialog"

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
import { Dialog } from "@base-ui/react/Dialog"

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

## Radix UI Select

```tsx
import * as Select from "@radix-ui/react-select"

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
import { Select } from "@base-ui/react/Select"

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
import * as Accordion from "@radix-ui/react-accordion"

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
import { Accordion } from "@base-ui/react/Accordion"

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
import * as Tooltip from "@radix-ui/react-tooltip"

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
import { Tooltip } from "@base-ui/react/Tooltip"

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger render={<Button />}>Hover</Tooltip.Trigger>
    <Tooltip.Positioner>
      <Tooltip.Popup>
        Tooltip text
        <Tooltip.Arrow />
      </Tooltip.Popup>
    </Tooltip.Positioner>
  </Tooltip.Root>
</Tooltip.Provider>
```
