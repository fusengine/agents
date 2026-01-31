---
name: textarea
description: Multi-line text input component with built-in styling and validation support
when-to-use: Comments, messages, descriptions, long-form content input
keywords: text-area, multi-line, character-count, validation-states, resize
priority: high
requires: label.md
related: input.md, label.md
---

# Textarea Component

## Overview

The Textarea component is a multi-line text input field. It extends the HTML textarea element with Tailwind styling and supports features like character counts, validation states, and customizable sizing.

## Installation

```bash
bunx --bun shadcn@latest add textarea
```

## Basic Usage

```tsx
import { Textarea } from "@/modules/cores/shadcn/components/ui/textarea"

export function BasicTextarea() {
  return <Textarea placeholder="Enter your message here..." />
}
```

## With Label

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Textarea } from "@/modules/cores/shadcn/components/ui/textarea"

export function TextareaWithLabel() {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="message">Your Message</Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  )
}
```

## Character Count Pattern

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Textarea } from "@/modules/cores/shadcn/components/ui/textarea"

const MAX_CHARS = 500

export function TextareaWithCharCount() {
  const [value, setValue] = useState("")
  const remaining = MAX_CHARS - value.length

  return (
    <div className="grid w-full gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="message">Message</Label>
        <span className="text-xs text-muted-foreground">
          {remaining} / {MAX_CHARS}
        </span>
      </div>
      <Textarea
        id="message"
        placeholder="Type your message..."
        maxLength={MAX_CHARS}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={remaining < 50 ? "border-yellow-500" : ""}
      />
    </div>
  )
}
```

## Validation States

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Textarea } from "@/modules/cores/shadcn/components/ui/textarea"

export function TextareaValidation() {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setValue(val)

    // Clear error if valid
    if (val.length > 0) {
      setError("")
    }
  }

  const handleSubmit = () => {
    if (value.trim().length === 0) {
      setError("Message cannot be empty")
    } else if (value.length < 10) {
      setError("Message must be at least 10 characters")
    } else {
      setError("")
      // Submit logic
    }
  }

  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="feedback">Feedback</Label>
      <Textarea
        id="feedback"
        placeholder="Tell us what you think..."
        value={value}
        onChange={handleChange}
        className={error ? "border-red-500" : ""}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "error-message" : undefined}
      />
      {error && (
        <p id="error-message" className="text-sm text-red-500">
          {error}
        </p>
      )}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  )
}
```

## Disabled State

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Textarea } from "@/modules/cores/shadcn/components/ui/textarea"

export function DisabledTextarea() {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="readonly">Read-only Feedback</Label>
      <Textarea
        id="readonly"
        placeholder="This is disabled..."
        disabled
        value="This field is currently disabled"
      />
    </div>
  )
}
```

## Resizable Variants

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Textarea } from "@/modules/cores/shadcn/components/ui/textarea"

export function TextareaResize() {
  return (
    <div className="space-y-6">
      {/* Vertical resize only (default) */}
      <div className="grid w-full gap-2">
        <Label htmlFor="vertical">Vertical Resize</Label>
        <Textarea id="vertical" placeholder="Resize vertically..." />
      </div>

      {/* No resize */}
      <div className="grid w-full gap-2">
        <Label htmlFor="none">No Resize</Label>
        <Textarea
          id="none"
          placeholder="Cannot resize..."
          className="resize-none"
        />
      </div>

      {/* Both directions */}
      <div className="grid w-full gap-2">
        <Label htmlFor="both">Both Directions</Label>
        <Textarea
          id="both"
          placeholder="Resize in any direction..."
          className="resize"
        />
      </div>
    </div>
  )
}
```

## Rows and Columns

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Textarea } from "@/modules/cores/shadcn/components/ui/textarea"

export function TextareaSize() {
  return (
    <div className="space-y-6">
      {/* Small */}
      <div className="grid w-full gap-2">
        <Label htmlFor="small">Small (3 rows)</Label>
        <Textarea id="small" rows={3} placeholder="Small textarea..." />
      </div>

      {/* Default */}
      <div className="grid w-full gap-2">
        <Label htmlFor="medium">Medium (5 rows)</Label>
        <Textarea id="medium" rows={5} placeholder="Medium textarea..." />
      </div>

      {/* Large */}
      <div className="grid w-full gap-2">
        <Label htmlFor="large">Large (8 rows)</Label>
        <Textarea id="large" rows={8} placeholder="Large textarea..." />
      </div>
    </div>
  )
}
```

## Auto-expanding Textarea

```tsx
"use client"

import { useRef, useEffect } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Textarea } from "@/modules/cores/shadcn/components/ui/textarea"

export function AutoExpandingTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleInput = () => {
      textarea.style.height = "auto"
      textarea.style.height = textarea.scrollHeight + "px"
    }

    textarea.addEventListener("input", handleInput)
    return () => textarea.removeEventListener("input", handleInput)
  }, [])

  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="auto">Auto-expanding Textarea</Label>
      <Textarea
        ref={textareaRef}
        id="auto"
        placeholder="Start typing and watch the height expand..."
        className="resize-none overflow-hidden"
        rows={1}
      />
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | 3 | Number of visible text lines |
| `cols` | `number` | - | Number of character columns |
| `maxLength` | `number` | - | Maximum characters allowed |
| `disabled` | `boolean` | false | Disable the field |
| `readOnly` | `boolean` | false | Make field read-only |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Controlled input value |
| `onChange` | `function` | - | Change event handler |
| `className` | `string` | - | Additional CSS classes |
| `aria-invalid` | `boolean` | - | Mark field as invalid for screen readers |
| `aria-describedby` | `string` | - | Reference to error message element |

## Import Paths

- **Component**: `@/modules/cores/shadcn/components/ui/textarea`
- **Re-export**: Use barrel export at `@/modules/cores/shadcn/components/ui`

## Related Components

- [Label Component](./label.md) - Form label element
- [Input Component](./input.md) - Single-line text input
