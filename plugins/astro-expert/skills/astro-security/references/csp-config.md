# CSP Configuration Reference

## Full Configuration Object

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  security: {
    csp: {
      // Hash algorithm for bundled scripts/styles
      algorithm: 'SHA-512',  // 'SHA-256' | 'SHA-384' | 'SHA-512'

      scriptDirective: {
        // Additional hashes for external scripts
        hashes: [
          'sha384-externalScriptHash'
        ],
        // Allowed script sources
        resources: [
          "'self'",
          'https://cdn.example.com'
        ],
        // Enable strict-dynamic for dynamic script injection
        strictDynamic: false
      },

      styleDirective: {
        // Additional hashes for external styles
        hashes: [
          'sha384-externalStyleHash'
        ],
        // Allowed style sources
        resources: [
          "'self'"
        ]
      }
    }
  }
});
```

## Algorithm Comparison

| Algorithm | Value | Speed | Security |
|-----------|-------|-------|---------|
| SHA-256 | `'SHA-256'` | Fastest | Good |
| SHA-384 | `'SHA-384'` | Medium | Better |
| SHA-512 | `'SHA-512'` | Slower | Best |

## Minimal Configuration

```javascript
export default defineConfig({
  security: {
    csp: true  // Uses defaults (SHA-384 algorithm)
  }
});
```

Or with just algorithm:
```javascript
export default defineConfig({
  security: {
    csp: { algorithm: 'SHA-512' }
  }
});
```

## Generated Meta Tag

For a page with one script and one style, Astro generates:

```html
<meta
  http-equiv="content-security-policy"
  content="script-src 'sha512-scriptHashHere'; style-src 'sha512-styleHashHere';"
>
```
