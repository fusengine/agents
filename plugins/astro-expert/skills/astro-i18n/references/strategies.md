# i18n Routing Strategies

## Two Strategies

### Strategy 1: prefix-other-locales (Default)

`prefixDefaultLocale: false`

Default locale has no prefix. Other locales are prefixed.

```
/ → English (default)
/about → English
/fr/ → French
/fr/about → French
/es/ → Spanish
```

**Best for:** Sites where the primary language is dominant and the clean URL is preferred.

### Strategy 2: prefix-always

`prefixDefaultLocale: true`

All locales have a prefix, including the default.

```
/en/ → English
/en/about → English
/fr/ → French
/fr/about → French
```

**Best for:** Sites with equal language weight, or when you want explicit locale in all URLs.

## Configuration

```javascript
// prefix-other-locales (default)
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'],
  routing: {
    prefixDefaultLocale: false
  }
}

// prefix-always
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'],
  routing: {
    prefixDefaultLocale: true
  }
}
```

## Impact on URL Helpers

`getRelativeLocaleUrl()` automatically respects the strategy:

```javascript
// With prefixDefaultLocale: false
getRelativeLocaleUrl('en', 'about')  // → /about
getRelativeLocaleUrl('fr', 'about')  // → /fr/about

// With prefixDefaultLocale: true
getRelativeLocaleUrl('en', 'about')  // → /en/about
getRelativeLocaleUrl('fr', 'about')  // → /fr/about
```

## Choosing a Strategy

| Factor | prefix-other-locales | prefix-always |
|--------|---------------------|---------------|
| Default locale URL | Clean (`/about`) | Prefixed (`/en/about`) |
| Consistency | Less consistent | Fully consistent |
| SEO for default locale | Slightly simpler | Explicit locale signal |
| Migration from non-i18n | Easier | Requires URL changes |
