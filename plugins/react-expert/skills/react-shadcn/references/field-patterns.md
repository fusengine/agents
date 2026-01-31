---
name: field-patterns
description: shadcn/ui field component patterns and usage with TanStack Form integration
when-to-use: form fields, input validation, field errors, field layouts, shadcn components, form structure
keywords: field components, shadcn/ui, form fields, field groups, fieldset, TanStack Form, field layout
priority: high
requires: form-examples.md
related: form-examples.md
---

# Field Component Patterns

Field component patterns for shadcn/ui with TanStack Form integration.

## Imports

```typescript
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/modules/cores/shadcn/components/ui/field'
```

---

## Basic Field

```typescript
<Field data-invalid={hasError}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" />
  <FieldDescription>Your email address.</FieldDescription>
  {hasError && <FieldError errors={errors} />}
</Field>
```

---

## Horizontal Field (Switches, Checkboxes)

```typescript
<Field orientation="horizontal">
  <FieldContent>
    <FieldTitle>Notifications</FieldTitle>
    <FieldDescription>Receive email notifications.</FieldDescription>
  </FieldContent>
  <Switch />
</Field>
```

---

## FieldGroup (Multiple Fields)

```typescript
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
    <Input id="firstName" />
  </Field>
  <Field>
    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
    <Input id="lastName" />
  </Field>
</FieldGroup>
```

---

## FieldSet with Legend

```typescript
<FieldSet>
  <FieldLegend>Personal Information</FieldLegend>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input id="name" />
    </Field>
  </FieldGroup>
</FieldSet>
```

---

## With TanStack Form

```typescript
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
          aria-invalid={isInvalid}
        />
        <FieldDescription>3-10 characters.</FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```
