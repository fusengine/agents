# Sitemap and hreflang in Astro

## Overview

Configure `@astrojs/sitemap` with the `i18n` option to automatically generate hreflang alternate links for all locales.

## Installation

```bash
npx astro add sitemap
```

## Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',  // Required for sitemap

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',  // Path key → language attribute
          fr: 'fr-FR',
          es: 'es-ES',
          de: 'de-DE'
        }
      }
    })
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'de']
  }
});
```

## Generated Sitemap Entry

```xml
<url>
  <loc>https://example.com/about</loc>
  <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/about"/>
  <xhtml:link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/about"/>
  <xhtml:link rel="alternate" hreflang="es-ES" href="https://example.com/es/about"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about"/>
</url>
```

## Manual hreflang in Layout

Complement the sitemap with inline hreflang tags:

```astro
---
import { getAbsoluteLocaleUrlList } from 'astro:i18n';

interface Props {
  path: string;
}

const { path } = Astro.props;

const localeMap = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES'
};

const locales = Object.keys(localeMap) as Array<keyof typeof localeMap>;
---

<head>
  {locales.map(locale => (
    <link
      rel="alternate"
      hreflang={localeMap[locale]}
      href={`https://example.com${getRelativeLocaleUrl(locale, path)}`}
    />
  ))}
  <link rel="alternate" hreflang="x-default" href={`https://example.com${path}`} />
</head>
```

## Best Practices

- Always set `site` in `astro.config.mjs` — required for absolute URLs
- Use BCP 47 language tags in `locales` map (`en-US`, not `en`)
- Include `x-default` hreflang for the default locale
- Ensure all locales are accessible — 404s break hreflang
