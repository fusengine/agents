---
name: spinner
description: Animated loading spinner for indicating indeterminate loading states
when-to-use: Data fetching, async operations, page transitions, loading indicators
keywords: loading, spinner, animation, indeterminate, loader, loading-icon
priority: medium
requires: button.md
related: progress.md, skeleton.md
---

# Spinner Component

Import Spinner from `@/modules/cores/shadcn/components/ui/spinner`:

```typescript
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"
```

## Installation

```bash
bunx --bun shadcn@latest add spinner
```

## Basic Spinner

Simple loading spinner:

```tsx
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"

export function SpinnerBasic() {
  return <Spinner />
}
```

## Spinner with Text

Loading spinner with accompanying text:

```tsx
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"

export function SpinnerWithText() {
  return (
    <div className="flex items-center gap-3">
      <Spinner className="h-5 w-5" />
      <span>Loading...</span>
    </div>
  )
}
```

## Loading Button

Button with spinner for async operations:

```tsx
"use client"

import { useState } from "react"
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

export function LoadingButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading && <Spinner className="mr-2 h-4 w-4" />}
      {isLoading ? "Loading..." : "Submit"}
    </Button>
  )
}
```

## Full Page Loading

Full-screen loading overlay:

```tsx
"use client"

import { useState } from "react"
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"

export function FullPageLoading({ isVisible = true }) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex flex-col items-center gap-4 bg-white rounded-lg p-8">
        <Spinner className="h-8 w-8" />
        <p className="text-center text-gray-700">Loading...</p>
      </div>
    </div>
  )
}
```

## Centered Loading State

Spinner centered on page:

```tsx
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"

export function CenteredLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-gray-600">Fetching data...</p>
      </div>
    </div>
  )
}
```

## Spinner Sizes

Different spinner sizes for various use cases:

```tsx
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"

export function SpinnerSizes() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="h-4 w-4" />
      <Spinner className="h-6 w-6" />
      <Spinner className="h-8 w-8" />
      <Spinner className="h-12 w-12" />
    </div>
  )
}
```

## Spinner with Custom Colors

Styled spinner with custom colors:

```tsx
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"

export function SpinnerCustomColors() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Spinner className="h-6 w-6 text-blue-600" />
        <span>Blue spinner</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner className="h-6 w-6 text-green-600" />
        <span>Green spinner</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner className="h-6 w-6 text-red-600" />
        <span>Red spinner</span>
      </div>
    </div>
  )
}
```

## Search Loading

Spinner in search input during search:

```tsx
"use client"

import { useState } from "react"
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"
import { Input } from "@/modules/cores/shadcn/components/ui/input"
import { Search } from "lucide-react"

export function SearchLoading() {
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState("")

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (value.length > 0) {
      setIsSearching(true)
      // Simulate search
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSearching(false)
    }
  }

  return (
    <div className="relative">
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isSearching ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <Search className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  )
}
```

## Skeleton with Spinner

Combine skeleton with spinner for loading states:

```tsx
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"

export function SkeletonWithSpinner({ isLoading = true }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}
```

## Props

```typescript
interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {}
```

- Extends SVG element attributes
- Use `className` for sizing and coloring
- Customize with Tailwind classes

## Styling

Control spinner appearance with Tailwind:

```tsx
{/* Size variants */}
<Spinner className="h-4 w-4" />    {/* Small */}
<Spinner className="h-6 w-6" />    {/* Medium */}
<Spinner className="h-8 w-8" />    {/* Large */}

{/* Color variants */}
<Spinner className="text-blue-600" />
<Spinner className="text-red-600" />
<Spinner className="text-green-600" />

{/* With opacity */}
<Spinner className="opacity-50" />
```

## Animation

Spinner uses built-in CSS animation. For custom animation:

```tsx
<Spinner className="animate-pulse" />
<Spinner className="animate-bounce" />
```

## Accessibility

- Spinners are decorative, use `aria-hidden="true"` when appropriate
- Always provide text describing what's loading
- Use `role="status"` for dynamic content updates
- Announce loading state to screen readers:

```tsx
<div role="status" aria-live="polite">
  <Spinner className="inline mr-2" />
  <span>Loading results...</span>
</div>
```

## Common Patterns

### Form Submission Loading

```tsx
"use client"

import { useState } from "react"
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

export function FormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Submit form
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner className="mr-2 h-4 w-4 inline" />}
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  )
}
```

### Data Fetching

```tsx
"use client"

import { useEffect, useState } from "react"
import { Spinner } from "@/modules/cores/shadcn/components/ui/spinner"

export function DataFetching() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data")
        const result = await response.json()
        setData(result)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner className="h-4 w-4" />
        <span>Loading data...</span>
      </div>
    )
  }

  return <div>{/* Display data */}</div>
}
```

## Best Practices

- Use for operations with unknown duration
- Always combine with text label describing action
- Provide cancel option for long operations
- Use appropriate size relative to context
- Avoid spinners for fast operations (< 200ms)
- Consider progress bar for long operations with known duration
- Use full-page spinner sparingly (page transitions only)

## See Also

- [Progress](./progress.md) - Determinate progress indicator
- [Skeleton](./skeleton.md) - Placeholder loading component
- [Button](./button.md) - Action buttons
