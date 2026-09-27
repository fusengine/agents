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

Rules (https://ui.shadcn.com/docs/forms/tanstack-form, https://ui.shadcn.com/docs/components/base/field):

- `data-invalid` on `Field` styles the whole block; `aria-invalid` goes on the control
  (`Input`, `Textarea`, `SelectTrigger`, `Checkbox`, `RadioGroupItem`, `Switch`).
- `FieldError` accepts `errors` (array of `{ message?: string }` — TanStack Form's
  `field.state.meta.errors` with Zod/Valibot/ArkType Standard Schema issues works as-is) or
  plain children (`<FieldError>{message}</FieldError>`). Never render `errors[0]` directly —
  entries are issue objects, not strings.
- `data-disabled` on `Field` for disabled styling; `orientation="responsive"` + an
  `@container/field-group` `FieldGroup` for container-query layouts.
- Validation modes: `validators: { onSubmit | onChange | onBlur: formSchema }`.

---

## Control Wiring per Base

`Field` is plain markup (same for every base). The control's change handler depends on the
base installed (check `components.json` `style`).

| Control | Radix (`radix-*`) | Base UI (`base-*`, default) |
|---------|-------------------|-----------------------------|
| Input / Textarea | `onChange={(e) => field.handleChange(e.target.value)}` | same (native elements) |
| Select | `<Select value onValueChange={field.handleChange}>`; `SelectContent position="item-aligned"` | `<Select items={items} value onValueChange={(v) => field.handleChange(v)}>`; `SelectContent alignItemWithTrigger` (default `true`). A `null` item makes the value clearable — narrow before `handleChange` |
| Checkbox | `checked` + `onCheckedChange(checked: boolean \| "indeterminate")` | `checked` + `onCheckedChange(checked: boolean, eventDetails)`; `indeterminate` is a separate prop |
| Switch | `checked` + `onCheckedChange={field.handleChange}` | same prop names |
| RadioGroup | `value` + `onValueChange={field.handleChange}` | same prop names |
| Slider | `value={[n]}` array | `value` number or array |

Wrap Base UI callbacks in an arrow (`(v) => field.handleChange(v)`) so the extra
`eventDetails` argument is not forwarded as TanStack's `handleChange` options.

## Select Field (Base UI)

```typescript
const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
];

<form.Field
  name="language"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="language">Language</FieldLabel>
        <Select
          items={languages}
          name={field.name}
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
        >
          <SelectTrigger id="language" aria-invalid={isInvalid}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```

Radix variant: drop `items`, pass `onValueChange={field.handleChange}` and
`<SelectContent position="item-aligned">`.
