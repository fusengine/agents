# Testing

## Jest Setup
```bash
bun add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

```js
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

module.exports = createJestConfig({
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
})
```

```js
// jest.setup.js
import '@testing-library/jest-dom'
```

## Component Test
```typescript
// modules/ui/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders and handles click', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

## Playwright E2E Setup
```bash
bun create playwright
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## E2E Test
```ts
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test('navigates to dashboard', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Dashboard')
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toContainText('Dashboard')
})
```

## Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test"
  }
}
```
