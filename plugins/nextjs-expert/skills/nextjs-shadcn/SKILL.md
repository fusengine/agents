---
name: nextjs-shadcn
description: This skill should be used when the user asks about "shadcn", "UI components", "form fields", "button", "input", "dialog", "card", or "accessible components". Covers shadcn/ui for Next.js App Router with TanStack Form integration.
version: 1.0.0
user-invocable: false
references:
  - path: references/field-patterns.md
    title: Field Component Patterns
  - path: references/form-examples.md
    title: Form Examples
---

# shadcn/ui for Next.js

Beautiful, accessible components with TanStack Form integration.

## Installation

```bash
bunx --bun shadcn@latest init
bunx --bun shadcn@latest add button card field input
```

### Configuration (Tailwind CSS v4)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "gray",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/modules/cores/shadcn/components",
    "utils": "@/modules/cores/lib/utils",
    "ui": "@/modules/cores/shadcn/components/ui"
  }
}
```

---

## Quick Start: Field Component

```typescript
import { Field, FieldLabel, FieldDescription, FieldError } from '@/modules/cores/shadcn/components/ui/field'
import { Input } from '@/modules/cores/shadcn/components/ui/input'

<Field data-invalid={hasError}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" />
  <FieldDescription>Your email address.</FieldDescription>
  {hasError && <FieldError errors={errors} />}
</Field>
```

See [Field Patterns](references/field-patterns.md) for complete patterns.

---

## Component Categories

| Category | Components |
|----------|------------|
| Layout | Card, Separator, Tabs, Accordion |
| Forms | Button, Input, Field, Select, Checkbox, Switch |
| Feedback | Alert, Toast (Sonner), Dialog, Sheet |
| Data | Table, Badge, Avatar, Calendar |
| Navigation | Breadcrumb, DropdownMenu, Command |

---

## Best Practices

1. **Use Field components** - New pattern for form fields
2. **TanStack Form** - Preferred over React Hook Form
3. **Server Components** - Default, no `'use client'`
4. **Sonner for toasts** - Modern toast notifications
5. **MCP tools** - Use `mcp__shadcn__*` to explore components

See [Form Examples](references/form-examples.md) for complete implementations.
