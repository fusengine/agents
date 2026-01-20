# 07 - Add Test (Next.js)

**Write tests for Next.js features using Vitest and Playwright.**

## When to Use

- After implementation complete
- Before creating PR
- When fixing bugs (TDD approach)

---

## Test Setup

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
```

### Test Setup File

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

---

## Component Testing (Vitest)

### Server Component Test

```typescript
// modules/users/components/UserList.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserList } from './UserList'

describe('UserList', () => {
  it('should render list of users', () => {
    const users = [
      { id: '1', name: 'John', email: 'john@example.com' },
      { id: '2', name: 'Jane', email: 'jane@example.com' },
    ]

    render(<UserList users={users} />)

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })

  it('should show empty message when no users', () => {
    render(<UserList users={[]} />)

    expect(screen.getByText('No users found.')).toBeInTheDocument()
  })
})
```

### Client Component Test

```typescript
// modules/auth/components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

// Mock Server Action
vi.mock('../src/actions/auth.actions', () => ({
  loginAction: vi.fn().mockResolvedValue({ success: true }),
}))

describe('LoginForm', () => {
  it('should render email and password inputs', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should submit form with credentials', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    // Verify form submission
  })
})
```

---

## Service Testing

```typescript
// modules/users/src/services/user.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUsers, createUser } from './user.service'
import { prisma } from '@/modules/cores/database/prisma'

// Mock Prisma
vi.mock('@/modules/cores/database/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', name: 'John', email: 'john@example.com' },
      ]
      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers)

      const result = await getUsers()

      expect(result).toEqual(mockUsers)
      expect(prisma.user.findMany).toHaveBeenCalledOnce()
    })
  })

  describe('createUser', () => {
    it('should create user with valid input', async () => {
      const input = { name: 'John', email: 'john@example.com', password: 'pass' }
      const mockUser = { id: '1', ...input }
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

      const result = await createUser(input)

      expect(result).toEqual(mockUser)
    })
  })
})
```

---

## E2E Testing (Playwright)

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Example

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrong')
    await page.click('button[type="submit"]')

    await expect(page.locator('[role="alert"]')).toBeVisible()
  })
})
```

---

## Test Commands

```bash
# Run unit tests
pnpm test

# Run with watch mode
pnpm test --watch

# Run with coverage
pnpm test --coverage

# Run E2E tests
pnpm test:e2e

# Run specific E2E test
pnpm test:e2e auth.spec.ts
```

---

## Test Checklist

```text
Unit Tests:
[ ] Component tests for new components
[ ] Service tests for business logic
[ ] Happy path covered
[ ] Error cases covered
[ ] Edge cases covered

E2E Tests:
[ ] Critical user flows tested
[ ] Form submissions verified
[ ] Navigation works correctly
[ ] Error states handled

Coverage:
[ ] Statements > 80%
[ ] Branches > 75%
[ ] Functions > 80%
```

---

## Next Phase

Proceed to `08-check-test.md`
