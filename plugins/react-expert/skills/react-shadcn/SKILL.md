---
name: react-shadcn
description: shadcn/ui components - Button, Card, Dialog, Form, Input, Table. Use when building UI with shadcn/ui in React apps.
user-invocable: false
---

# shadcn/ui

Beautiful, accessible components built with Radix UI and Tailwind CSS.

## Installation

```bash
bunx --bun shadcn@latest init
```

### Configuration (Tailwind CSS v4)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "gray",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/modules/cores/shadcn/components",
    "utils": "@/modules/cores/lib/utils",
    "ui": "@/modules/cores/shadcn/components/ui",
    "lib": "@/modules/cores/lib",
    "hooks": "@/modules/cores/hooks"
  }
}
```

**Note:** For Tailwind CSS v4, the `config` field must be empty.

---

## Adding Components

```bash
# Add individual components
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add card
bunx --bun shadcn@latest add dialog
bunx --bun shadcn@latest add form
bunx --bun shadcn@latest add input
bunx --bun shadcn@latest add table

# Add multiple
bunx --bun shadcn@latest add button card dialog
```

---

## Component Examples

### Button

```typescript
import { Button } from '@/components/ui/button'

function Example() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
```

### Card

```typescript
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{user.bio}</p>
      </CardContent>
      <CardFooter>
        <Button>View Profile</Button>
      </CardFooter>
    </Card>
  )
}
```

### Dialog

```typescript
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Form (with TanStack Form + Field Components)

```typescript
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/modules/cores/shadcn/components/ui/field'
import { Input } from '@/modules/cores/shadcn/components/ui/input'

const formSchema = z.object({
  username: z.string().min(2, 'Min 2 characters').max(50),
})

function ProfileForm() {
  const form = useForm({
    defaultValues: { username: '' },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field
          name="username"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="johndoe"
                />
                <FieldDescription>Your public display name.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Table

```typescript
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function UserTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableCaption>A list of users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">Edit</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

## Available Components

### Layout
- Accordion, Card, Collapsible, Resizable, ScrollArea, Separator, Tabs

### Forms
- Button, Checkbox, Form, Input, Label, RadioGroup, Select, Slider, Switch, Textarea

### Feedback
- Alert, AlertDialog, Dialog, Drawer, Popover, Sheet, Toast, Tooltip

### Data Display
- Avatar, Badge, Calendar, DataTable, HoverCard, Table

### Navigation
- Breadcrumb, Command, ContextMenu, DropdownMenu, Menubar, NavigationMenu, Pagination

---

## Best Practices

1. **Use composition** - Combine components for complex UI
2. **Follow accessibility** - Components are accessible by default
3. **Customize with Tailwind** - Add classes as needed
4. **Use variants** - Leverage built-in variants before custom styles
5. **Check MCP shadcn tools** - Use `mcp__shadcn__*` for component info
