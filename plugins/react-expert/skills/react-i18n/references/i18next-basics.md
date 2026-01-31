---
name: i18next-basics
description: Core i18next concepts - useTranslation hook, t function, i18n instance, and app integration
when-to-use: setting up i18n, accessing translations, changing language, basic usage
keywords: useTranslation, t, i18n, hook, setup, configuration
priority: high
related: templates/basic-setup.md, namespaces.md
---

# i18next Basics

## useTranslation Hook

**Primary hook for accessing translations in React components.**

### Purpose
- Access the translation function `t()`
- Access the i18n instance for language changes
- Subscribe to language change events

### When to Use
- Any component that displays translated text
- Components that need to change language
- Accessing current language state

### Key Points
- Returns `{ t, i18n, ready }` object
- Triggers re-render on language change
- Supports namespace parameter
- Works with React Suspense

---

## Translation Function (t)

**Retrieve translated strings by key.**

### Purpose
- Lookup translations by key path
- Interpolate dynamic values
- Handle pluralization

### When to Use
- Displaying any user-facing text
- Dynamic content with variables
- Count-based plural messages

### Key Points
- Supports dot notation for nested keys
- Interpolation with `{{variable}}` syntax
- Default value as second parameter
- Automatic plural form selection with `count`

---

## i18n Instance

**Core i18next instance for configuration and control.**

### Purpose
- Change current language
- Load additional namespaces
- Access language state

### When to Use
- Building language switchers
- Programmatic language changes
- Runtime namespace loading

### Key Points
- `i18n.changeLanguage(lng)` is async
- `i18n.language` returns current language
- `i18n.loadNamespaces(ns)` for lazy loading
- Emits events on language change

---

## App Integration

**Wrapping your app with i18n support.**

### Purpose
- Initialize i18next before app renders
- Provide translation context to all components
- Handle loading states

### When to Use
- App entry point (main.tsx/index.tsx)
- Setting up new React project with i18n

### Key Points
- Import i18n config before app
- Wrap with Suspense for loading states
- I18nextProvider optional (initReactI18next handles it)
- Configure before first render

---

## Required Packages

| Package | Purpose |
|---------|---------|
| `i18next` | Core internationalization framework |
| `react-i18next` | React hooks and components |
| `i18next-http-backend` | Load translations from server |
| `i18next-browser-languagedetector` | Auto-detect user language |

---

→ See `templates/basic-setup.md` for complete code examples
