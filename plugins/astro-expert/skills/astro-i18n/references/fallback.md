# i18n Fallback Configuration

## Overview

When a page doesn't exist for a specific locale, Astro can automatically serve the content from a fallback locale instead of returning a 404.

## Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'pt'],
    fallback: {
      fr: 'en',   // French falls back to English
      es: 'en',   // Spanish falls back to English
      pt: 'es'    // Portuguese falls back to Spanish
    }
  }
});
```

## How It Works

If `/fr/new-feature` doesn't exist but `/new-feature` (English) does:

- Astro serves the English content at the `/fr/new-feature` URL
- No redirect — the URL stays the same
- Useful during incremental translation

## Fallback Routing Strategy

```text
Request: /fr/about
→ Check: src/pages/fr/about.astro  (missing)
→ Fallback to 'en'
→ Serve: src/pages/about.astro     (found → return English content)
```

## Middleware-Based Custom Fallback

For more control, implement custom fallback logic:

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { requestHasLocale } from 'astro:i18n';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // If 404 for a localized route, try fallback
  if (response.status === 404 && requestHasLocale(context)) {
    // Custom fallback logic here
  }

  return response;
});
```

## When to Use Fallback

- Incremental translation rollout (translate pages progressively)
- Low-traffic locale pages that don't warrant full translation
- Prototype/staging before full translation is ready

## Best Practices

- Use fallback as a temporary measure, not permanent
- Track fallback usage to prioritize translation work
- Show a notice to users when viewing fallback content
