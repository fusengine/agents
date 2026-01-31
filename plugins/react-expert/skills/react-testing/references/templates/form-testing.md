---
name: form-testing
description: Form tests with validation, submission, React 19 useActionState
keywords: form, validation, submit, useActionState, userEvent
---

# Form Testing Template

## Basic Form Test

```typescript
// src/components/__tests__/LoginForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from '../LoginForm'

describe('LoginForm', () => {
  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()

    render(<LoginForm onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText(/email/i), 'invalid')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })

  it('shows required error for empty fields', async () => {
    const user = userEvent.setup()

    render(<LoginForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })
})
```

---

## React 19 useActionState Form

```typescript
// src/components/__tests__/ActionForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ActionForm } from '../ActionForm'

describe('ActionForm with useActionState', () => {
  it('shows pending state during submission', async () => {
    const user = userEvent.setup()

    render(<ActionForm />)

    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    // Button disabled during pending
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveTextContent(/submitting/i)

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeEnabled()
    })
  })

  it('shows success message after submission', async () => {
    const user = userEvent.setup()

    render(<ActionForm />)

    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByText(/success/i)
  })

  it('shows error from server action', async () => {
    const user = userEvent.setup()

    render(<ActionForm />)

    // Trigger validation error
    await user.type(screen.getByLabelText(/name/i), 'x') // too short
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByText(/name must be at least/i)
  })
})
```

---

## Form with File Upload

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('uploads file', async () => {
  const user = userEvent.setup()
  const onUpload = vi.fn()

  render(<UploadForm onUpload={onUpload} />)

  const file = new File(['content'], 'test.png', { type: 'image/png' })
  const input = screen.getByLabelText(/upload/i)

  await user.upload(input, file)

  expect(input.files[0]).toBe(file)
  expect(screen.getByText('test.png')).toBeInTheDocument()
})
```

---

## Form with Select

```typescript
it('selects option', async () => {
  const user = userEvent.setup()

  render(<CountryForm />)

  await user.selectOptions(
    screen.getByRole('combobox', { name: /country/i }),
    screen.getByRole('option', { name: 'France' })
  )

  expect(screen.getByRole('combobox')).toHaveValue('FR')
})
```
