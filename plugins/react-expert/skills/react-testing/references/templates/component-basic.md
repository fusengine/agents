---
name: component-basic
description: Basic component test with queries and user events
keywords: component, test, render, queries, userEvent
---

# Component Basic Test Template

## Simple Component Test

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
```

---

## Component with Props

```typescript
// src/components/__tests__/UserCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { UserCard } from '../UserCard'

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
}

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard user={mockUser} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('calls onEdit when edit button clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(<UserCard user={mockUser} onEdit={onEdit} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))

    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('shows default avatar when none provided', () => {
    render(<UserCard user={mockUser} />)

    expect(screen.getByRole('img', { name: /avatar/i })).toHaveAttribute(
      'src',
      expect.stringContaining('default')
    )
  })
})
```

---

## Testing Conditional Rendering

```typescript
// src/components/__tests__/Alert.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Alert } from '../Alert'

describe('Alert', () => {
  it('renders success variant', () => {
    render(<Alert variant="success" message="Success!" />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Success!')
    expect(alert).toHaveClass('alert-success')
  })

  it('renders error variant', () => {
    render(<Alert variant="error" message="Error occurred" />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('alert-error')
  })

  it('does not render when no message', () => {
    render(<Alert variant="info" message="" />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
```
