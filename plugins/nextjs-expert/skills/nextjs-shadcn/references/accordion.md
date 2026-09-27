---
name: accordion
description: Collapsible content panels for displaying expandable sections
when-to-use: FAQ sections, collapsible menus, disclosure patterns, expandable content lists
keywords: collapsible, expandable, disclosure, faq, panels
priority: medium
requires:
related: tabs.md
---

# Accordion Component

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below. Sources: https://ui.shadcn.com/r/styles/base-nova/accordion.json, https://ui.shadcn.com/r/styles/radix-nova/accordion.json

Accessible accordion component for creating collapsible content sections (Base UI `Accordion` by default; Radix or React Aria when `components.json` says so).

## Installation

```bash
bunx --bun shadcn@latest add accordion
```

## Basic Accordion

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/modules/cores/shadcn/components/ui/accordion"

/** Single-open accordion with the first item expanded. */
export function BasicAccordion() {
  return (
    <Accordion defaultValue={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles you can customize.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It is animated by default, but you can disable it.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## Single vs Multiple Mode

### Single Mode (one item open at a time)

Default on Base UI — no `type`/`collapsible` prop; clicking the open trigger closes it.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/modules/cores/shadcn/components/ui/accordion"

/** Default mode: one item open at a time. */
export function SingleModeAccordion() {
  return (
    <Accordion>
      <AccordionItem value="section-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>Content for section 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="section-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content for section 2</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

### Multiple Mode (multiple items open simultaneously)

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/modules/cores/shadcn/components/ui/accordion"

/** `multiple` lets several items stay open. */
export function MultipleModeAccordion() {
  return (
    <Accordion multiple>
      <AccordionItem value="item-1">
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>Content for item 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Item 2</AccordionTrigger>
        <AccordionContent>Content for item 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Item 3</AccordionTrigger>
        <AccordionContent>Content for item 3</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## FAQ Pattern

Common pattern for frequently asked questions:

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/modules/cores/shadcn/components/ui/accordion"

const faqs = [
  {
    id: "faq-1",
    question: "How do I get started?",
    answer:
      "To get started, follow the installation steps in our documentation.",
  },
  {
    id: "faq-2",
    question: "What is your pricing model?",
    answer: "We offer flexible pricing plans based on your usage needs.",
  },
  {
    id: "faq-3",
    question: "Do you provide customer support?",
    answer: "Yes, we offer 24/7 customer support via email and chat.",
  },
]

/** FAQ list rendered from data. */
export function FAQAccordion() {
  return (
    <div className="w-full max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
      <Accordion>
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
```

## Accordion with Icons

Add icons to accordion triggers:

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/modules/cores/shadcn/components/ui/accordion"
import { HelpCircle, Zap, Lock } from "lucide-react"

/** Triggers with leading icons. */
export function AccordionWithIcons() {
  return (
    <Accordion>
      <AccordionItem value="help">
        <AccordionTrigger className="gap-2">
          <HelpCircle className="h-5 w-5" />
          Getting Help
        </AccordionTrigger>
        <AccordionContent>
          Browse our documentation and support resources.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="performance">
        <AccordionTrigger className="gap-2">
          <Zap className="h-5 w-5" />
          Performance
        </AccordionTrigger>
        <AccordionContent>
          Learn optimization techniques for faster load times.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger className="gap-2">
          <Lock className="h-5 w-5" />
          Security
        </AccordionTrigger>
        <AccordionContent>
          Understand our security practices and data protection.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## Controlled Accordion

Manage accordion state programmatically:

```tsx
"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/modules/cores/shadcn/components/ui/accordion"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

/** Controlled `value` array with expand/collapse-all buttons. */
export function ControlledAccordion() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (value: string) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => setOpenItems([])}
          variant="outline"
        >
          Collapse All
        </Button>
        <Button
          size="sm"
          onClick={() => setOpenItems(["item-1", "item-2", "item-3"])}
          variant="outline"
        >
          Expand All
        </Button>
      </div>
      <Accordion
        multiple
        value={openItems}
        onValueChange={setOpenItems}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content for item 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content for item 2</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Item 3</AccordionTrigger>
          <AccordionContent>Content for item 3</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
```

## Accordion with Rich Content

Accordion items can contain any content:

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/modules/cores/shadcn/components/ui/accordion"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

/** Panels holding code, lists and actions. */
export function AccordionWithRichContent() {
  return (
    <Accordion>
      <AccordionItem value="code-example">
        <AccordionTrigger>Code Example</AccordionTrigger>
        <AccordionContent>
          <pre className="rounded bg-slate-100 p-4">
            {`const greeting = "Hello World"
console.log(greeting)`}
          </pre>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="features">
        <AccordionTrigger>Features</AccordionTrigger>
        <AccordionContent>
          <ul className="list-inside space-y-2">
            <li>✓ Fully accessible</li>
            <li>✓ Keyboard navigation</li>
            <li>✓ Animated transitions</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="action">
        <AccordionTrigger>Take Action</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <p>Ready to get started?</p>
          <Button>Learn More</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## Styled Accordion

Customize accordion appearance:

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/modules/cores/shadcn/components/ui/accordion"

/** Custom item, trigger and panel classes. */
export function StyledAccordion() {
  return (
    <Accordion className="w-full">
      <AccordionItem
        value="item-1"
        className="border-l-4 border-l-blue-500"
      >
        <AccordionTrigger className="hover:text-blue-600">
          Item 1
        </AccordionTrigger>
        <AccordionContent className="bg-blue-50">
          Content for item 1
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="item-2"
        className="border-l-4 border-l-green-500"
      >
        <AccordionTrigger className="hover:text-green-600">
          Item 2
        </AccordionTrigger>
        <AccordionContent className="bg-green-50">
          Content for item 2
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## API Reference

- `Accordion` - Root component (Base UI `Accordion.Root`)
  - `multiple` - Allow several open items (default `false`)
  - `defaultValue` / `value` - Open items, always an array (`string[]`)
  - `onValueChange` - `(value, eventDetails) => void`
- `AccordionItem` - Individual accordion section
  - `value` - Unique identifier; `disabled` - Disable the item
- `AccordionTrigger` - Clickable header
- `AccordionContent` - Expandable panel (Base UI `Accordion.Panel`; `className` goes to the inner div)

## Radix variant

Same part names; only the root props change (`components.json` `style` `radix-*`):

```tsx
<>
  {/* Single, closable — Radix needs type + collapsible, string value */}
  <Accordion type="single" collapsible defaultValue="item-1">…</Accordion>
  {/* Multiple — array value */}
  <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>…</Accordion>
</>
```

React Aria (`aria-*`): `AccordionItem id=` instead of `value`, `defaultExpandedKeys` / `allowsMultipleExpanded` — see `shadcn docs accordion --base aria`.

## Keyboard Navigation

- **Enter/Space** - Toggle open/closed
- **ArrowDown** - Move focus to next trigger
- **ArrowUp** - Move focus to previous trigger
- **Home** - Move focus to first trigger
- **End** - Move focus to last trigger
