# Basic i18n Setup

Complete setup for react-i18next with React 19, TypeScript, and Suspense.

---

## Installation

```bash
npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector
```

---

## File Structure

```text
src/
├── i18n/
│   ├── config.ts           # i18n configuration
│   ├── types.ts            # TypeScript types
│   └── index.ts            # Export
├── locales/
│   ├── en/
│   │   └── common.json
│   └── fr/
│       └── common.json
└── main.tsx
```

---

## Configuration

### src/i18n/config.ts

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const isDev = import.meta.env.DEV

/**
 * Initialize i18next with React 19 support.
 */
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Supported languages
    supportedLngs: ['en', 'fr', 'de', 'es'],
    fallbackLng: 'en',

    // Namespaces
    defaultNS: 'common',
    ns: ['common'],

    // Debug in development
    debug: isDev,

    // Interpolation
    interpolation: {
      escapeValue: false, // React escapes by default
    },

    // Backend - load from public folder
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Language detection
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // React 19 options
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
  })

export default i18n
```

### src/i18n/index.ts

```typescript
export { default } from './config'
```

---

## Translation Files

### public/locales/en/common.json

```json
{
  "app": {
    "name": "My Application",
    "tagline": "Build amazing things"
  },
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "settings": "Settings"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "submit": "Submit",
    "loading": "Loading..."
  },
  "messages": {
    "welcome": "Welcome, {{name}}!",
    "success": "Operation completed successfully",
    "error": "An error occurred. Please try again."
  },
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items",
    "count_zero": "No items"
  }
}
```

### public/locales/fr/common.json

```json
{
  "app": {
    "name": "Mon Application",
    "tagline": "Créez des choses incroyables"
  },
  "nav": {
    "home": "Accueil",
    "about": "À propos",
    "contact": "Contact",
    "settings": "Paramètres"
  },
  "actions": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "submit": "Soumettre",
    "loading": "Chargement..."
  },
  "messages": {
    "welcome": "Bienvenue, {{name}} !",
    "success": "Opération réussie",
    "error": "Une erreur est survenue. Veuillez réessayer."
  },
  "items": {
    "count_one": "{{count}} élément",
    "count_other": "{{count}} éléments",
    "count_zero": "Aucun élément"
  }
}
```

---

## App Entry Point

### src/main.tsx

```typescript
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n' // Initialize i18n before app
import App from './App'
import './index.css'

/**
 * Loading fallback component.
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </StrictMode>
)
```

---

## Basic Usage

### src/App.tsx

```typescript
import { useTranslation } from 'react-i18next'

/**
 * Main application component.
 */
export default function App() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('app.name')}
          </h1>
          <p className="text-gray-600">{t('app.tagline')}</p>
        </div>
      </header>

      <nav className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 py-3">
            <a href="/" className="text-gray-700 hover:text-gray-900">
              {t('nav.home')}
            </a>
            <a href="/about" className="text-gray-700 hover:text-gray-900">
              {t('nav.about')}
            </a>
            <a href="/contact" className="text-gray-700 hover:text-gray-900">
              {t('nav.contact')}
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <p className="text-lg">
          {t('messages.welcome', { name: 'User' })}
        </p>

        <div className="mt-4 space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            {t('actions.save')}
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">
            {t('actions.cancel')}
          </button>
        </div>

        <div className="mt-4">
          <p>{t('items.count', { count: 0 })}</p>
          <p>{t('items.count', { count: 1 })}</p>
          <p>{t('items.count', { count: 5 })}</p>
        </div>
      </main>
    </div>
  )
}
```

---

## Verification

Run the app and verify:

1. ✅ App loads without errors
2. ✅ English text displays by default
3. ✅ Language detected from browser/localStorage
4. ✅ Pluralization works (0 items, 1 item, 5 items)
5. ✅ Interpolation works (Welcome, User!)

---

## Next Steps

- Add `LanguageSwitcher` component → `templates/language-switcher.md`
- Add TypeScript types → `templates/typed-translations.md`
- Add more namespaces → `references/namespaces.md`
