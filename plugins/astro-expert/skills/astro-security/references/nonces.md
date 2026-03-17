# CSP Nonces in Astro

## Overview

Nonces are cryptographically random values used for CSP with dynamically injected scripts. Astro 6 supports nonces for SSR deployments.

## When to Use Nonces vs Hashes

| Method | Use Case |
|--------|----------|
| Hashes | Static, pre-known scripts/styles |
| Nonces | Dynamic scripts injected at request time |

## Nonce Setup (SSR)

For server-rendered pages, generate a nonce per request:

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { randomBytes } from 'node:crypto';

export const onRequest = defineMiddleware((context, next) => {
  const nonce = randomBytes(16).toString('base64');
  context.locals.cspNonce = nonce;
  return next();
});
```

```typescript
// src/env.d.ts
declare namespace App {
  interface Locals {
    cspNonce: string;
  }
}
```

## Using Nonce in Components

```astro
---
// src/layouts/BaseLayout.astro
const nonce = Astro.locals.cspNonce;
---

<html>
  <head>
    <meta
      http-equiv="content-security-policy"
      content={`script-src 'nonce-${nonce}' 'strict-dynamic'; style-src 'self'`}
    />
  </head>
  <body>
    <script nonce={nonce}>
      // This script is allowed
      console.log('Nonce-protected script');
    </script>
    <slot />
  </body>
</html>
```

## Nonce + Hash Combination

```javascript
// astro.config.mjs — use hashes for static assets, nonces for dynamic
export default defineConfig({
  security: {
    csp: {
      algorithm: 'SHA-512',
      scriptDirective: {
        strictDynamic: true  // Enables 'strict-dynamic' for nonce-loaded scripts
      }
    }
  }
});
```

## Best Practices

- Generate a new nonce for EVERY request (never reuse)
- Use `randomBytes(16).toString('base64')` for cryptographic randomness
- Combine with `strict-dynamic` for dynamically loaded sub-scripts
- Use nonces only in SSR mode — static sites use hashes
