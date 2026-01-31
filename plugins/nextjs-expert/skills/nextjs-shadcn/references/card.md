---
name: card
description: Card component for layouts, containers, and composition patterns
when-to-use: Sections, containers, list items, dashboard widgets, form sections
keywords: layout, container, header, content, footer, grid
priority: high
requires: installation.md, configuration.md
related: button.md, input.md
---

# Card Component

## Installation

```bash
bunx shadcn-ui@latest add card
```

Creates: `@/modules/cores/shadcn/components/ui/card.tsx`

## Basic Usage

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/cores/shadcn/components/ui/card'

export function BasicCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the card content.</p>
      </CardContent>
    </Card>
  )
}
```

## Card Structure

A complete Card has these optional parts:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Main heading</CardTitle>
    <CardDescription>Subtitle or description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content goes here */}
  </CardContent>
  <CardFooter>
    {/* Footer actions or info */}
  </CardFooter>
</Card>
```

### CardHeader

Top section, typically for title and description:

```typescript
<CardHeader>
  <CardTitle>Settings</CardTitle>
  <CardDescription>Manage your account preferences</CardDescription>
</CardHeader>
```

### CardTitle

Main heading, usually inside CardHeader:

```typescript
<CardTitle>Profile Information</CardTitle>
```

### CardDescription

Subtitle or helper text:

```typescript
<CardDescription>Update your profile details and preferences</CardDescription>
```

### CardContent

Main content area (middle section):

```typescript
<CardContent>
  <p>Your content here</p>
</CardContent>
```

### CardFooter

Bottom section for actions or info:

```typescript
<CardFooter className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</CardFooter>
```

## Common Patterns

### Card with Form

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/modules/cores/shadcn/components/ui/card'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function ProfileCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  )
}
```

**Pattern breakdown**:
- `max-w-md` for constrained width
- `CardHeader` with title and description
- `CardContent` with `space-y-4` for vertical spacing
- Each form field in `space-y-2` wrapper
- `CardFooter` with two buttons

### Card Grid Layout

Multiple cards in responsive grid:

```typescript
export function CardGrid() {
  const items = [
    { id: 1, title: 'Item 1', description: 'Description 1' },
    { id: 2, title: 'Item 2', description: 'Description 2' },
    { id: 3, title: 'Item 3', description: 'Description 3' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

**Grid pattern**:
- `grid-cols-1` on mobile (1 column)
- `md:grid-cols-2` on tablets (2 columns)
- `lg:grid-cols-3` on desktop (3 columns)
- `gap-4` for spacing between cards

### Card with Header Action

Add button or icon to header:

```typescript
import { MoreVertical } from '@/modules/cores/shadcn/components/icons'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function CardWithAction() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>From the last 30 days</CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">$45,231.89</p>
      </CardContent>
    </Card>
  )
}
```

**Header action pattern**:
- Use `flex flex-row items-center justify-between`
- Left side: title and description
- Right side: action button

### Card List Item

Card for individual list items:

```typescript
export function CardListItem() {
  const items = [
    { id: 1, name: 'Alice', role: 'Developer' },
    { id: 2, name: 'Bob', role: 'Designer' },
  ]

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
              <Button variant="ghost">Edit</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### Dashboard Widget Card

Card for metrics or statistics:

```typescript
import { TrendingUp } from '@/modules/cores/shadcn/components/icons'

export function DashboardCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardDescription>Monthly Revenue</CardDescription>
          <CardTitle className="text-4xl">$12,500</CardTitle>
        </div>
        <TrendingUp className="w-8 h-8 text-green-500" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500">+12% from last month</p>
      </CardContent>
    </Card>
  )
}
```

### Card with Image

Card with image header:

```typescript
import Image from 'next/image'

export function CardWithImage() {
  return (
    <Card className="overflow-hidden">
      <div className="relative w-full h-48">
        <Image
          src="/hero.jpg"
          alt="Card image"
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>Featured Article</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the article summary and description.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Read more</Button>
      </CardFooter>
    </Card>
  )
}
```

**Image pattern**:
- Use `overflow-hidden` on Card to clip image
- Image with `relative`, `w-full`, `h-48`
- Use Next.js Image component for optimization
- `fill` and `object-cover` for proper sizing

### Nested Cards (Section Groups)

Group related cards:

```typescript
export function NestedCardGroup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Security</h3>
            <p className="text-sm text-gray-600">
              Manage your password and login methods
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Privacy</h3>
            <p className="text-sm text-gray-600">
              Control your data and visibility
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
```

### Card with Divider

Separate sections inside card:

```typescript
export function CardWithDivider() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order #1234</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold">Items</p>
          <p className="text-sm text-gray-600">2 × Product Name</p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-semibold">Total</p>
          <p className="text-xl font-bold">$99.99</p>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Styling & Customization

### Card Size

```typescript
// Small card
<Card className="w-64">...</Card>

// Medium card (default)
<Card className="w-96">...</Card>

// Large card
<Card className="max-w-2xl">...</Card>

// Full width
<Card className="w-full">...</Card>
```

### Card Background Color

```typescript
// Default (white)
<Card>...</Card>

// Light gray
<Card className="bg-gray-50">...</Card>

// Custom color
<Card className="bg-blue-50">...</Card>
```

### Card Spacing

```typescript
// Compact (default)
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Generous spacing
<Card className="p-8">
  <CardHeader className="pb-8">
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Card Border & Shadow

```typescript
// Default (light border, subtle shadow)
<Card>...</Card>

// No shadow
<Card className="shadow-none border">...</Card>

// Heavy shadow
<Card className="shadow-lg">...</Card>

// Hover effect
<Card className="cursor-pointer hover:shadow-lg transition-shadow">...</Card>
```

## Props & Structure

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

All components accept standard HTML attributes:
- `className`
- `id`
- `style`
- `onClick`
- `data-*` attributes

## Accessibility

### Semantic Structure

```typescript
<Card>
  <CardHeader>
    <CardTitle>
      Heading for screen readers
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p>Semantic paragraph content</p>
  </CardContent>
</Card>
```

### ARIA Labels

For icon-only cards:

```typescript
<Card aria-label="User profile card">
  {/* content */}
</Card>
```

### Focus Management

Cards are semantic containers; interactive elements inside handle focus:

```typescript
<Card>
  <CardContent>
    <Button>Focusable button</Button>
    <Input />
  </CardContent>
</Card>
```

## Type Safety

```typescript
import type { HTMLAttributes } from 'react'
import { Card, CardContent } from '@/modules/cores/shadcn/components/ui/card'

interface CustomCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export function CustomCard({
  title,
  description,
  children,
  ...props
}: CustomCardProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
```

## Related Components

- [Button](button.md) - Actions within cards
- [Input](input.md) - Form inputs in cards
- [Dialog](https://ui.shadcn.com/docs/components/dialog) - Modal cards
- [Tabs](https://ui.shadcn.com/docs/components/tabs) - Tabbed card content
- [Accordion](https://ui.shadcn.com/docs/components/accordion) - Collapsible card sections
