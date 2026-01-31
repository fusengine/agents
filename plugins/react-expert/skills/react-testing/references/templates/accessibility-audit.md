---
name: accessibility-audit
description: Complete accessibility test suite with axe-core
keywords: a11y, accessibility, axe, wcag, keyboard, aria
---

# Accessibility Audit Template

## axe-core Setup

```typescript
// vitest.setup.ts
import 'vitest-axe/extend-expect'
```

---

## Component A11y Audit

```typescript
// src/components/__tests__/Button.a11y.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { Button } from '../Button'

expect.extend(toHaveNoViolations)

describe('Button accessibility', () => {
  it('has no violations', async () => {
    const { container } = render(<Button>Click me</Button>)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('has no violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled</Button>)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('has no violations with icon', async () => {
    const { container } = render(
      <Button aria-label="Settings">
        <SettingsIcon />
      </Button>
    )

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
```

---

## Form A11y Audit

```typescript
describe('LoginForm accessibility', () => {
  it('has no violations', async () => {
    const { container } = render(<LoginForm />)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('has no violations with errors', async () => {
    const user = userEvent.setup()
    const { container } = render(<LoginForm />)

    // Trigger validation errors
    await user.click(screen.getByRole('button', { name: /submit/i }))

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
```

---

## Keyboard Navigation Tests

```typescript
describe('Modal keyboard navigation', () => {
  it('traps focus inside modal', async () => {
    const user = userEvent.setup()

    render(<Modal isOpen onClose={vi.fn()} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    // Tab through all focusable elements
    await user.tab()
    expect(closeButton).toHaveFocus()

    await user.tab()
    expect(confirmButton).toHaveFocus()

    await user.tab()
    expect(cancelButton).toHaveFocus()

    // Tab wraps back to first element
    await user.tab()
    expect(closeButton).toHaveFocus()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<Modal isOpen onClose={onClose} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })

  it('returns focus to trigger on close', async () => {
    const user = userEvent.setup()

    render(<ModalWithTrigger />)

    const trigger = screen.getByRole('button', { name: /open modal/i })

    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(trigger).toHaveFocus()
  })
})
```

---

## ARIA Live Region Tests

```typescript
describe('Notification accessibility', () => {
  it('announces new notifications', async () => {
    const user = userEvent.setup()

    render(<NotificationArea />)

    await user.click(screen.getByRole('button', { name: /notify/i }))

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Notification sent')
  })

  it('error has alert role', () => {
    render(<ErrorMessage message="Something went wrong" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })
})
```

---

## Color Contrast Test

```typescript
describe('Theme accessibility', () => {
  it('light theme has sufficient contrast', async () => {
    const { container } = render(
      <ThemeProvider theme="light">
        <Card title="Test" description="Description" />
      </ThemeProvider>
    )

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('dark theme has sufficient contrast', async () => {
    const { container } = render(
      <ThemeProvider theme="dark">
        <Card title="Test" description="Description" />
      </ThemeProvider>
    )

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
```
