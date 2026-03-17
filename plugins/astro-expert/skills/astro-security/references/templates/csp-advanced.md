# Template: Advanced CSP Configuration

Full CSP setup with custom directives, external resources, and Vercel static headers.

## astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://example.com',

  adapter: vercel({
    experimentalStaticHeaders: true  // CSP via HTTP headers (not meta tag)
  }),

  security: {
    csp: {
      algorithm: 'SHA-512',

      scriptDirective: {
        // External scripts (e.g., Google Analytics)
        resources: [
          "'self'",
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com'
        ],
        // Pre-computed hash for a specific external script
        hashes: [
          'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC'
        ],
        strictDynamic: false
      },

      styleDirective: {
        resources: [
          "'self'",
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ]
      }
    }
  }
});
```

## Compute External Script Hash

```bash
# Download script and compute SHA-384 hash
curl -s https://cdn.example.com/script.min.js \
  | openssl dgst -sha384 -binary \
  | openssl base64 -A
# Output: oqVuAfXRKap7fdgcCY5uykM6+...
# Use: sha384-oqVuAfXRKap7fdgcCY5uykM6+...
```

## For Large Sites (Vercel)

```javascript
adapter: vercel({
  experimentalStaticHeaders: {
    globalCsp: true  // Prevents "Body exceeded 3300kb limit" error
  }
})
```

## Testing Checklist

- [ ] `astro build` completes without errors
- [ ] `astro preview` shows no CSP violations in browser console
- [ ] Google Fonts load correctly
- [ ] Analytics scripts fire correctly
- [ ] No `unsafe-inline` in final CSP header
