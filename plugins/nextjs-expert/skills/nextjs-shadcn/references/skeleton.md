---
name: skeleton
description: Animated placeholder component for loading states and content placeholders
when-to-use: Loading data, skeleton screens, placeholder layouts, content feedback
keywords: loading, placeholder, shimmer, animation, feedback, skeleton-screen
priority: high
requires: card.md
related: progress.md, spinner.md
---

# Skeleton Component

Import Skeleton from `@/modules/cores/shadcn/components/ui/skeleton`:

```typescript
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"
```

## Installation

```bash
bunx --bun shadcn@latest add skeleton
```

## Basic Skeleton

Simple animated placeholder:

```tsx
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"

export function SkeletonBasic() {
  return <Skeleton className="h-12 w-12 rounded-full" />
}
```

## Skeleton Card Pattern

Common pattern for loading card content:

```tsx
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/modules/cores/shadcn/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  )
}
```

## Skeleton List Pattern

Loading state for list of items:

```tsx
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Skeleton Table Pattern

Loading state for table rows:

```tsx
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"

export function SkeletonTable() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
}
```

## Avatar Skeleton

Loading state for user avatars:

```tsx
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"

export function SkeletonAvatar() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```

## Skeleton Image

Loading placeholder for images:

```tsx
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"

export function SkeletonImage() {
  return <Skeleton className="h-[125px] w-[250px] rounded-xl" />
}
```

## Skeleton Blog Post

Loading state for blog post:

```tsx
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"

export function SkeletonBlogPost() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
```

## Skeleton with Multiple Rows

Dynamic skeleton with configurable row count:

```tsx
import { Skeleton } from "@/modules/cores/shadcn/components/ui/skeleton"

interface SkeletonRowsProps {
  rows?: number
}

export function SkeletonRows({ rows = 5 }: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="mb-4">
          <Skeleton className="w-full h-8 rounded" />
        </div>
      ))}
    </>
  )
}
```

## Props

```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}
```

- Extends standard HTML div attributes
- Use `className` for sizing and styling
- Built-in `animate-pulse` animation

## Styling

Customize skeleton appearance with Tailwind classes:

```tsx
{/* Circle skeleton */}
<Skeleton className="h-12 w-12 rounded-full" />

{/* Rectangular skeleton */}
<Skeleton className="h-4 w-full" />

{/* Large block skeleton */}
<Skeleton className="h-64 w-full rounded-lg" />

{/* Custom colors */}
<Skeleton className="h-4 w-full bg-gray-200" />
```

## Animation

Default animation is `animate-pulse`. For custom animation:

```tsx
<Skeleton className="h-4 w-full animate-spin" />
```

## Common Patterns

### Stats Card Loading

```tsx
export function StatsLoadingCard() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-4 w-1/4 mb-3" />
      <Skeleton className="h-8 w-1/3" />
    </div>
  )
}
```

### Dashboard Grid Loading

```tsx
export function DashboardLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  )
}
```

### Form Loading

```tsx
export function FormLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-1/3" />
    </div>
  )
}
```

## Accessibility

- Skeleton is decorative, use aria-label to announce loading state
- Wrap in container with `role="status"` for dynamic content
- Consider adding text alternative:

```tsx
<div role="status" aria-label="Loading content">
  <Skeleton className="h-4 w-full mb-2" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

## Best Practices

- Match skeleton layout to actual content dimensions
- Use appropriate skeleton patterns for each content type
- Provide fallback text for non-visual browsers
- Avoid skeleton screens for fast-loading content (< 200ms)
- Combine with error states for failed loads
- Use consistent spacing between skeleton rows

## See Also

- [Progress](./progress.md) - Determinate progress indicator
- [Spinner](./spinner.md) - Loading spinner animation
- [Card](./card.md) - Card container for content
