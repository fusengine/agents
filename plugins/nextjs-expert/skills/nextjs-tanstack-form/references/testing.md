---
name: testing
description: Testing TanStack Form components with React Testing Library
when-to-use: Writing unit and integration tests for forms
keywords: testing-library, vitest, userEvent, server-action, mock
priority: low
requires: basic-usage.md
related: server-actions.md
---

# Testing TanStack Form

## Form Submission Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from '@tanstack/react-form'

test('submits form with valid data', async () => {
  const onSubmit = vi.fn()

  function TestForm() {
    const form = useForm({
      defaultValues: { email: '' },
      onSubmit: ({ value }) => onSubmit(value),
    })

    return (
      <form onSubmit={form.handleSubmit}>
        <input {...form.getInputProps('email')} />
        <button type="submit">Submit</button>
      </form>
    )
  }

  render(<TestForm />)
  await userEvent.type(screen.getByRole('textbox'), 'test@example.com')
  await userEvent.click(screen.getByText('Submit'))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
  })
})
```

## Validation Error Testing

```typescript
test('displays validation errors', async () => {
  function TestForm() {
    const form = useForm({
      defaultValues: { email: '' },
      validators: {
        onChange: ({ value }) => {
          if (!value.email?.includes('@')) return 'Invalid email'
        },
      },
    })

    return (
      <form>
        <input {...form.getInputProps('email')} />
        <form.Subscribe>{(state) => (
          state.fieldMeta.email?.errors?.[0] &&
          <p role="alert">{state.fieldMeta.email.errors[0]}</p>
        )}</form.Subscribe>
        <button onClick={() => form.handleSubmit()}>Submit</button>
      </form>
    )
  }

  render(<TestForm />)
  await userEvent.type(screen.getByRole('textbox'), 'invalid')
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid email')
})
```

## Mocking Server Actions

```typescript
import { createMocks } from '@/test-utils' // custom helper

vi.mock('@/app/actions', () => ({
  submitForm: vi.fn(async (data) => ({ success: true })),
}))

test('handles server action submission', async () => {
  const { submitForm } = await import('@/app/actions')

  function TestForm() {
    const form = useForm({
      defaultValues: { name: '' },
      onSubmit: async ({ value }) => {
        return submitForm(value)
      },
    })
    // Form JSX...
  }

  render(<TestForm />)
  await userEvent.type(screen.getByRole('textbox'), 'John')
  await userEvent.click(screen.getByText('Submit'))

  await waitFor(() => {
    expect(submitForm).toHaveBeenCalledWith({ name: 'John' })
  })
})
```

## Async Validation Testing

```typescript
test('validates async field', async () => {
  const checkEmail = vi.fn(async (email) =>
    email === 'taken@example.com' ? 'Email taken' : null
  )

  function TestForm() {
    const form = useForm({
      defaultValues: { email: '' },
      validators: {
        onChangeAsync: async ({ value }) => {
          return checkEmail(value.email)
        },
      },
    })
    // Form JSX...
  }

  render(<TestForm />)
  await userEvent.type(screen.getByRole('textbox'), 'taken@example.com')

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Email taken')
  })
})
```

## Best Practices

- **Setup helper**: Create `test-utils.tsx` with form factory functions
- **Mock API calls**: Use `vi.mock()` for server actions and API routes
- **Test user flows**: Focus on form submission workflows, not implementation details
- **Async validation**: Always use `waitFor()` for async validators
- **Error messages**: Assert via role queries (`role="alert"`)
