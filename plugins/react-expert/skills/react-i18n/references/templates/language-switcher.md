# Language Switcher Component

Multiple implementations of language switching UI with React 19 and Tailwind CSS.

---

## Simple Button Group

### LanguageSwitcher.tsx

```typescript
import { useTranslation } from 'react-i18next'
import { useTransition } from 'react'

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'es', label: 'ES', name: 'Español' },
] as const

/**
 * Simple language switcher with buttons.
 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isPending, startTransition] = useTransition()

  const handleChange = (langCode: string) => {
    startTransition(() => {
      i18n.changeLanguage(langCode)
    })
  }

  return (
    <div className="flex gap-1" role="group" aria-label="Language selection">
      {LANGUAGES.map(({ code, label, name }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          disabled={isPending}
          aria-pressed={i18n.language === code}
          aria-label={name}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${i18n.language === code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            ${isPending ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

---

## Dropdown Select

### LanguageDropdown.tsx

```typescript
import { useTranslation } from 'react-i18next'
import { useTransition } from 'react'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
] as const

/**
 * Language switcher as dropdown select.
 */
export function LanguageDropdown() {
  const { i18n } = useTranslation()
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      i18n.changeLanguage(e.target.value)
    })
  }

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Select language"
        className={`
          appearance-none bg-white border border-gray-300 rounded-lg
          px-4 py-2 pr-8 text-sm cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${isPending ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        {LANGUAGES.map(({ code, name, flag }) => (
          <option key={code} value={code}>
            {flag} {name}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isPending && (
        <div className="absolute inset-y-0 right-8 flex items-center">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  )
}
```

---

## Menu with Flags (shadcn/ui)

### LanguageMenu.tsx

```typescript
import { useTranslation } from 'react-i18next'
import { useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
] as const

/**
 * Language switcher as dropdown menu (shadcn/ui).
 */
export function LanguageMenu() {
  const { i18n } = useTranslation()
  const [isPending, startTransition] = useTransition()

  const currentLang = LANGUAGES.find(l => l.code === i18n.language)

  const handleChange = (langCode: string) => {
    startTransition(() => {
      i18n.changeLanguage(langCode)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          className="gap-2"
        >
          <Globe className="h-4 w-4" />
          <span>{currentLang?.flag}</span>
          <span className="hidden sm:inline">{currentLang?.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {LANGUAGES.map(({ code, name, flag }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleChange(code)}
            className={`gap-2 ${i18n.language === code ? 'bg-accent' : ''}`}
          >
            <span>{flag}</span>
            <span>{name}</span>
            {i18n.language === code && (
              <span className="ml-auto text-green-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Custom Hook

### useLanguage.ts

```typescript
import { useTranslation } from 'react-i18next'
import { useTransition, useCallback } from 'react'

export type LanguageCode = 'en' | 'fr' | 'de' | 'es'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
]

/**
 * Hook for language management.
 *
 * @returns Language state and change function
 */
export function useLanguage() {
  const { i18n } = useTranslation()
  const [isPending, startTransition] = useTransition()

  const currentLanguage = LANGUAGES.find(
    l => l.code === i18n.language
  ) ?? LANGUAGES[0]

  const changeLanguage = useCallback(
    (code: LanguageCode) => {
      startTransition(() => {
        i18n.changeLanguage(code)
      })
    },
    [i18n]
  )

  return {
    currentLanguage,
    languages: LANGUAGES,
    changeLanguage,
    isPending,
    languageCode: i18n.language as LanguageCode,
  }
}
```

### Usage

```typescript
import { useLanguage } from '@/hooks/useLanguage'

function MyComponent() {
  const { currentLanguage, languages, changeLanguage, isPending } = useLanguage()

  return (
    <div>
      <p>Current: {currentLanguage.nativeName}</p>
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          disabled={isPending}
        >
          {lang.flag} {lang.nativeName}
        </button>
      ))}
    </div>
  )
}
```

---

## With localStorage Sync

### LanguageSwitcherPersistent.tsx

```typescript
import { useTranslation } from 'react-i18next'
import { useTransition, useEffect } from 'react'

/**
 * Language switcher that syncs with localStorage.
 */
export function LanguageSwitcherPersistent() {
  const { i18n } = useTranslation()
  const [isPending, startTransition] = useTransition()

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const handleChange = (langCode: string) => {
    startTransition(() => {
      i18n.changeLanguage(langCode)
      // i18next automatically persists to localStorage
      // based on detection.caches config
    })
  }

  return (
    <div className="flex gap-2">
      {['en', 'fr', 'de'].map(code => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          disabled={isPending}
          className={`px-3 py-1 rounded ${
            i18n.language === code ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
```

---

## Accessibility Checklist

- ✅ `aria-label` on container/buttons
- ✅ `aria-pressed` for current language button
- ✅ Keyboard navigation support
- ✅ Visual indication of current language
- ✅ Loading state indication
- ✅ Focus visible styles
