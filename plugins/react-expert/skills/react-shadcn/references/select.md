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

Accessible dropdown component built on Radix UI with Tailwind styling. Supports single selections, grouped options, and combobox pattern with command and popover.

## Installation

```bash
bunx --bun shadcn-ui@latest add select
bunx --bun shadcn-ui@latest add command
bunx --bun shadcn-ui@latest add popover
```

## Basic Select

```typescript
// app/components/BasicSelect.tsx
'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/cores/shadcn/components/ui/select'

/**
 * Basic select component with single selection
 */
export function BasicSelect() {
  const [value, setValue] = useState<string>('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## Select with Groups

```typescript
// app/components/SelectWithGroups.tsx
'use client'

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

/**
 * Select component with grouped options
 */
export function SelectWithGroups() {
  const [value, setValue] = useState<string>('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time</SelectItem>
          <SelectItem value="cst">Central Standard Time</SelectItem>
          <SelectItem value="mst">Mountain Standard Time</SelectItem>
          <SelectItem value="pst">Pacific Standard Time</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
          <SelectItem value="cet">Central European Time</SelectItem>
          <SelectItem value="eet">Eastern European Time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

## Combobox Pattern

Combines `Command`, `Popover`, and `Select` for searchable dropdown.

### Setup Components

```typescript
// app/components/Combobox.tsx
'use client'

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
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
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
// app/components/ComboboxForm.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Combobox } from './Combobox'

const formSchema = z.object({
  language: z.string({
    required_error: 'Please select a language.',
  }),
})

type FormValues = z.infer<typeof formSchema>

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
                {field.state.meta.errors.join(', ')}
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

## Select with Custom Styling

```typescript
// app/components/StyledSelect.tsx
'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/cores/shadcn/components/ui/select'

/**
 * Select with custom styling and sizing
 */
export function StyledSelect() {
  const [value, setValue] = useState<string>('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full max-w-sm border-2 border-blue-200">
        <SelectValue placeholder="Choose an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1" className="font-medium">
          Option 1
        </SelectItem>
        <SelectItem value="option2" className="font-medium">
          Option 2
        </SelectItem>
        <SelectItem value="option3" className="font-medium">
          Option 3
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## Select with Disabled State

```typescript
// app/components/SelectWithDisabled.tsx
'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/cores/shadcn/components/ui/select'

/**
 * Select component with disabled options
 */
export function SelectWithDisabled() {
  const [value, setValue] = useState<string>('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="pending" disabled>
          Pending (unavailable)
        </SelectItem>
        <SelectItem value="archived" disabled>
          Archived (unavailable)
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## Best Practices

- Use `SelectValue` placeholder to guide users
- Group related options with `SelectGroup` and `SelectLabel`
- Implement combobox for lists with 10+ items for searchability
- Keep option labels concise and clear
- Disable unavailable options rather than removing them
- Provide feedback when selection changes
- Use proper ARIA labels for accessibility
