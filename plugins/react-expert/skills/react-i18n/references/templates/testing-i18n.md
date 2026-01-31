# Testing i18n Components

Complete test setup and examples for internationalized React components.

---

## Test Setup

### src/test/i18n-mock.ts

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

/**
 * Mock translation resources for testing.
 */
const resources = {
  en: {
    common: {
      'welcome.title': 'Welcome',
      'welcome.greeting': 'Hello, {{name}}!',
      'items.count_zero': 'No items',
      'items.count_one': '{{count}} item',
      'items.count_other': '{{count}} items',
      'actions.save': 'Save',
      'actions.cancel': 'Cancel',
      'actions.delete': 'Delete',
    },
    auth: {
      'login.title': 'Sign In',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.submit': 'Sign in',
      'errors.invalid': 'Invalid credentials',
    },
  },
  fr: {
    common: {
      'welcome.title': 'Bienvenue',
      'welcome.greeting': 'Bonjour, {{name}} !',
      'items.count_zero': 'Aucun élément',
      'items.count_one': '{{count}} élément',
      'items.count_other': '{{count}} éléments',
      'actions.save': 'Enregistrer',
      'actions.cancel': 'Annuler',
      'actions.delete': 'Supprimer',
    },
    auth: {
      'login.title': 'Connexion',
      'login.email': 'E-mail',
      'login.password': 'Mot de passe',
      'login.submit': 'Se connecter',
      'errors.invalid': 'Identifiants invalides',
    },
  },
}

/**
 * Initialize i18n for tests.
 */
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'auth'],
  defaultNS: 'common',
  resources,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
```

---

## Test Utilities

### src/test/test-utils.tsx

```typescript
import { ReactElement, Suspense } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n-mock'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Set initial language for test */
  locale?: 'en' | 'fr'
}

/**
 * Custom render function with i18n provider.
 */
function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { locale = 'en', ...renderOptions } = options

  // Set language before rendering
  i18n.changeLanguage(locale)

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </I18nextProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { customRender as render }
export { i18n }
```

---

## Basic Component Tests

### Welcome.tsx

```typescript
import { useTranslation } from 'react-i18next'

interface WelcomeProps {
  name?: string
}

export function Welcome({ name = 'Guest' }: WelcomeProps) {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.greeting', { name })}</p>
    </div>
  )
}
```

### Welcome.test.tsx

```typescript
import { render, screen } from '@/test/test-utils'
import { Welcome } from './Welcome'

describe('Welcome', () => {
  it('renders welcome title in English', () => {
    render(<Welcome />)

    expect(screen.getByRole('heading')).toHaveTextContent('Welcome')
  })

  it('renders greeting with name', () => {
    render(<Welcome name="Alice" />)

    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument()
  })

  it('renders in French when locale is fr', () => {
    render(<Welcome name="Alice" />, { locale: 'fr' })

    expect(screen.getByRole('heading')).toHaveTextContent('Bienvenue')
    expect(screen.getByText('Bonjour, Alice !')).toBeInTheDocument()
  })
})
```

---

## Pluralization Tests

### ItemCount.tsx

```typescript
import { useTranslation } from 'react-i18next'

interface ItemCountProps {
  count: number
}

export function ItemCount({ count }: ItemCountProps) {
  const { t } = useTranslation()

  return <span data-testid="item-count">{t('items.count', { count })}</span>
}
```

### ItemCount.test.tsx

```typescript
import { render, screen } from '@/test/test-utils'
import { ItemCount } from './ItemCount'

describe('ItemCount', () => {
  it('renders zero items correctly', () => {
    render(<ItemCount count={0} />)

    expect(screen.getByTestId('item-count')).toHaveTextContent('No items')
  })

  it('renders singular item correctly', () => {
    render(<ItemCount count={1} />)

    expect(screen.getByTestId('item-count')).toHaveTextContent('1 item')
  })

  it('renders plural items correctly', () => {
    render(<ItemCount count={5} />)

    expect(screen.getByTestId('item-count')).toHaveTextContent('5 items')
  })

  it('renders French pluralization', () => {
    render(<ItemCount count={5} />, { locale: 'fr' })

    expect(screen.getByTestId('item-count')).toHaveTextContent('5 éléments')
  })
})
```

---

## Language Switcher Tests

### LanguageSwitcher.tsx

```typescript
import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div>
      <button
        onClick={() => i18n.changeLanguage('en')}
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage('fr')}
        aria-pressed={i18n.language === 'fr'}
      >
        FR
      </button>
    </div>
  )
}
```

### LanguageSwitcher.test.tsx

```typescript
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { LanguageSwitcher } from './LanguageSwitcher'
import { i18n } from '@/test/test-utils'

describe('LanguageSwitcher', () => {
  it('shows EN as active by default', () => {
    render(<LanguageSwitcher />)

    const enButton = screen.getByRole('button', { name: 'EN' })
    expect(enButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('changes language when FR clicked', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.click(screen.getByRole('button', { name: 'FR' }))

    expect(i18n.language).toBe('fr')
  })
})
```

---

## Trans Component Tests

### Terms.tsx

```typescript
import { Trans } from 'react-i18next'

export function Terms() {
  return (
    <Trans
      i18nKey="legal.terms"
      defaults="Read our <link>Terms</link>"
      components={{
        link: <a href="/terms" data-testid="terms-link" />,
      }}
    />
  )
}
```

### Terms.test.tsx

```typescript
import { render, screen } from '@/test/test-utils'
import { Terms } from './Terms'

// Add to mock resources
// "legal.terms": "Read our <link>Terms</link>"

describe('Terms', () => {
  it('renders link with correct href', () => {
    render(<Terms />)

    const link = screen.getByTestId('terms-link')
    expect(link).toHaveAttribute('href', '/terms')
  })

  it('renders link text from translation', () => {
    render(<Terms />)

    expect(screen.getByText('Terms')).toBeInTheDocument()
  })
})
```

---

## Form Tests

### LoginForm.tsx

```typescript
import { useTranslation } from 'react-i18next'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation('auth')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{t('login.title')}</h1>
      <label>
        {t('login.email')}
        <input type="email" name="email" />
      </label>
      <label>
        {t('login.password')}
        <input type="password" name="password" />
      </label>
      <button type="submit">{t('login.submit')}</button>
    </form>
  )
}
```

### LoginForm.test.tsx

```typescript
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('renders all form fields with English labels', () => {
    render(<LoginForm onSubmit={jest.fn()} />)

    expect(screen.getByRole('heading')).toHaveTextContent('Sign In')
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('Sign in')
  })

  it('renders with French labels', () => {
    render(<LoginForm onSubmit={jest.fn()} />, { locale: 'fr' })

    expect(screen.getByRole('heading')).toHaveTextContent('Connexion')
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('Se connecter')
  })

  it('submits form with values', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()

    render(<LoginForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button'))

    expect(handleSubmit).toHaveBeenCalledWith('test@example.com', 'password123')
  })
})
```

---

## Snapshot Tests

### Component.test.tsx

```typescript
import { render } from '@/test/test-utils'
import { Welcome } from './Welcome'

describe('Welcome snapshots', () => {
  it('matches English snapshot', () => {
    const { container } = render(<Welcome name="Test" />)
    expect(container).toMatchSnapshot()
  })

  it('matches French snapshot', () => {
    const { container } = render(<Welcome name="Test" />, { locale: 'fr' })
    expect(container).toMatchSnapshot()
  })
})
```

---

## Vitest Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### src/test/setup.ts

```typescript
import '@testing-library/jest-dom'
import './i18n-mock'
```

---

## Best Practices

| Practice | Description |
|----------|-------------|
| Centralized mock | Single i18n-mock.ts file |
| Custom render | Always use test wrapper |
| Test both locales | Verify EN and FR |
| Minimal resources | Only include needed keys |
| Snapshot per locale | Separate snapshots per language |
