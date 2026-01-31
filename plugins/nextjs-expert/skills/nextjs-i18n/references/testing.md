# next-intl Testing

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
// For server components
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => Promise.resolve((key: string) => key)),
  getLocale: vi.fn(() => Promise.resolve('en')),
  getMessages: vi.fn(() => Promise.resolve(messages))
}))
```

## Testing Navigation

```typescript
import { useRouter } from '@/i18n/routing'

vi.mock('@/i18n/routing', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn()
  })),
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
