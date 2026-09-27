---
name: hover-card
description: Rich preview displayed on hover with customizable content
when-to-use: User profile previews, link previews, content summaries, account cards
keywords: preview, profile, link-preview, rich-content, hover
priority: medium
requires: button.md
related: tooltip.md, popover.md
---

> **Base:** examples use **Base UI** (shadcn default since 2026-07) — wraps Base UI `PreviewCard`; Radix delta in "Radix variant" below; React Aria: `<HoverCardTrigger delay closeDelay>` wraps the trigger element **and** `<HoverCard>` (the card itself). Sources: https://ui.shadcn.com/r/styles/base-nova/hover-card.json, https://ui.shadcn.com/r/styles/radix-nova/hover-card.json

## Installation

```bash
bunx --bun shadcn@latest add hover-card
```

## Basic Usage

```tsx
'use client'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/modules/cores/shadcn/components/ui/hover-card'

/** Default trigger renders an `<a>`; pass `href` for a real link. */
export default function HoverCardBasic() {
  return (
    <HoverCard>
      <HoverCardTrigger href="/profile">Hover over me</HoverCardTrigger>
      <HoverCardContent>This is preview content shown on hover</HoverCardContent>
    </HoverCard>
  )
}
```

## Components

### HoverCard
Root component (Base UI `PreviewCard.Root`): `open`, `defaultOpen`, `onOpenChange`.

### HoverCardTrigger
Element that shows the card on hover; renders an `<a>` by default.
- `delay`: Delay before opening (Base UI default: 600ms)
- `closeDelay`: Delay before closing (Base UI default: 300ms)
- `render`: Render as another element (e.g. `render={<Link href="/u/jane" />}` with `next/link`)

### HoverCardContent
Rich content container (Portal + Positioner + Popup).
- `side`: "top" | "bottom" | "left" | "right" (default "bottom")
- `align`: "start" | "center" | "end" (default "center")
- `sideOffset` / `alignOffset`: Distance from trigger (default `sideOffset={4}`)

## User Profile Preview Pattern

```tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/modules/cores/shadcn/components/ui/avatar'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/modules/cores/shadcn/components/ui/hover-card'

interface UserProfile {
  name: string
  username: string
  avatar: string
  bio: string
  followers: number
}

/** Profile preview on a link-styled button trigger. */
const UserHoverCard = ({ user }: { user: UserProfile }) => {
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" className="p-0 h-auto font-normal" />}>
        {user.name}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">{user.name}</h4>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
            <p className="text-sm text-muted-foreground pt-2">{user.bio}</p>
            <p className="pt-2 text-xs text-muted-foreground">
              {user.followers.toLocaleString()} followers
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default UserHoverCard
```

## Link Preview Pattern

```tsx
'use client'

import { ExternalLink } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/modules/cores/shadcn/components/ui/hover-card'

interface LinkPreview {
  url: string
  title: string
  description: string
  image?: string
}

/** The trigger is already an `<a>`: pass `href` and classes directly. */
const PreviewLink = ({
  href,
  children,
  preview,
}: {
  href: string
  children: React.ReactNode
  preview?: LinkPreview
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        href={href}
        className="text-blue-500 hover:underline inline-flex items-center gap-1"
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </HoverCardTrigger>
      {preview && (
        <HoverCardContent className="w-80">
          {preview.image && (
            <img
              src={preview.image}
              alt={preview.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
          )}
          <h4 className="font-semibold text-sm">{preview.title}</h4>
          <p className="text-xs text-muted-foreground mt-2">{preview.description}</p>
          <p className="text-xs text-muted-foreground mt-3">{new URL(href).hostname}</p>
        </HoverCardContent>
      )}
    </HoverCard>
  )
}

export default PreviewLink
```

## Author Card Pattern

```tsx
'use client'

import { Mail, Globe } from 'lucide-react'
import { Button, buttonVariants } from '@/modules/cores/shadcn/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/modules/cores/shadcn/components/ui/hover-card'

interface Author {
  name: string
  role: string
  bio: string
  website?: string
  email?: string
}

/** Author preview; links inside use `buttonVariants` (Base UI Button has no `asChild`). */
const AuthorCard = ({ author }: { author: Author }) => {
  const linkClass = buttonVariants({ variant: 'outline', size: 'sm' })

  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" className="p-0 h-auto" />}>
        {author.name}
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">{author.name}</h4>
            <p className="text-xs text-muted-foreground">{author.role}</p>
          </div>
          <p className="text-sm text-muted-foreground">{author.bio}</p>
          <div className="flex gap-2">
            {author.website && (
              <a href={author.website} className={linkClass}>
                <Globe data-icon="inline-start" />
                Website
              </a>
            )}
            {author.email && (
              <a href={`mailto:${author.email}`} className={linkClass}>
                <Mail data-icon="inline-start" />
                Contact
              </a>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default AuthorCard
```

## Content Summary Card

```tsx
'use client'

import { Badge } from '@/modules/cores/shadcn/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/modules/cores/shadcn/components/ui/hover-card'

interface ContentPreview {
  title: string
  summary: string
  date: string
  tags: string[]
  readTime: number
}

/** Article summary on a `<span>` trigger. */
const ContentCard = ({ title, content }: { title: string; content: ContentPreview }) => {
  return (
    <HoverCard>
      <HoverCardTrigger render={<span className="cursor-pointer underline" />}>
        {title}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">{content.title}</h4>
          <p className="text-sm text-muted-foreground">{content.summary}</p>
          <div className="flex flex-wrap gap-1">
            {content.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{content.date}</span>
            <span>{content.readTime} min read</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default ContentCard
```

## Delay Configuration

Delays live on the **trigger** in Base UI:

```tsx
<HoverCard>
  <HoverCardTrigger delay={100} closeDelay={200}>Quick preview</HoverCardTrigger>
  <HoverCardContent>Shows quickly on hover</HoverCardContent>
</HoverCard>
```

## Radix variant

`style` `radix-*`: delays move to the root (`openDelay`/`closeDelay`) and custom triggers use
`asChild`; the default trigger is also an `<a>`:

```tsx
<HoverCard openDelay={100} closeDelay={200}>
  <HoverCardTrigger asChild>
    <Button variant="link">Hover Here</Button>
  </HoverCardTrigger>
  <HoverCardContent>Shows quickly on hover</HoverCardContent>
</HoverCard>
```

## Best Practices

1. **Rich not essential**: Preview should enhance, not replace content
2. **Performance**: Lazy load preview data when possible
3. **Image optimization**: Use responsive images in previews
4. **Links for context**: Always link to full content
5. **Consistent sizing**: Use fixed width (w-72, w-80)
6. **Touch fallback**: Add focus states for keyboard/touch
