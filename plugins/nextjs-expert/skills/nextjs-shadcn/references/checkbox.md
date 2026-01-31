---
name: checkbox
description: Accessible checkbox, switch, and radio group components
when-to-use: Boolean selections, toggles, multiple choice, on/off states
keywords: checkbox, switch, toggle, radio-group, input-check
priority: medium
requires: null
related: select.md, dialog.md
---

# Checkbox Component

Accessible checkbox built on Radix UI. Includes checkbox with label, switch toggle component, and radio group for mutually exclusive options.

## Installation

```bash
bunx --bun shadcn-ui@latest add checkbox
bunx --bun shadcn-ui@latest add switch
bunx --bun shadcn-ui@latest add radio-group
```

## Basic Checkbox

```typescript
// app/components/BasicCheckbox.tsx
'use client'

import { useState } from 'react'
import { Checkbox } from '@/modules/cores/shadcn/components/ui/checkbox'

/**
 * Basic checkbox component with state management
 */
export function BasicCheckbox() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        I agree to the terms and conditions
      </label>
    </div>
  )
}
```

## Checkbox with Label

```typescript
// app/components/CheckboxWithLabel.tsx
'use client'

import { useState } from 'react'
import { Checkbox } from '@/modules/cores/shadcn/components/ui/checkbox'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

/**
 * Checkbox with associated label for improved accessibility
 */
export function CheckboxWithLabel() {
  const [acceptMarketing, setAcceptMarketing] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="marketing"
          checked={acceptMarketing}
          onCheckedChange={setAcceptMarketing}
        />
        <Label htmlFor="marketing" className="font-normal cursor-pointer">
          Send me marketing emails
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={setAcceptTerms}
        />
        <Label htmlFor="terms" className="font-normal cursor-pointer">
          I agree to terms and conditions
        </Label>
      </div>
    </div>
  )
}
```

## Switch Component

Toggle component for on/off states. More intuitive for binary choices than checkboxes.

```typescript
// app/components/BasicSwitch.tsx
'use client'

import { useState } from 'react'
import { Switch } from '@/modules/cores/shadcn/components/ui/switch'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

/**
 * Switch component for binary on/off states
 */
export function BasicSwitch() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark mode</Label>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Enable notifications</Label>
        <Switch
          id="notifications"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      </div>
    </div>
  )
}
```

## Switch with Description

```typescript
// app/components/SwitchWithDescription.tsx
'use client'

import { useState } from 'react'
import { Switch } from '@/modules/cores/shadcn/components/ui/switch'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

/**
 * Switch with descriptive text for settings
 */
export function SwitchWithDescription() {
  const [publicProfile, setPublicProfile] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="public">Public profile</Label>
          <p className="text-sm text-gray-500">
            Allow others to discover your profile
          </p>
        </div>
        <Switch
          id="public"
          checked={publicProfile}
          onCheckedChange={setPublicProfile}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="2fa">Two-factor authentication</Label>
          <p className="text-sm text-gray-500">
            Enhance your account security
          </p>
        </div>
        <Switch
          id="2fa"
          checked={twoFactor}
          onCheckedChange={setTwoFactor}
        />
      </div>
    </div>
  )
}
```

## RadioGroup Component

Mutually exclusive options selection.

```typescript
// app/components/BasicRadioGroup.tsx
'use client'

import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/modules/cores/shadcn/components/ui/radio-group'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

/**
 * Radio group for mutually exclusive selections
 */
export function BasicRadioGroup() {
  const [delivery, setDelivery] = useState<string>('standard')

  return (
    <RadioGroup value={delivery} onValueChange={setDelivery}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="standard" id="standard" />
        <Label htmlFor="standard" className="font-normal cursor-pointer">
          Standard (5-7 business days)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="express" id="express" />
        <Label htmlFor="express" className="font-normal cursor-pointer">
          Express (2-3 business days)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="overnight" id="overnight" />
        <Label htmlFor="overnight" className="font-normal cursor-pointer">
          Overnight delivery
        </Label>
      </div>
    </RadioGroup>
  )
}
```

## RadioGroup with Description

```typescript
// app/components/RadioGroupWithDescription.tsx
'use client'

import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/modules/cores/shadcn/components/ui/radio-group'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

/**
 * Radio group with descriptive text for each option
 */
export function RadioGroupWithDescription() {
  const [plan, setPlan] = useState<string>('starter')

  const plans = [
    {
      id: 'starter',
      label: 'Starter',
      description: '$29/month - Perfect for individuals',
    },
    {
      id: 'pro',
      label: 'Pro',
      description: '$99/month - Great for growing teams',
    },
    {
      id: 'enterprise',
      label: 'Enterprise',
      description: 'Custom pricing - For large organizations',
    },
  ]

  return (
    <RadioGroup value={plan} onValueChange={setPlan}>
      <div className="space-y-4">
        {plans.map(option => (
          <div key={option.id} className="flex items-start space-x-2">
            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
            <div className="flex-1">
              <Label htmlFor={option.id} className="font-medium cursor-pointer">
                {option.label}
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </RadioGroup>
  )
}
```

## Checkbox Group Array

```typescript
// app/components/CheckboxGroup.tsx
'use client'

import { useState } from 'react'
import { Checkbox } from '@/modules/cores/shadcn/components/ui/checkbox'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

interface CheckboxItem {
  id: string
  label: string
  description?: string
}

interface CheckboxGroupProps {
  items: CheckboxItem[]
  value?: string[]
  onValueChange?: (value: string[]) => void
}

/**
 * Checkbox group component for multiple selections
 */
export function CheckboxGroup({
  items,
  value = [],
  onValueChange,
}: CheckboxGroupProps) {
  const [selected, setSelected] = useState<string[]>(value)

  const handleChange = (itemId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selected, itemId]
      : selected.filter(id => id !== itemId)
    setSelected(newSelected)
    onValueChange?.(newSelected)
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="flex items-start space-x-2">
          <Checkbox
            id={item.id}
            checked={selected.includes(item.id)}
            onCheckedChange={checked => handleChange(item.id, checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor={item.id} className="font-medium cursor-pointer">
              {item.label}
            </Label>
            {item.description && (
              <p className="text-sm text-gray-500 mt-1">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Form Integration Example

```typescript
// app/components/CheckboxFormExample.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import * as z from 'zod'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Checkbox } from '@/modules/cores/shadcn/components/ui/checkbox'
import { Label } from '@/modules/cores/shadcn/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/modules/cores/shadcn/components/ui/radio-group'
import { Switch } from '@/modules/cores/shadcn/components/ui/switch'

const formSchema = z.object({
  newsletter: z.boolean().default(false),
  notifications: z.boolean().default(true),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
})

type FormValues = z.infer<typeof formSchema>

/**
 * Form with checkbox, switch, and radio group fields using TanStack Form
 */
export function CheckboxFormExample() {
  const form = useForm<FormValues>({
    defaultValues: {
      newsletter: false,
      notifications: true,
      frequency: 'weekly',
      interests: [],
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
      {/* Newsletter Checkbox */}
      <form.Field
        name="newsletter"
        validators={{
          onChange: zodValidator(formSchema.pick({ newsletter: true })),
        }}
      >
        {(field) => (
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={field.name} className="text-base">Newsletter</Label>
            </div>
            <Checkbox
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked as boolean)}
            />
          </div>
        )}
      </form.Field>

      {/* Notifications Switch */}
      <form.Field
        name="notifications"
        validators={{
          onChange: zodValidator(formSchema.pick({ notifications: true })),
        }}
      >
        {(field) => (
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={field.name} className="text-base">Notifications</Label>
            </div>
            <Switch
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
            />
          </div>
        )}
      </form.Field>

      {/* Email Frequency Radio Group */}
      <form.Field
        name="frequency"
        validators={{
          onChange: zodValidator(formSchema.pick({ frequency: true })),
        }}
      >
        {(field) => (
          <div className="space-y-3">
            <Label>Email frequency</Label>
            <RadioGroup
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value as any)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="font-normal cursor-pointer">
                  Daily
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="font-normal cursor-pointer">
                  Weekly
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="font-normal cursor-pointer">
                  Monthly
                </Label>
              </div>
            </RadioGroup>
            {field.state.meta.errors[0] && (
              <span className="text-sm text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      {/* Interests Checkbox Array */}
      <form.Field
        name="interests"
        validators={{
          onChange: zodValidator(formSchema.pick({ interests: true })),
        }}
      >
        {(field) => (
          <div className="space-y-3">
            <Label>Interests</Label>
            <div className="space-y-3">
              {['Technology', 'Science', 'Business'].map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={field.state.value.includes(interest)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.state.value, interest]
                        : field.state.value.filter((i) => i !== interest)
                      field.handleChange(newValue)
                    }}
                  />
                  <Label htmlFor={interest} className="font-normal cursor-pointer">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
            {field.state.meta.errors[0] && (
              <span className="text-sm text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Saving...' : 'Save preferences'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

## Best Practices

- Use **checkbox** for multiple independent selections
- Use **switch** for binary on/off states and settings
- Use **radio group** for mutually exclusive options
- Always pair form controls with labels for accessibility
- Provide descriptions for complex options
- Use consistent spacing and alignment
- Disable options that are unavailable
- Provide visual feedback on state changes
- Test keyboard navigation and screen reader support
