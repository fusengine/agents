---
name: migration-dialog
description: Complete Dialog migration example between Radix and Base UI
keywords: migration, dialog, example, before-after, radix, base-ui
---

# Dialog Migration Example

The examples below are primitive-level (inside `components/ui/dialog.tsx`). Call sites that import the shadcn wrapper (`@/components/ui/dialog`) keep `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle` unchanged between Radix and Base UI; only `asChild` becomes `render` (e.g. `<DialogTrigger render={<Button variant="outline" />}>Share</DialogTrigger>`). Source: ui.shadcn.com/docs/components/base/dialog vs /radix/dialog.

## Radix -> Base UI

### Before (Radix)

```tsx
import { Dialog } from "radix-ui" // legacy: import * as Dialog from "@radix-ui/react-dialog"

<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
      <Dialog.Title className="text-lg font-semibold">Edit Profile</Dialog.Title>
      <Dialog.Description className="text-sm text-muted-foreground">
        Make changes to your profile here.
      </Dialog.Description>
      {/* form fields */}
      <Dialog.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### After (Base UI)

```tsx
import { Dialog } from "@base-ui/react/dialog"

<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 bg-black/50" />
    <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
      <Dialog.Title className="text-lg font-semibold">Edit Profile</Dialog.Title>
      <Dialog.Description className="text-sm text-muted-foreground">
        Make changes to your profile here.
      </Dialog.Description>
      {/* form fields */}
      <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

### CSS Changes

```css
/* Before (Radix) */
[data-state="open"] { animation: fadeIn 200ms; }
[data-state="closed"] { animation: fadeOut 200ms; }

/* After (Base UI) */
[data-open] { animation: fadeIn 200ms; }
[data-closed] { animation: fadeOut 200ms; }
```

## Base UI -> Radix

### Before (Base UI)

```tsx
import { Select } from "@base-ui/react/select"

<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Choose..." />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner sideOffset={4}>
      <Select.Popup>
        <Select.Item value="a"><Select.ItemText>Option A</Select.ItemText></Select.Item>
        <Select.Item value="b"><Select.ItemText>Option B</Select.ItemText></Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

### After (Radix)

```tsx
import { Select } from "radix-ui"

<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Choose..." />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content position="popper" sideOffset={4}>
      <Select.Viewport>
        <Select.Item value="a"><Select.ItemText>Option A</Select.ItemText></Select.Item>
        <Select.Item value="b"><Select.ItemText>Option B</Select.ItemText></Select.Item>
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```
