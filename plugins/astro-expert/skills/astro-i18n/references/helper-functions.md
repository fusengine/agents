# astro:i18n Helper Functions

## Import

```javascript
import {
  getRelativeLocaleUrl,
  getAbsoluteLocaleUrl,
  getRelativeLocaleUrlList,
  getAbsoluteLocaleUrlList,
  getPathByLocale,
  getLocaleByPath
} from 'astro:i18n';
```

## URL Generation

### getRelativeLocaleUrl(locale, path?, options?)

Returns a relative URL for a locale. Respects routing strategy.

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';

const frAbout = getRelativeLocaleUrl('fr', 'about');    // /fr/about
const frHome = getRelativeLocaleUrl('fr');              // /fr/
const enAbout = getRelativeLocaleUrl('en', 'about');    // /about (no prefix)
---

<a href={getRelativeLocaleUrl('fr', 'blog')}>Blog FR</a>
```

### getAbsoluteLocaleUrl(locale, path?, options?)

Returns an absolute URL. Requires `site` configured in `astro.config.mjs`.

```javascript
getAbsoluteLocaleUrl('fr', 'about')
// → https://example.com/fr/about
```

### getRelativeLocaleUrlList(path?, options?)

Returns relative URLs for ALL configured locales.

```javascript
getRelativeLocaleUrlList('about')
// → ['/about', '/fr/about', '/es/about']
```

### getAbsoluteLocaleUrlList(path?, options?)

Returns absolute URLs for ALL configured locales. Used for hreflang generation.

```javascript
getAbsoluteLocaleUrlList('about')
// → ['https://example.com/about', 'https://example.com/fr/about']
```

## Locale Mapping

### getPathByLocale(locale)

Returns the URL path segment for a locale.

```javascript
getPathByLocale('fr')  // → 'fr'
```

### getLocaleByPath(path)

Returns the locale for a given path segment.

```javascript
getLocaleByPath('fr')  // → 'fr'
```

## Options Parameter

All URL helpers accept an options object:

```typescript
interface GetLocaleOptions {
  prependWith?: string;  // Add prefix to all paths
  normalizeLocale?: boolean;  // Normalize locale code (default: true)
}
```

## Usage in Layout for Alternate Links

```astro
---
import { getAbsoluteLocaleUrlList } from 'astro:i18n';

const currentPath = Astro.url.pathname.replace(/^\/[a-z]{2}\//, '/');
const locales = ['en', 'fr', 'es'];
---

<head>
  {locales.map(locale => (
    <link
      rel="alternate"
      hreflang={locale}
      href={getAbsoluteLocaleUrl(locale, currentPath)}
    />
  ))}
</head>
```
