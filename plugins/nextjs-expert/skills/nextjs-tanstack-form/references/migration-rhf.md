---
name: migration-rhf
description: Migration guide from React Hook Form to TanStack Form
when-to-use: Migrating existing RHF forms to TanStack Form
keywords: react-hook-form, migration, useForm, register, Controller
priority: low
requires: basic-usage.md
related: validation-zod.md
---

# Migration from React Hook Form to TanStack Form

## API Differences

### Register vs Field Component
```typescript
// RHF: register function
const { register } = useForm()
<input {...register('email')} />

// TanStack: Field component approach
<form.Field name="email">
  {(field) => <input {...field.getInputProps()} />}
</form.Field>
```

### Form State Access
```typescript
// RHF: watch, formState
const { watch, formState } = useForm()
const email = watch('email')
const { errors, isDirty } = formState

// TanStack: Direct form.state
const form = useForm()
const email = form.getFieldValue('email')
const errors = form.state.fieldMeta
```

## Validation Comparison

### RHF with Zod
```typescript
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange'
})
```

### TanStack with Zod
```typescript
const form = useForm({
  defaultValues: { email: '' },
  validators: {
    onBlur: schema
  }
})
```

## Migration Checklist

- [ ] Install `@tanstack/react-form`
- [ ] Remove `react-hook-form` and resolver
- [ ] Replace `useForm()` with TanStack version
- [ ] Convert `register()` calls to `<Field>` components
- [ ] Update validation logic (validators prop)
- [ ] Replace `watch()` with `form.getFieldValue()`
- [ ] Update error handling (new error structure)
- [ ] Test form submission flow
- [ ] Update type definitions

## When to Migrate

**Migrate if:**
- New project starting
- Complex nested forms needed
- Better TypeScript support required
- Minimal re-renders important

**Keep RHF if:**
- Legacy project with extensive RHF usage
- Team expertise with RHF
- Dynamic field counts with performance optimization
