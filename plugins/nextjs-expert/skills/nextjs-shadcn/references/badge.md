---
name: badge
description: Small label component for tagging, categorizing, and highlighting content
when-to-use: Status indicators, tags, categories, pills, small labels
keywords: tag, label, pill, status, category, indicator
priority: medium
requires:
related:
---

# Badge Component

Simple, flexible badge component for displaying labels, tags, and status indicators.

## Installation

```bash
bunx --bun shadcn-ui@latest add badge
```

## Default Badge

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"

export function DefaultBadge() {
  return <Badge>Badge</Badge>
}
```

## Badge Variants

All available variants with their use cases:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"

export function BadgeVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Default variant - primary color */}
      <Badge>Default</Badge>

      {/* Secondary variant - muted background */}
      <Badge variant="secondary">Secondary</Badge>

      {/* Destructive variant - red for negative states */}
      <Badge variant="destructive">Destructive</Badge>

      {/* Outline variant - bordered */}
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}
```

## Badge with Icon

Combine badges with icons from lucide-react:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, Zap } from "lucide-react"

export function BadgeWithIcon() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Badge className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>
      </div>

      <div className="flex gap-2">
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      </div>

      <div className="flex gap-2">
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Error
        </Badge>
      </div>

      <div className="flex gap-2">
        <Badge variant="outline" className="gap-1">
          <Zap className="h-3 w-3" />
          Premium
        </Badge>
      </div>
    </div>
  )
}
```

## Badge with Status Indicator

Use badges to show status with color coding:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "error"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const badgeConfig = {
    active: { variant: "default" as const, label: "Active" },
    inactive: { variant: "secondary" as const, label: "Inactive" },
    pending: { variant: "secondary" as const, label: "Pending" },
    error: { variant: "destructive" as const, label: "Error" },
  }

  const config = badgeConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
```

## Badge as Link

Use `asChild` to render badge as a link:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"
import Link from "next/link"

export function BadgeAsLink() {
  return (
    <div className="flex gap-2">
      <Badge asChild>
        <Link href="/docs/components">Documentation</Link>
      </Badge>

      <Badge asChild variant="outline">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </Badge>
    </div>
  )
}
```

## Badge in List

Display badges within lists for tagging:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"

interface Post {
  id: number
  title: string
  tags: string[]
}

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="rounded border p-4">
          <h3 className="mb-2 font-semibold">{post.title}</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Dismissible Badge

Badge with close button for removable tags:

```tsx
"use client"

import { useState } from "react"
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"
import { X } from "lucide-react"

interface DismissibleBadgesProps {
  initialTags: string[]
}

export function DismissibleBadges({
  initialTags,
}: DismissibleBadgesProps) {
  const [tags, setTags] = useState(initialTags)

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="cursor-pointer gap-1 pr-1"
        >
          {tag}
          <X
            className="h-3 w-3 hover:text-destructive"
            onClick={() => removeTag(tag)}
          />
        </Badge>
      ))}
    </div>
  )
}
```

## Badge in Card Header

Display badges within card headers for labeling:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/modules/cores/shadcn/components/ui/card"

export function CardWithBadges() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Feature Release</CardTitle>
            <CardDescription>New features added to the platform</CardDescription>
          </div>
          <Badge>New</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>Details about the feature release go here.</p>
      </CardContent>
    </Card>
  )
}
```

## Badge Count

Display count badges for notifications:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"
import { Bell } from "lucide-react"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

interface NotificationButtonProps {
  count: number
}

export function NotificationButton({ count }: NotificationButtonProps) {
  return (
    <div className="relative inline-block">
      <Button variant="outline" size="icon">
        <Bell className="h-4 w-4" />
      </Button>
      {count > 0 && (
        <Badge
          className="absolute -right-2 -top-2 h-6 w-6 rounded-full flex items-center justify-center p-0 text-xs"
          variant="destructive"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </div>
  )
}
```

## Badge Group

Display multiple badges together:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"

interface BadgeGroupProps {
  label: string
  badges: string[]
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function BadgeGroup({
  label,
  badges,
  variant = "secondary",
}: BadgeGroupProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <Badge key={badge} variant={variant}>
            {badge}
          </Badge>
        ))}
      </div>
    </div>
  )
}
```

## Animated Badge

Add hover effects to badges:

```tsx
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"

export function AnimatedBadge() {
  return (
    <div className="flex gap-2">
      <Badge className="cursor-pointer transition-transform hover:scale-105">
        Hover Me
      </Badge>

      <Badge
        variant="outline"
        className="cursor-pointer transition-colors hover:bg-slate-100"
      >
        Interactive
      </Badge>
    </div>
  )
}
```

## API Reference

- `Badge` - Root component
  - `variant` - `"default"` | `"secondary"` | `"destructive"` | `"outline"`
  - `asChild` - Render as child element (for Link, anchor)
  - `className` - Custom CSS classes

## Styling

Default CSS classes:
- `.h-4 .w-4` - Icon size
- `.gap-1` - Icon spacing
- `.rounded-full` - Circular badge
- `.flex` - Flex container
- `.items-center` - Vertical centering

## Common Patterns

1. **Status Indicator** - Use variant mapping for status colors
2. **Removable Tags** - Add X icon with click handler
3. **Notification Badge** - Position absolute over icon
4. **Tag List** - Use `flex-wrap` with gap for tag groups
5. **Interactive Badge** - Add hover effects with transitions
