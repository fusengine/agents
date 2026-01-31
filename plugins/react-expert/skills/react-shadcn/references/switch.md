---
name: switch
description: Toggle control for boolean values with built-in styling
when-to-use: On/off toggles, feature flags, boolean settings, enable/disable options
keywords: toggle-switch, on-off, boolean, switch-control, checkbox-alternative
priority: high
requires: label.md
related: radio-group.md, checkbox.md
---

# Switch Component

## Overview

The Switch component is a controlled toggle control for boolean values. It provides an accessible alternative to checkboxes for on/off states with built-in Radix UI primitives.

## Installation

```bash
bunx --bun shadcn@latest add switch
```

## Basic Usage

```tsx
import { Switch } from "@/modules/cores/shadcn/components/ui/switch"

export function BasicSwitch() {
  return <Switch />
}
```

## With Label

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Switch } from "@/modules/cores/shadcn/components/ui/switch"

export function SwitchWithLabel() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
```

## Controlled Switch

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Switch } from "@/modules/cores/shadcn/components/ui/switch"

export function ControlledSwitch() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="notifications"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <Label htmlFor="notifications">
          Enable Notifications
        </Label>
      </div>

      {enabled && (
        <p className="text-sm text-muted-foreground">
          Notifications are now enabled
        </p>
      )}
    </div>
  )
}
```

## Multiple Settings

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Switch } from "@/modules/cores/shadcn/components/ui/switch"

interface Settings {
  notifications: boolean
  darkMode: boolean
  analytics: boolean
  location: boolean
  autoSave: boolean
}

export function MultipleSettings() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: false,
    analytics: true,
    location: false,
    autoSave: true
  })

  const updateSetting = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">App Settings</h2>
      <p className="text-sm text-muted-foreground">
        Customize your experience and privacy preferences
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor="notifications" className="text-base">
              Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified about important updates
            </p>
          </div>
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={() => updateSetting("notifications")}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor="darkMode" className="text-base">
              Dark Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Switch to dark theme appearance
            </p>
          </div>
          <Switch
            id="darkMode"
            checked={settings.darkMode}
            onCheckedChange={() => updateSetting("darkMode")}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor="analytics" className="text-base">
              Analytics
            </Label>
            <p className="text-sm text-muted-foreground">
              Help us improve by sharing usage data
            </p>
          </div>
          <Switch
            id="analytics"
            checked={settings.analytics}
            onCheckedChange={() => updateSetting("analytics")}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor="location" className="text-base">
              Location Services
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow location access for recommendations
            </p>
          </div>
          <Switch
            id="location"
            checked={settings.location}
            onCheckedChange={() => updateSetting("location")}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor="autoSave" className="text-base">
              Auto Save
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically save your work
            </p>
          </div>
          <Switch
            id="autoSave"
            checked={settings.autoSave}
            onCheckedChange={() => updateSetting("autoSave")}
          />
        </div>
      </div>
    </div>
  )
}
```

## Disabled State

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Switch } from "@/modules/cores/shadcn/components/ui/switch"

export function DisabledSwitch() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="enabled" />
        <Label htmlFor="enabled">Enabled</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled" className="text-muted-foreground">
          Disabled
        </Label>
      </div>
    </div>
  )
}
```

## Form Integration

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Switch } from "@/modules/cores/shadcn/components/ui/switch"

export function SwitchForm() {
  const [formData, setFormData] = useState({
    subscribe: false,
    marketing: false,
    terms: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold">
          Email Preferences
        </legend>

        <div className="flex items-center justify-between">
          <Label htmlFor="subscribe" className="flex-1">
            Subscribe to newsletter
          </Label>
          <Switch
            id="subscribe"
            checked={formData.subscribe}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, subscribe: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="marketing" className="flex-1">
            Marketing communications
          </Label>
          <Switch
            id="marketing"
            checked={formData.marketing}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, marketing: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="terms" className="flex-1">
            I agree to the terms
          </Label>
          <Switch
            id="terms"
            checked={formData.terms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, terms: checked })
            }
            required
          />
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Save Preferences
      </button>
    </form>
  )
}
```

## Conditional Content

```tsx
"use client"

import { useState } from "react"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Switch } from "@/modules/cores/shadcn/components/ui/switch"
import { Input } from "@/modules/cores/shadcn/components/ui/input"

export function ConditionalSwitch() {
  const [advancedMode, setAdvancedMode] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="advanced"
          checked={advancedMode}
          onCheckedChange={setAdvancedMode}
        />
        <Label htmlFor="advanced">Advanced Mode</Label>
      </div>

      {advancedMode && (
        <div className="p-4 border rounded-lg space-y-3 bg-blue-50">
          <h3 className="font-semibold text-sm">Advanced Options</h3>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="api-key" className="text-xs">
                API Key
              </Label>
              <Input
                id="api-key"
                placeholder="Enter your API key"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="timeout" className="text-xs">
                Timeout (seconds)
              </Label>
              <Input
                id="timeout"
                placeholder="30"
                type="number"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | false | Current state (controlled) |
| `defaultChecked` | `boolean` | false | Initial state (uncontrolled) |
| `onCheckedChange` | `function` | - | Callback when state changes |
| `disabled` | `boolean` | false | Disable the switch |
| `name` | `string` | - | HTML form name attribute |
| `value` | `string` | - | HTML form value attribute |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | - | Accessible label for screen readers |
| `aria-describedby` | `string` | - | Reference to description element |

## Import Paths

- **Component**: `@/modules/cores/shadcn/components/ui/switch`
- **Re-export**: Use barrel export at `@/modules/cores/shadcn/components/ui`

## Accessibility

- Full keyboard support (Space/Enter to toggle)
- ARIA attributes for screen readers
- Semantic HTML label association
- Clear focus states

## Related Components

- [Label Component](./label.md) - Form label
- [Radio Group](./radio-group.md) - Single selection from multiple
- [Checkbox](./checkbox.md) - Multiple selection
