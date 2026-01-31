---
name: radio-group
description: Set of radio buttons where only one option can be selected at a time
when-to-use: Mutually exclusive choices, preference selection, single choice from multiple options
keywords: radio-button, radio-button-group, single-selection, mutually-exclusive, form-control
priority: high
requires: label.md
related: switch.md, checkbox.md
---

# Radio Group Component

## Overview

The RadioGroup component renders a group of radio buttons using Radix UI's primitive. It ensures only one option can be selected at a time and provides proper accessibility features.

## Installation

```bash
bunx --bun shadcn@latest add radio-group
```

## Basic Usage

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/modules/cores/shadcn/components/ui/radio-group"

export function BasicRadioGroup() {
  return (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Option Three</Label>
      </div>
    </RadioGroup>
  )
}
```

## Controlled Radio Group

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/modules/cores/shadcn/components/ui/radio-group"

export function ControlledRadioGroup() {
  const [selected, setSelected] = useState("standard")

  return (
    <div>
      <RadioGroup value={selected} onValueChange={setSelected}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="free" id="free" />
          <Label htmlFor="free">Free - $0/month</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="standard" id="standard" />
          <Label htmlFor="standard">Standard - $15/month</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="premium" id="premium" />
          <Label htmlFor="premium">Premium - $30/month</Label>
        </div>
      </RadioGroup>

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p>Selected Plan: <strong>{selected}</strong></p>
      </div>
    </div>
  )
}
```

## Horizontal Layout

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/modules/cores/shadcn/components/ui/radio-group"

export function HorizontalRadioGroup() {
  return (
    <RadioGroup defaultValue="small">
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="small" id="small" />
          <Label htmlFor="small">Small</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="medium" id="medium" />
          <Label htmlFor="medium">Medium</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="large" id="large" />
          <Label htmlFor="large">Large</Label>
        </div>
      </div>
    </RadioGroup>
  )
}
```

## With Descriptions

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/modules/cores/shadcn/components/ui/radio-group"

export function RadioGroupWithDescriptions() {
  const [selected, setSelected] = useState("personal")

  const options = [
    {
      value: "personal",
      label: "Personal",
      description: "For individual use"
    },
    {
      value: "business",
      label: "Business",
      description: "For organizations and teams"
    },
    {
      value: "enterprise",
      label: "Enterprise",
      description: "For large-scale deployments"
    }
  ]

  return (
    <RadioGroup value={selected} onValueChange={setSelected}>
      {options.map((option) => (
        <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg">
          <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
          <div>
            <Label htmlFor={option.value} className="cursor-pointer">
              {option.label}
            </Label>
            <p className="text-sm text-muted-foreground">
              {option.description}
            </p>
          </div>
        </div>
      ))}
    </RadioGroup>
  )
}
```

## Disabled Options

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/modules/cores/shadcn/components/ui/radio-group"

export function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="available">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="available" id="available" />
        <Label htmlFor="available">Available</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="unavailable" id="unavailable" disabled />
        <Label htmlFor="unavailable" className="text-muted-foreground">
          Unavailable (disabled)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pending" id="pending" />
        <Label htmlFor="pending">Pending</Label>
      </div>
    </RadioGroup>
  )
}
```

## Card-based Selection

```tsx
"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/modules/cores/shadcn/components/ui/radio-group"

interface Plan {
  value: string
  title: string
  description: string
  price: string
  features: string[]
}

export function RadioGroupCards() {
  const [selected, setSelected] = useState("standard")

  const plans: Plan[] = [
    {
      value: "free",
      title: "Free",
      description: "Great for trying things out",
      price: "$0",
      features: ["5 projects", "Basic support", "1 GB storage"]
    },
    {
      value: "standard",
      title: "Standard",
      description: "Perfect for small teams",
      price: "$15",
      features: ["Unlimited projects", "Priority support", "10 GB storage"]
    },
    {
      value: "premium",
      title: "Premium",
      description: "For power users",
      price: "$30",
      features: ["Everything in Standard", "Advanced features", "100 GB storage"]
    }
  ]

  return (
    <RadioGroup value={selected} onValueChange={setSelected}>
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <label
            key={plan.value}
            className={`cursor-pointer p-4 border-2 rounded-lg transition ${
              selected === plan.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <RadioGroupItem value={plan.value} id={plan.value} />
              <h3 className="font-semibold">{plan.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {plan.description}
            </p>
            <p className="text-lg font-bold mb-3">{plan.price}/month</p>
            <ul className="space-y-1">
              {plan.features.map((feature) => (
                <li key={feature} className="text-sm">
                  • {feature}
                </li>
              ))}
            </ul>
          </label>
        ))}
      </div>
    </RadioGroup>
  )
}
```

## Form Integration

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/modules/cores/shadcn/components/ui/radio-group"

export function RadioGroupForm() {
  const [formData, setFormData] = useState({
    preference: "email"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset>
        <legend className="text-base font-semibold mb-4">
          How would you like to receive notifications?
        </legend>

        <RadioGroup
          value={formData.preference}
          onValueChange={(value) =>
            setFormData({ ...formData, preference: value })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sms" id="sms" />
            <Label htmlFor="sms">SMS</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Both</Label>
          </div>
        </RadioGroup>
      </fieldset>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Save Preference
      </button>
    </form>
  )
}
```

## Props

### RadioGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Currently selected value (controlled) |
| `defaultValue` | `string` | - | Initial selected value (uncontrolled) |
| `onValueChange` | `function` | - | Callback when selection changes |
| `disabled` | `boolean` | false | Disable entire group |
| `name` | `string` | - | HTML form name attribute |
| `className` | `string` | - | Additional CSS classes |

### RadioGroupItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Unique value for this option |
| `id` | `string` | - | HTML id attribute |
| `disabled` | `boolean` | false | Disable this option |
| `className` | `string` | - | Additional CSS classes |

## Import Paths

- **Component**: `@/modules/cores/shadcn/components/ui/radio-group`
- **Re-export**: Use barrel export at `@/modules/cores/shadcn/components/ui`

## Accessibility

- Keyboard navigation with arrow keys
- Screen reader support with ARIA attributes
- Proper label association with htmlFor
- Focus management

## Related Components

- [Label Component](./label.md) - Form label
- [Switch Component](./switch.md) - Boolean toggle
- [Checkbox Component](./checkbox.md) - Multiple selection
