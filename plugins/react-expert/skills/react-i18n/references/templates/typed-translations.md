# TypeScript Type-Safe Translations

Complete setup for type-safe translations with the i18next Selector API.

---

## File Structure

```text
src/
├── types/
│   ├── i18next.d.ts       # i18next type extensions
│   └── resources.ts       # Resource type definitions
├── i18n/
│   ├── config.ts          # i18n configuration
│   └── index.ts           # Export
└── locales/
    ├── en/
    │   ├── common.json
    │   └── auth.json
    └── fr/
        ├── common.json
        └── auth.json
```

---

## Translation Files

### public/locales/en/common.json

```json
{
  "app": {
    "name": "My App",
    "version": "Version {{version}}"
  },
  "greeting": "Hello, {{name}}!",
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

### public/locales/en/auth.json

```json
{
  "login": {
    "title": "Sign In",
    "email": "Email address",
    "password": "Password",
    "submit": "Sign in",
    "forgot": "Forgot password?"
  },
  "register": {
    "title": "Create Account",
    "name": "Full name",
    "submit": "Sign up"
  },
  "errors": {
    "invalid": "Invalid email or password",
    "required": "This field is required"
  }
}
```

---

## Type Definitions

### src/types/resources.ts

```typescript
/**
 * Import translation JSON files for type inference.
 * These are imported as const to preserve literal types.
 */
import common from '../../public/locales/en/common.json'
import auth from '../../public/locales/en/auth.json'

/**
 * Combined resources object for type inference.
 */
export const resources = {
  common,
  auth,
} as const

/**
 * Resource type derived from JSON files.
 */
export type Resources = typeof resources

/**
 * Namespace keys.
 */
export type Namespace = keyof Resources
```

### src/types/i18next.d.ts

```typescript
import 'i18next'
import type { Resources } from './resources'

/**
 * Extend i18next type definitions for type-safe translations.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    /**
     * Enable Selector API (i18next v25.4+).
     * Provides autocompletion and type checking for translation keys.
     */
    enableSelector: true

    /**
     * Resource types from JSON files.
     */
    resources: Resources

    /**
     * Default namespace when not specified.
     */
    defaultNS: 'common'

    /**
     * Prevent null returns for missing keys.
     */
    returnNull: false

    /**
     * Prevent empty string returns.
     */
    returnEmptyString: false
  }
}
```

---

## i18n Configuration

### src/i18n/config.ts

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr'],
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth'],

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    react: {
      useSuspense: true,
    },
  })

export default i18n
```

---

## Usage with Selector API

### Basic Usage

```typescript
import { useTranslation } from 'react-i18next'

function HomePage() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Type-safe with autocompletion */}
      <h1>{t($ => $.common.app.name)}</h1>

      {/* With interpolation */}
      <p>{t($ => $.common.greeting, { name: 'Alice' })}</p>

      {/* With pluralization */}
      <p>{t($ => $.common.items.count, { count: 5 })}</p>
    </div>
  )
}
```

### With Specific Namespace

```typescript
function LoginPage() {
  const { t } = useTranslation('auth')

  return (
    <form>
      {/* Autocompletion shows only 'auth' namespace keys */}
      <h1>{t($ => $.login.title)}</h1>

      <label>{t($ => $.login.email)}</label>
      <input type="email" />

      <label>{t($ => $.login.password)}</label>
      <input type="password" />

      <button type="submit">{t($ => $.login.submit)}</button>

      <a href="/forgot">{t($ => $.login.forgot)}</a>
    </form>
  )
}
```

### Cross-Namespace Access

```typescript
function FormWithCommon() {
  const { t } = useTranslation(['auth', 'common'])

  return (
    <form>
      <h1>{t($ => $.auth.register.title)}</h1>

      <input placeholder={t($ => $.auth.register.name)} />

      <div className="flex gap-2">
        {/* Access common namespace */}
        <button type="submit">{t($ => $.common.actions.save)}</button>
        <button type="button">{t($ => $.common.actions.cancel)}</button>
      </div>
    </form>
  )
}
```

---

## Typed Custom Hooks

### useTypedTranslation.ts

```typescript
import { useTranslation, type UseTranslationResponse } from 'react-i18next'
import type { Namespace } from '@/types/resources'

/**
 * Type-safe translation hook for specific namespace.
 *
 * @param ns - Namespace to use
 * @returns Typed translation function
 */
export function useTypedTranslation<N extends Namespace>(ns: N) {
  return useTranslation(ns) as UseTranslationResponse<N, undefined>
}

// Specialized hooks
export function useCommonTranslation() {
  return useTypedTranslation('common')
}

export function useAuthTranslation() {
  return useTypedTranslation('auth')
}
```

### Usage

```typescript
import { useAuthTranslation } from '@/hooks/useTypedTranslation'

function LoginForm() {
  const { t } = useAuthTranslation()

  // Only 'auth' keys available
  return (
    <form>
      <h1>{t($ => $.login.title)}</h1>
      <button>{t($ => $.login.submit)}</button>
    </form>
  )
}
```

---

## With keyPrefix

### Typed keyPrefix Hook

```typescript
import { useTranslation } from 'react-i18next'

/**
 * Translation hook with keyPrefix for DRY code.
 */
export function useFormTranslation(formName: 'login' | 'register') {
  return useTranslation('auth', {
    keyPrefix: formName,
  })
}
```

### Usage

```typescript
function LoginForm() {
  const { t } = useFormTranslation('login')

  return (
    <form>
      {/* Keys relative to 'auth.login' */}
      <h1>{t($ => $.title)}</h1>
      <input placeholder={t($ => $.email)} />
      <input placeholder={t($ => $.password)} type="password" />
      <button>{t($ => $.submit)}</button>
    </form>
  )
}
```

---

## Typed Trans Component

### TypedTrans.tsx

```typescript
import { Trans, type TransProps } from 'react-i18next'
import type { Namespace } from '@/types/resources'

interface TypedTransProps<N extends Namespace>
  extends Omit<TransProps<string>, 'ns'> {
  ns?: N
}

/**
 * Type-safe Trans component.
 */
export function TypedTrans<N extends Namespace = 'common'>({
  ns,
  ...props
}: TypedTransProps<N>) {
  return <Trans ns={ns} {...props} />
}
```

---

## Validation at Build Time

### TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

### CI Validation Script

```typescript
// scripts/validate-i18n.ts
import { resources } from '../src/types/resources'

type DeepKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? DeepKeys<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never
    }[keyof T]
  : never

// This will error if translations don't match
type CommonKeys = DeepKeys<typeof resources.common>
type AuthKeys = DeepKeys<typeof resources.auth>

console.log('✅ Translation types are valid')
```

---

## Benefits

| Benefit | Description |
|---------|-------------|
| **Autocompletion** | IDE suggests valid keys |
| **Type Checking** | Compiler catches typos |
| **Refactoring** | Rename keys safely |
| **Documentation** | Types serve as docs |
| **No Runtime Cost** | Types stripped at build |
