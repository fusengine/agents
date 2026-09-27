---
name: select
description: Accessible select dropdown component with single or grouped options
when-to-use: Dropdown selections, filtered lists, option groups, combobox patterns
keywords: dropdown, combobox, select-trigger, select-content, select-item, select-value
priority: high
requires: null
related: checkbox.md, dialog.md
---

# Select Component

Accessible dropdown component with Tailwind styling. Supports single selections, grouped options, and combobox pattern with command and popover.

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: `placeholder` on `Select`, `SelectItem id`, `value` / `onChange` (RAC `Select`, `shadcn docs select --base aria`). Sources: https://ui.shadcn.com/r/styles/base-nova/select.json, https://ui.shadcn.com/r/styles/radix-nova/select.json

| | Base UI (`@base-ui/react/select`) | Radix (`radix-ui`) |
|---|---|---|
| Root | `<Select items={items}>` — `items` (array of `{ label, value }` or a `Record<value, label>`) lets `SelectValue` render the label instead of the raw value | `<Select>` — `SelectValue` renders the selected item text |
| `onValueChange` | `(value \| null, eventDetails)` | `(value: string)` |
| Multiple | `<Select multiple defaultValue={[]}>` | not supported |
| Popup alignment | `SelectContent alignItemWithTrigger` (default `true`; `false` = below the trigger) | `SelectContent position="item-aligned"` (default) or `"popper"` |
| Positioning props | `side`, `sideOffset`, `align`, `alignOffset` on `SelectContent` | `side`, `sideOffset`, `align` on `SelectContent` |
| Invalid state | `data-invalid` on `Field` + `aria-invalid` on `SelectTrigger` | same |

## Installation

```bash
bunx --bun shadcn@latest add select
bunx --bun shadcn@latest add command
bunx --bun shadcn@latest add popover
```

## Basic Select

```typescript
// src/components/BasicSelect.tsx
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/cores/shadcn/components/ui/select'

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

/**
 * Basic select component with single selection
 */
export function BasicSelect() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Select items={fruits} value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Select with Groups

```typescript
// src/components/SelectWithGroups.tsx
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/modules/cores/shadcn/components/ui/select'

const timezones: Record<string, string> = {
  est: 'Eastern Standard Time',
  cst: 'Central Standard Time',
  pst: 'Pacific Standard Time',
  gmt: 'Greenwich Mean Time',
  cet: 'Central European Time',
}

/**
 * Select component with grouped options
 */
export function SelectWithGroups() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Select items={timezones} value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">{timezones.est}</SelectItem>
          <SelectItem value="cst">{timezones.cst}</SelectItem>
          <SelectItem value="pst">{timezones.pst}</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">{timezones.gmt}</SelectItem>
          <SelectItem value="cet">{timezones.cet}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

## Combobox Pattern

Base UI projects have a dedicated `Combobox` component (`bunx --bun shadcn@latest add combobox`:
`Combobox items`, `ComboboxInput`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxList`,
`ComboboxItem`) — prefer it. The `Command` + `Popover` recipe below works on every base.

```typescript
// src/components/Combobox.tsx
import { useState } from 'react'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/modules/cores/lib/utils'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/modules/cores/shadcn/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

/**
 * Searchable combobox component using Command + Popover pattern
 * Allows filtering options by typing
 */
export function Combobox({
  options,
  value = '',
  onValueChange,
  placeholder = 'Select option...',
}: ComboboxProps) {
  const [open, setOpen] = useState(false)

  const selectedLabel = options.find(opt => opt.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          />
        }
      >
        {selectedLabel || placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={currentValue => {
                    onValueChange?.(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Combobox with Form Integration

```typescript
// src/components/ComboboxForm.tsx
import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Combobox } from './Combobox'

const formSchema = z.object({
  language: z.string().min(1, 'Please select a language.'),
})

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
]

/**
 * Form component with combobox field using TanStack Form
 */
export function ComboboxForm() {
  const form = useForm({
    defaultValues: {
      language: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-8"
    >
      <form.Field
        name="language"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <label htmlFor="language" className="font-medium">
              Language
            </label>
            <Combobox
              options={languages}
              value={field.state.value}
              onValueChange={field.handleChange}
              placeholder="Select language..."
            />
            <p className="text-sm text-muted-foreground">
              Choose your preferred language
            </p>
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-sm font-medium text-destructive">
                {field.state.meta.errors.map((error) => error?.message).join(', ')}
              </p>
            )}
          </div>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Select with Disabled Options and Custom Styling

```typescript
// src/components/SelectWithDisabled.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/cores/shadcn/components/ui/select'

const statuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending (unavailable)', value: 'pending', disabled: true },
  { label: 'Archived (unavailable)', value: 'archived', disabled: true },
]

/**
 * Select component with disabled options and a styled trigger
 */
export function SelectWithDisabled() {
  return (
    <Select items={statuses} defaultValue="active">
      <SelectTrigger className="w-full max-w-sm border-2 border-blue-200">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem
            key={status.value}
            value={status.value}
            disabled={status.disabled}
            className="font-medium"
          >
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Radix variant

No `items` / `multiple` / `alignItemWithTrigger`; `onValueChange` receives a plain `string`;
Radix triggers compose with `asChild` (e.g. `<PopoverTrigger asChild><Button …>` in the
Combobox recipe).

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent position="popper">
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>
```

## Best Practices

- Pass `items` to `Select` on Base UI so the trigger shows labels, not raw values
- Use `SelectValue` placeholder to guide users
- Group related options with `SelectGroup` and `SelectLabel`
- Implement combobox for lists with 10+ items for searchability
- Keep option labels concise and clear
- Disable unavailable options rather than removing them
- Use proper ARIA labels for accessibility
