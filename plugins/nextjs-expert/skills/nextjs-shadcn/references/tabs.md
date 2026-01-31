---
name: tabs
description: Accessible tab component for organizing content into separate panels
when-to-use: Multiple related content sections, tabbed navigation, settings panels, navigation tabs
keywords: navigation, tabbed-content, tabs-component, panels, sections
priority: medium
requires:
related: card.md
---

# Tabs Component

Accessible tab component for organizing content into separate panels using Radix UI primitives.

## Installation

```bash
bunx --bun shadcn-ui@latest add tabs
```

## Basic Tabs

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/cores/shadcn/components/ui/tabs"

export function BasicTabs() {
  return (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1</TabsContent>
      <TabsContent value="tab2">Content for tab 2</TabsContent>
      <TabsContent value="tab3">Content for tab 3</TabsContent>
    </Tabs>
  )
}
```

## Tabs with Card Content

Wrap tab content in Card components for structured layouts:

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/cores/shadcn/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/cores/shadcn/components/ui/card"

export function TabsWithCards() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form fields */}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Password form */}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
```

## Controlled Tabs

Use state to control active tab programmatically:

```tsx
"use client"

import { useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/cores/shadcn/components/ui/tabs"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

export function ControlledTabs() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleNext = () => {
    const tabs = ["overview", "analytics", "reports"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview content</TabsContent>
        <TabsContent value="analytics">Analytics content</TabsContent>
        <TabsContent value="reports">Reports content</TabsContent>
      </Tabs>
      <Button onClick={handleNext}>Next Tab</Button>
    </div>
  )
}
```

## Tabs with Icons

Add icons to tab triggers for visual enhancement:

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/cores/shadcn/components/ui/tabs"
import { Home, Settings, Bell } from "lucide-react"

export function TabsWithIcons() {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home" className="gap-2">
          <Home className="h-4 w-4" />
          Home
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">Home content</TabsContent>
      <TabsContent value="notifications">Notifications content</TabsContent>
      <TabsContent value="settings">Settings content</TabsContent>
    </Tabs>
  )
}
```

## Vertical Tabs Layout

Create vertical tab navigation:

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/cores/shadcn/components/ui/tabs"

export function VerticalTabs() {
  return (
    <Tabs defaultValue="tab1" className="flex gap-4">
      <TabsList className="flex-col h-auto">
        <TabsTrigger value="tab1" className="justify-start">
          General
        </TabsTrigger>
        <TabsTrigger value="tab2" className="justify-start">
          Security
        </TabsTrigger>
        <TabsTrigger value="tab3" className="justify-start">
          Notifications
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="tab1">General settings content</TabsContent>
        <TabsContent value="tab2">Security settings content</TabsContent>
        <TabsContent value="tab3">Notifications settings content</TabsContent>
      </div>
    </Tabs>
  )
}
```

## Disabled Tabs

Disable specific tabs using the `disabled` prop:

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/cores/shadcn/components/ui/tabs"

export function DisabledTabs() {
  return (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="enabled">Enabled</TabsTrigger>
      </TabsList>
      <TabsContent value="active">This tab is active</TabsContent>
      <TabsContent value="disabled">This tab is disabled</TabsContent>
      <TabsContent value="enabled">This tab is enabled</TabsContent>
    </Tabs>
  )
}
```

## Tabs with Form

Combine tabs with form inputs:

```tsx
"use client"

import { useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/cores/shadcn/components/ui/tabs"
import { Button } from "@/modules/cores/shadcn/components/ui/button"
import { Input } from "@/modules/cores/shadcn/components/ui/input"
import { Label } from "@/modules/cores/shadcn/components/ui/label"

export function TabsWithForm() {
  const [formData, setFormData] = useState({ name: "", email: "" })

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <Button>Save Profile</Button>
      </TabsContent>
      <TabsContent value="billing">Billing content</TabsContent>
    </Tabs>
  )
}
```

## API Reference

- `Tabs` - Root component wrapper
  - `defaultValue` - Initial active tab
  - `value` - Controlled active tab
  - `onValueChange` - Callback when tab changes
- `TabsList` - Container for tab triggers
  - `className` - CSS classes (use `grid grid-cols-2` for layouts)
- `TabsTrigger` - Individual tab button
  - `value` - Unique identifier
  - `disabled` - Disable tab
- `TabsContent` - Content panel for tab
  - `value` - Must match TabsTrigger value

## Styling

- Use `className="gap-2"` on TabsTrigger for icon spacing
- Use `className="space-y-4"` in TabsContent for internal spacing
- Use `className="grid w-full grid-cols-2"` on TabsList for equal columns
- Use `className="flex gap-4"` on Tabs root for vertical layouts
