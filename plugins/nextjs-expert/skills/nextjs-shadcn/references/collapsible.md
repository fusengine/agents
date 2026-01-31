---
name: collapsible
description: Animated expand/collapse container with toggle
when-to-use: FAQs, accordion items, toggleable sections, feature toggles
keywords: accordion, expand, collapse, toggle, disclosure
priority: medium
requires: button.md
related: accordion.md
---

## Installation

```bash
bunx --bun shadcn@latest add collapsible
```

## Basic Usage

```tsx
'use client'

import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'

export default function CollapsibleBasic() {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost">
          Toggle Content
          <ChevronsUpDown className="h-4 w-4 ml-2" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        This content can be expanded and collapsed
      </CollapsibleContent>
    </Collapsible>
  )
}
```

## Components

### Collapsible
Root component with open state management.
- `open`: Controlled open state (optional)
- `onOpenChange`: Callback when toggling

### CollapsibleTrigger
Button or element that toggles the content.
- `asChild`: Render as child component

### CollapsibleContent
Content that shows/hides with animation.

## Controlled State

```tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'

export default function CollapsibleControlled() {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          Advanced Options
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2">
        <div className="text-sm text-muted-foreground">
          Option 1: Configuration setting
        </div>
        <div className="text-sm text-muted-foreground">
          Option 2: Another setting
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

## FAQ Pattern

```tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Is it accessible?',
    answer:
      'Yes. It adheres to the WAI-ARIA design pattern and is fully keyboard accessible.',
  },
  {
    question: 'Is it styled?',
    answer:
      'Yes. It comes with default styling that you can customize to match your design system.',
  },
  {
    question: 'Can it be animated?',
    answer:
      'Yes. You can use CSS animations or Framer Motion for more control.',
  },
  {
    question: 'Is it open source?',
    answer:
      'Yes. The component is open source and available on GitHub.',
  },
]

export default function FAQCollapsible() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  return (
    <div className="w-full max-w-2xl space-y-2">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <Collapsible
          key={index}
          open={openItems.includes(index)}
          onOpenChange={() => toggleItem(index)}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
            <span className="font-semibold text-left">{faq.question}</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                openItems.includes(index) ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-2 pb-4 text-muted-foreground">
            {faq.answer}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
```

## Settings Group Collapsible

```tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Label } from '@/modules/cores/shadcn/components/ui/label'
import { Switch } from '@/modules/cores/shadcn/components/ui/switch'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'

interface SettingGroup {
  title: string
  icon: React.ReactNode
  settings: Array<{
    label: string
    key: string
    enabled: boolean
  }>
}

export default function SettingsGroups() {
  const [groups, setGroups] = useState<SettingGroup[]>([
    {
      title: 'Privacy Settings',
      icon: '🔒',
      settings: [
        { label: 'Public Profile', key: 'public', enabled: true },
        { label: 'Show Activity', key: 'activity', enabled: false },
      ],
    },
    {
      title: 'Notification Settings',
      icon: '🔔',
      settings: [
        { label: 'Email Notifications', key: 'email', enabled: true },
        { label: 'Push Notifications', key: 'push', enabled: true },
      ],
    },
  ])

  const toggleSetting = (groupIndex: number, settingKey: string) => {
    setGroups(prev =>
      prev.map((group, idx) =>
        idx === groupIndex
          ? {
              ...group,
              settings: group.settings.map(setting =>
                setting.key === settingKey
                  ? { ...setting, enabled: !setting.enabled }
                  : setting
              ),
            }
          : group
      )
    )
  }

  return (
    <div className="space-y-4 w-full max-w-lg">
      {groups.map((group, groupIndex) => (
        <Collapsible key={group.title}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
            <div className="flex items-center gap-3">
              <span className="text-xl">{group.icon}</span>
              <span className="font-semibold">{group.title}</span>
            </div>
            <ChevronDown className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 px-4 pt-4 pb-2">
            {group.settings.map(setting => (
              <div
                key={setting.key}
                className="flex items-center justify-between"
              >
                <Label htmlFor={setting.key} className="text-sm">
                  {setting.label}
                </Label>
                <Switch
                  id={setting.key}
                  checked={setting.enabled}
                  onCheckedChange={() =>
                    toggleSetting(groupIndex, setting.key)
                  }
                />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
```

## Nested Collapsible

```tsx
'use client'

import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'

export default function NestedCollapsible() {
  return (
    <div className="w-full max-w-md space-y-2">
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border p-3 hover:bg-muted">
          Parent Section
          <ChevronDown className="ml-auto h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pl-4 pt-2">
          <div>Parent content</div>

          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border p-3 hover:bg-muted">
              Child Section
              <ChevronDown className="ml-auto h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-2">
              Nested child content
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
```

## Code Example Collapsible

```tsx
'use client'

import { Copy, ChevronDown } from 'lucide-react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'

export default function CodeExampleCollapsible() {
  const code = `function hello() {
  console.log('Hello, World!')
}`

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-dashed p-3 hover:bg-muted">
        <span className="font-mono text-sm">Show Code Example</span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2">
        <div className="relative rounded-lg bg-slate-950 p-4">
          <pre className="font-mono text-sm text-slate-100 overflow-x-auto">
            <code>{code}</code>
          </pre>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

## Animation Customization

```tsx
'use client'

import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'

export default function AnimatedCollapsible() {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
        <span>Animated Content</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
        <div className="pt-4 pb-2 text-sm text-muted-foreground">
          This content animates smoothly when toggled
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

## Best Practices

1. **Visual feedback**: Change icon rotation/color on toggle
2. **Single click to toggle**: Use `asChild` for button trigger
3. **Scroll into view**: Keep user context when expanding
4. **Keyboard accessible**: Built-in Space/Enter support
5. **Loading states**: Show spinner for async content
6. **Preserve state**: Store open items in URL/localStorage if needed
