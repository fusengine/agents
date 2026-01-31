---
name: avatar
description: Display user profile images with fallback text for unavailable images
when-to-use: User profiles, team members, commenter avatars, user lists
keywords: profile, user-image, profile-picture, picture, image
priority: medium
requires:
related:
---

# Avatar Component

Accessible avatar component that displays user images with fallback initials or placeholder text when images are unavailable.

## Installation

```bash
bunx --bun shadcn-ui@latest add avatar
```

## Basic Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"

export function BasicAvatar() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
```

## Avatar with Initials

Display user initials as fallback:

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"

interface UserAvatarProps {
  src?: string
  name: string
}

export function UserAvatar({ src, name }: UserAvatarProps) {
  // Extract initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar>
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
```

## Avatar Sizes

Create reusable avatar component with size variants:

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"

type AvatarSize = "sm" | "md" | "lg" | "xl"

interface SizedAvatarProps {
  src?: string
  name: string
  size?: AvatarSize
}

export function SizedAvatar({
  src,
  name,
  size = "md",
}: SizedAvatarProps) {
  const sizeClasses: Record<AvatarSize, string> = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Avatar className={sizeClasses[size]}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
```

## Avatar in List

Display avatars in a user list:

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"

interface User {
  id: string
  name: string
  image?: string
  role: string
}

interface UserListProps {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-3">
          <Avatar>
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Avatar Group

Display multiple avatars stacked or side by side:

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"

interface AvatarGroupProps {
  users: Array<{ id: string; name: string; image?: string }>
  max?: number
}

export function AvatarGroup({ users, max = 3 }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max)
  const remainingCount = users.length - max

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user) => (
        <div
          key={user.id}
          className="ring-2 ring-white"
        >
          <Avatar className="h-8 w-8">
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 ring-2 ring-white text-xs font-semibold">
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
```

## Avatar with Status

Show online/offline status with avatar:

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"

type UserStatus = "online" | "offline" | "away"

interface UserWithStatusProps {
  src?: string
  name: string
  status: UserStatus
}

export function AvatarWithStatus({
  src,
  name,
  status,
}: UserWithStatusProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const statusColors: Record<UserStatus, string> = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
  }

  return (
    <div className="relative inline-block">
      <Avatar>
        {src && <AvatarImage src={src} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div
        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${statusColors[status]}`}
      />
    </div>
  )
}
```

## Avatar in Comment

Display avatar with comment text:

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"

interface Comment {
  id: string
  author: string
  avatar?: string
  text: string
  timestamp: Date
}

interface CommentProps {
  comment: Comment
}

export function CommentComponent({ comment }: CommentProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTime = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / 1000 / 60),
      "minute",
    )
  }

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        {comment.avatar && <AvatarImage src={comment.avatar} />}
        <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{comment.author}</p>
          <p className="text-xs text-gray-500">
            {formatTime(comment.timestamp)}
          </p>
        </div>
        <p className="mt-1 text-sm">{comment.text}</p>
      </div>
    </div>
  )
}
```

## Avatar with Badge

Add a badge overlay to avatar:

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"
import { Badge } from "@/modules/cores/shadcn/components/ui/badge"

interface AvatarWithBadgeProps {
  src?: string
  name: string
  badgeLabel: string
}

export function AvatarWithBadge({
  src,
  name,
  badgeLabel,
}: AvatarWithBadgeProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="relative inline-block">
      <Avatar className="h-12 w-12">
        {src && <AvatarImage src={src} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <Badge className="absolute -bottom-2 -right-2 text-xs">
        {badgeLabel}
      </Badge>
    </div>
  )
}
```

## Avatar in Team Card

Display avatar in team/organization cards:

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/modules/cores/shadcn/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/cores/shadcn/components/ui/card"

interface TeamMember {
  id: string
  name: string
  role: string
  image?: string
}

interface TeamCardProps {
  members: TeamMember[]
}

export function TeamCard({ members }: TeamCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar>
              {member.image && <AvatarImage src={member.image} />}
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{member.name}</p>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

## API Reference

- `Avatar` - Root container
  - `className` - Custom size classes (default `h-10 w-10`)
- `AvatarImage` - Image element
  - `src` - Image URL
- `AvatarFallback` - Fallback content when image fails to load
  - Text/initials content

## Styling

- Default size: `h-10 w-10` (40px)
- Small: `h-8 w-8` (32px)
- Large: `h-12 w-12` (48px)
- Extra large: `h-16 w-16` (64px)

## Common Patterns

1. **Initials Fallback** - Extract first letter of first and last name
2. **Status Indicator** - Add colored dot for online/offline status
3. **Avatar Stack** - Group multiple avatars with negative margin
4. **Avatar with Badge** - Overlay badge for notifications or roles
5. **Interactive Avatar** - Make clickable for profile navigation
