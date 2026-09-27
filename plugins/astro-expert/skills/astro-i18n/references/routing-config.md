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
    locales: ['en', 'it', 'es', 'de'],
    routing: {
      prefixDefaultLocale: false  // /about (en), /it/about, /es/about
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
├── it/
│   ├── index.astro       # /it/ → Italian
│   └── about.astro       # /it/about → Italian
└── es/
    ├── index.astro       # /es/ → Spanish
    └── about.astro       # /es/about → Spanish
```

## Reading Current Locale

```astro
---
// Available in any .astro page or component
const currentLocale = Astro.currentLocale;  // 'en' | 'it' | 'es'
---

<html lang={currentLocale}>
```

## Fallback Configuration

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'it', 'es'],
  fallback: {
    it: 'en',  // Missing Italian pages fall back to English
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
