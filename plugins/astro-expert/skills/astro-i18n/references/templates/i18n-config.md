# Template: Full i18n Configuration

Complete Astro i18n setup with routing, sitemap, and translation utilities.

## astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          fr: 'fr-FR',
          es: 'es-ES'
        }
      }
    })
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es'],
    routing: {
      prefixDefaultLocale: false
    },
    fallback: {
      fr: 'en',
      es: 'en'
    }
  }
});
```

## src/lib/i18n/translations.ts

```typescript
/**
 * UI translations for all supported locales.
 */
const translations = {
  en: {
    nav: { home: 'Home', about: 'About', blog: 'Blog' },
    footer: { copyright: '© 2026 Example. All rights reserved.' }
  },
  fr: {
    nav: { home: 'Accueil', about: 'À propos', blog: 'Blog' },
    footer: { copyright: '© 2026 Example. Tous droits réservés.' }
  },
  es: {
    nav: { home: 'Inicio', about: 'Acerca de', blog: 'Blog' },
    footer: { copyright: '© 2026 Example. Todos los derechos reservados.' }
  }
} as const;

type Locale = keyof typeof translations;
type Translations = typeof translations[Locale];

/**
 * Get translations for the given locale with English fallback.
 * @param locale - The locale code
 * @returns Translation object
 */
export function useTranslations(locale: string): Translations {
  return translations[(locale as Locale)] ?? translations.en;
}
```

## src/content/config.ts

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string()
  })
});

export const collections = { blog };
```
