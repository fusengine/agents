---
name: testing
description: Render avec provider, mock server functions, navigation, Vitest setup
when-to-use: unit tests, composants traduites, navigation tests, mock i18n
keywords: renderWithIntl, testing-library, Vitest, mocking, NextIntlClientProvider
priority: medium
requires: client-components.md, server-components.md
related: testing best practices
---

# next-intl Testing

## When to Use

- Unit test components with translations
- Mock server functions in tests
- Test navigation with locale preservation
- Vitest/Jest setup for i18n

## Why Test i18n

| Test | Catches |
|------|---------|
| Render with provider | Missing provider errors |
| Multi-locale | Translation mismatches |
| Navigation mock | Broken locale switching |

## Setup for Tests

```typescript
// test-utils.tsx
import { NextIntlClientProvider } from 'next-intl'
import { render } from '@testing-library/react'

const messages = {
  Common: { submit: 'Submit', cancel: 'Cancel' },
  HomePage: { title: 'Welcome' }
}

export function renderWithIntl(ui: React.ReactElement, locale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>
  )
}
```

## Testing Client Components

```typescript
import { renderWithIntl } from './test-utils'
import { MyComponent } from './MyComponent'

test('renders translated text', () => {
  const { getByText } = renderWithIntl(<MyComponent />)
  expect(getByText('Welcome')).toBeInTheDocument()
})

test('renders in French', () => {
  const { getByText } = renderWithIntl(<MyComponent />, 'fr')
  expect(getByText('Bienvenue')).toBeInTheDocument()
})
```

## Mocking Server Functions

```typescript
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => Promise.resolve((key: string) => key)),
  getLocale: vi.fn(() => Promise.resolve('en')),
  getMessages: vi.fn(() => Promise.resolve(messages))
}))
```

## Mocking Navigation

```typescript
import { useRouter } from '@/modules/cores/i18n/src/config/routing'

vi.mock('@/modules/cores/i18n/src/config/routing', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  usePathname: vi.fn(() => '/about')
}))
```

## Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts']
  }
})
```

## Test Setup File

```typescript
// test-setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl')
  return { ...actual }
})
```
