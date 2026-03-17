# Astro i18n Routing Configuration

## Overview

Astro's built-in i18n routing (available since Astro 3.5) provides file-based locale routing, URL helpers, and middleware-driven locale detection.

## Basic Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',  // Required for absolute URL helpers

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'de'],
    routing: {
      prefixDefaultLocale: false  // /about (en), /fr/about, /es/about
    }
  }
});
```

## File Structure

With `prefixDefaultLocale: false`:

```text
src/pages/
├── index.astro           # / → English (default)
├── about.astro           # /about → English
├── fr/
│   ├── index.astro       # /fr/ → French
│   └── about.astro       # /fr/about → French
└── es/
    ├── index.astro       # /es/ → Spanish
    └── about.astro       # /es/about → Spanish
```

## Reading Current Locale

```astro
---
// Available in any .astro page or component
const currentLocale = Astro.currentLocale;  // 'en' | 'fr' | 'es'
---

<html lang={currentLocale}>
```

## Fallback Configuration

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'],
  fallback: {
    fr: 'en',  // Missing French pages fall back to English
    es: 'en'
  }
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultLocale` | string | required | Default language code |
| `locales` | string[] | required | All supported locales |
| `prefixDefaultLocale` | boolean | `false` | Add locale prefix to default locale URLs |
| `fallback` | Record | `{}` | Fallback locale per locale |
