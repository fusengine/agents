---
name: slider
description: Range input control for selecting numeric values
when-to-use: Price ranges, volume control, percentage selection, continuous value input
keywords: slider-range, range-input, value-selection, numeric-range, range-slider
priority: medium
requires: label.md
related: input.md
---

# Slider Component

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: RAC `Slider` — `minValue`/`maxValue`, `onChange`/`onChangeEnd`, `isDisabled` (`shadcn docs slider --base aria`). Sources: https://ui.shadcn.com/r/styles/base-nova/slider.json, https://ui.shadcn.com/r/styles/radix-nova/slider.json

Always pass **arrays** (`[50]`, `[20, 80]`): the wrapper renders one thumb per array entry and
falls back to two thumbs (`[min, max]`) when it gets no array. Base UI types
`onValueChange(value: number | number[], eventDetails)`, hence the `as number[]` casts.

## Overview

The Slider component provides a range input control for selecting numeric values. It supports single value selection and range selection with keyboard navigation and touch support.

## Installation

```bash
bunx --bun shadcn@latest add slider
```

## Basic Usage

```tsx
import { Slider } from "@/modules/cores/shadcn/components/ui/slider"

/** Single-value slider. */
export function BasicSlider() {
  return <Slider defaultValue={[50]} max={100} step={1} />
}
```

## With Value Display

```tsx
import { useState } from "react"
import { Slider } from "@/modules/cores/shadcn/components/ui/slider"
import { Label } from "@/modules/cores/shadcn/components/ui/label"

/** Controlled slider displaying its current value. */
export function SliderWithValue() {
  const [value, setValue] = useState([50])

  return (
    <div className="grid w-full gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="volume">Volume</Label>
        <span className="text-sm font-semibold">{value[0]}%</span>
      </div>
      <Slider
        id="volume"
        defaultValue={[50]}
        max={100}
        step={1}
        value={value}
        onValueChange={(v) => setValue(v as number[])}
        className="w-full"
      />
    </div>
  )
}
```

## Range Slider

```tsx
import { useState } from "react"
import { Slider } from "@/modules/cores/shadcn/components/ui/slider"
import { Label } from "@/modules/cores/shadcn/components/ui/label"

/** Two-thumb range slider. */
export function RangeSlider() {
  const [range, setRange] = useState([20, 80])

  return (
    <div className="grid w-full gap-4">
      <div className="flex items-center justify-between">
        <Label>Price Range</Label>
        <span className="text-sm font-semibold">
          ${range[0]} - ${range[1]}
        </span>
      </div>
      <Slider
        defaultValue={[20, 80]}
        max={1000}
        step={1}
        value={range}
        onValueChange={(v) => setRange(v as number[])}
        className="w-full"
      />
    </div>
  )
}
```

## Step Increments

```tsx
import { useState } from "react"
import { Slider } from "@/modules/cores/shadcn/components/ui/slider"
import { Label } from "@/modules/cores/shadcn/components/ui/label"

/** Discrete slider mapped to named sizes. */
export function SliderSteps() {
  const [value, setValue] = useState([3])

  const sizes = ["Small", "Medium", "Large", "Extra Large"]

  return (
    <div className="grid w-full gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="size">Size: {sizes[value[0]]}</Label>
      </div>
      <Slider
        id="size"
        defaultValue={[1]}
        min={0}
        max={sizes.length - 1}
        step={1}
        value={value}
        onValueChange={(v) => setValue(v as number[])}
        className="w-full"
      />
    </div>
  )
}
```

## With Min/Max Labels

```tsx
import { useState } from "react"
import { Slider } from "@/modules/cores/shadcn/components/ui/slider"

/** Slider framed by min/max labels. */
export function SliderWithLabels() {
  const [value, setValue] = useState([50])

  return (
    <div className="grid w-full gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">0</span>
        <span className="text-sm font-semibold">{value[0]}</span>
        <span className="text-sm text-muted-foreground">100</span>
      </div>
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        value={value}
        onValueChange={(v) => setValue(v as number[])}
        className="w-full"
      />
    </div>
  )
}
```

## Disabled State

```tsx
import { Slider } from "@/modules/cores/shadcn/components/ui/slider"
import { Label } from "@/modules/cores/shadcn/components/ui/label"

/** Disabled slider. */
export function DisabledSlider() {
  return (
    <div className="space-y-4">
      <div className="grid w-full gap-2">
        <Label htmlFor="active">Active Slider</Label>
        <Slider
          id="active"
          defaultValue={[50]}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="disabled" className="text-muted-foreground">
          Disabled Slider
        </Label>
        <Slider
          id="disabled"
          defaultValue={[50]}
          max={100}
          step={1}
          disabled
          className="w-full opacity-50"
        />
      </div>
    </div>
  )
}
```

## Multiple Sliders

```tsx
import { useState } from "react"
import { Slider } from "@/modules/cores/shadcn/components/ui/slider"
import { Label } from "@/modules/cores/shadcn/components/ui/label"

interface Colors {
  red: number
  green: number
  blue: number
}

/** Three RGB sliders driving a color preview. */
export function ColorSliders() {
  const [colors, setColors] = useState<Colors>({
    red: 100,
    green: 150,
    blue: 200
  })

  const rgb = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`

  const updateColor = (key: keyof Colors, value: number | readonly number[]) => {
    setColors({ ...colors, [key]: typeof value === "number" ? value : value[0] })
  }

  return (
    <div className="grid w-full gap-6">
      <div
        className="h-24 rounded-lg border"
        style={{ backgroundColor: rgb }}
      />

      <div className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="red">Red</Label>
            <span className="text-sm font-semibold">{colors.red}</span>
          </div>
          <Slider
            id="red"
            defaultValue={[100]}
            max={255}
            step={1}
            value={[colors.red]}
            onValueChange={(val) => updateColor("red", val)}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="green">Green</Label>
            <span className="text-sm font-semibold">{colors.green}</span>
          </div>
          <Slider
            id="green"
            defaultValue={[150]}
            max={255}
            step={1}
            value={[colors.green]}
            onValueChange={(val) => updateColor("green", val)}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="blue">Blue</Label>
            <span className="text-sm font-semibold">{colors.blue}</span>
          </div>
          <Slider
            id="blue"
            defaultValue={[200]}
            max={255}
            step={1}
            value={[colors.blue]}
            onValueChange={(val) => updateColor("blue", val)}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Color: <code>{rgb}</code>
      </p>
    </div>
  )
}
```

## Form Integration

```tsx
import { useState } from "react"
import { Slider } from "@/modules/cores/shadcn/components/ui/slider"
import { Label } from "@/modules/cores/shadcn/components/ui/label"

/** Sliders held in form state and submitted together. */
export function SliderForm() {
  const [formData, setFormData] = useState({
    budget: [500],
    experience: [3]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", {
      budget: formData.budget[0],
      experience: formData.experience[0]
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold">Project Details</legend>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="budget">Budget: ${formData.budget[0]}</Label>
          </div>
          <Slider
            id="budget"
            defaultValue={[500]}
            min={100}
            max={5000}
            step={100}
            value={formData.budget}
            onValueChange={(val) =>
              setFormData({ ...formData, budget: val as number[] })
            }
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="experience">
              Experience: {formData.experience[0]} years
            </Label>
          </div>
          <Slider
            id="experience"
            defaultValue={[3]}
            min={0}
            max={20}
            step={1}
            value={formData.experience}
            onValueChange={(val) =>
              setFormData({ ...formData, experience: val as number[] })
            }
          />
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  )
}
```

## Radix variant

Radix values are always `number[]`, so the setter is passed directly; the commit callback is
`onValueCommit` (Base UI: `onValueCommitted`).

```tsx
/** Radix: controlled slider with a commit callback. */
export function RadixSlider() {
  const [value, setValue] = useState([50])
  return (
    <Slider
      value={value}
      onValueChange={setValue}
      onValueCommit={(v) => console.log("committed", v)}
      max={100}
      step={1}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number[]` (Base UI also `number`) | - | Current value(s) (controlled) — pass an array with this wrapper |
| `defaultValue` | `number[]` (Base UI also `number`) | - | Initial value(s) (uncontrolled) |
| `min` | `number` | 0 | Minimum value |
| `max` | `number` | 100 | Maximum value |
| `step` | `number` | 1 | Step increment |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `disabled` | `boolean` | false | Disable the slider |
| `onValueChange` | `(value: number \| number[], eventDetails) => void` | - | Called on every change (Radix: `(value: number[]) => void`) |
| `onValueCommitted` | `(value: number \| number[], eventDetails) => void` | - | Called on pointer up / key commit (Radix: `onValueCommit`) |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | - | Accessible label for screen readers |

## Import Paths

- **Component**: `@/modules/cores/shadcn/components/ui/slider`
- **Re-export**: Use barrel export at `@/modules/cores/shadcn/components/ui`

## Keyboard Navigation

- Left/Right Arrow: Decrease/increase single value
- Home/End: Jump to min/max
- Page Up/Down: Step increment/decrement

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Touch support for mobile devices
- Clear focus states

## Related Components

- [Label Component](./label.md) - Form label
- [Input Component](./input.md) - Text input alternative
