---
name: input
description: Input component patterns with labels, buttons, validation, and form integration
when-to-use: Text input fields, search boxes, forms, validation states
keywords: label, validation, addon, group, aria-invalid, error-message
priority: high
requires: installation.md, configuration.md, button.md
related: card.md
---

# Input Component

## Installation

```bash
bunx shadcn-ui@latest add input label
```

Creates:
- `@/modules/cores/shadcn/components/ui/input.tsx`
- `@/modules/cores/shadcn/components/ui/label.tsx`

## Basic Usage

```typescript
import { Input } from '@/modules/cores/shadcn/components/ui/input'

export function BasicInput() {
  return <Input type="text" placeholder="Enter name..." />
}
```

## Input with Label Pattern

Combine Input and Label for accessibility:

```typescript
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

export function InputWithLabel() {
  const id = 'email'

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Email</Label>
      <Input
        id={id}
        type="email"
        placeholder="name@example.com"
      />
    </div>
  )
}
```

**Why this pattern**:
- `htmlFor` on Label connects to Input `id`
- Clicking label focuses input
- Accessibility for screen readers
- `space-y-2` adds vertical spacing

## Input with Button Pattern (Inline)

Search or action input:

```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Search, Copy } from '@/modules/cores/shadcn/components/icons'

export function SearchInput() {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    console.log('Searching:', query)
    // Handle search logic
  }

  return (
    <div className="flex gap-2 w-full">
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button onClick={handleSearch} size="icon">
        <Search className="w-4 h-4" />
      </Button>
    </div>
  )
}
```

**Pattern breakdown**:
1. Input in flex container
2. Button on right side
3. Button triggered on Enter key or click
4. Icon button for compact layout

## InputGroup Pattern (Addon)

Input with prefix/suffix text or icon:

```typescript
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { DollarSign, Eye, EyeOff } from '@/modules/cores/shadcn/components/icons'
import { useState } from 'react'

export function InputGroupPrefix() {
  return (
    <div className="relative flex items-center">
      <DollarSign className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
      <Input
        type="number"
        placeholder="0.00"
        className="pl-10"
      />
    </div>
  )
}
```

### Input with Show/Hide Password

```typescript
export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
```

**Pattern breakdown**:
1. Relative container for positioning
2. Input with right padding for icon
3. Absolute positioned button on right
4. Toggle state on click
5. Accessible label via aria-label

## Validation States

### Basic Validation

```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

interface InputFieldProps {
  label: string
  error?: string
}

export function ValidatedInput({ label, error }: InputFieldProps) {
  const id = label.toLowerCase()

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={error ? 'border-red-500 focus:ring-red-500' : ''}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
```

**Validation pattern**:
- `aria-invalid={!!error}` for screen readers
- `aria-describedby` links input to error message
- Custom border/ring color on error
- Error message below input

### Form Validation Example

```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

interface FormData {
  email: string
  password: string
}

export function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email format'
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Submit form
      console.log('Form submitted:', formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  )
}
```

## Input Types

All HTML input types supported:

```typescript
// Text
<Input type="text" />

// Email
<Input type="email" placeholder="name@example.com" />

// Password
<Input type="password" />

// Number
<Input type="number" min="0" max="100" />

// Date
<Input type="date" />

// Checkbox (better: use Checkbox component)
<Input type="checkbox" />

// Radio (better: use RadioGroup component)
<Input type="radio" />

// File upload
<Input type="file" accept="image/*" />

// Search
<Input type="search" placeholder="Search..." />

// URL
<Input type="url" placeholder="https://example.com" />

// Telephone
<Input type="tel" placeholder="+1 (555) 000-0000" />
```

## Controlled vs Uncontrolled

### Controlled (Recommended)

State-managed input:

```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/modules/cores/shadcn/components/ui/input'

export function ControlledInput() {
  const [value, setValue] = useState('')

  return (
    <>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>You typed: {value}</p>
    </>
  )
}
```

### Uncontrolled (Simple use cases)

Use `defaultValue` for initial value:

```typescript
import { useRef } from 'react'
import { Input } from '@/modules/cores/shadcn/components/ui/input'

export function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (inputRef.current) {
      console.log(inputRef.current.value)
    }
  }

  return (
    <>
      <Input ref={inputRef} defaultValue="Initial value" />
      <button onClick={handleClick}>Get value</button>
    </>
  )
}
```

## Disabled & ReadOnly States

```typescript
// Disabled: cannot interact
<Input disabled placeholder="Disabled" />

// ReadOnly: can select/copy but not edit
<Input readOnly value="Read only content" />
```

## Accessibility

### ARIA Labels

For input without visible label:

```typescript
<Input
  aria-label="Search products"
  placeholder="Search..."
/>
```

### Error Association

```typescript
<Input
  id="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && <p id="email-error">Invalid email</p>}
```

### Required Fields

```typescript
<Label>
  Email
  <span className="text-red-500">*</span>
</Label>
<Input required aria-required="true" />
```

## Common Patterns

### Search with Clear Button

```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { X } from '@/modules/cores/shadcn/components/icons'

export function SearchWithClear() {
  const [search, setSearch] = useState('')

  return (
    <div className="relative flex items-center">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setSearch('')}
          className="absolute right-1"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
```

### Input with Character Count

```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/modules/cores/shadcn/components/ui/input'

export function InputWithCounter() {
  const [value, setValue] = useState('')
  const maxLength = 100

  return (
    <div className="space-y-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        placeholder="Enter text..."
      />
      <p className="text-xs text-gray-500">
        {value.length} / {maxLength}
      </p>
    </div>
  )
}
```

## Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

Supports all standard HTML input attributes:
- `type`
- `placeholder`
- `value`
- `onChange`
- `onBlur`
- `onFocus`
- `disabled`
- `readOnly`
- `required`
- `min`, `max`, `step` (for number)
- `accept` (for file)
- `maxLength`
- `aria-*`

## Type Safety

```typescript
import type { ChangeEvent } from 'react'
import { Input } from '@/modules/cores/shadcn/components/ui/input'

export function TypeSafeInput() {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log(value)
  }

  return <Input onChange={handleChange} />
}
```

## Related Components

- [Label](https://ui.shadcn.com/docs/components/label) - Form label
- [Button](button.md) - Action button
- [Form](https://ui.shadcn.com/docs/components/form) - Full form management
- [Textarea](https://ui.shadcn.com/docs/components/textarea) - Multi-line text
- [Select](https://ui.shadcn.com/docs/components/select) - Dropdown selection
