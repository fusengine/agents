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

## Scoped Entries (Astro 7.1+)

Each `hashes` / `resources` entry can be a string or an object with `kind`:

| `kind` | Target directive |
|--------|------------------|
| `'default'` (same as a bare string) | `script-src` / `style-src` |
| `'element'` | `script-src-elem` / `style-src-elem` |
| `'attribute'` | `script-src-attr` / `style-src-attr` |

```javascript
scriptDirective: {
  hashes: [{ hash: 'sha256-scriptHash', kind: 'element' }],
  resources: ["'self'", { resource: 'https://elements.cdn.example.com', kind: 'element' }]
}
```

`'attribute'` resources must be one of `'none'`, `'unsafe-hashes'`, `'unsafe-inline'`, `'report-sample'`. Per page, the `Astro.csp` runtime API (`insertScriptHash`, `insertScriptResource`, `insertStyleHash`, …) accepts the same `{ …, kind }` objects since 7.1.

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
    csp: true  // Uses defaults (SHA-256 algorithm)
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
