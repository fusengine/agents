# Template: Basic CSP Configuration

Minimal CSP setup for a standard Astro 6 static site.

## astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',

  security: {
    csp: {
      algorithm: 'SHA-512'
    }
  }
});
```

## Result

Astro automatically:
1. Hashes all bundled scripts with SHA-512
2. Hashes all component-scoped styles with SHA-512
3. Adds `<meta http-equiv="content-security-policy">` to each page

```html
<!-- Auto-generated in <head> -->
<meta
  http-equiv="content-security-policy"
  content="script-src 'sha512-hash1' 'sha512-hash2'; style-src 'sha512-hash3' 'sha512-hash4';"
>
```

## Testing

```bash
# ALWAYS test with build + preview (not dev)
npm run build && npm run preview
```

Open DevTools → Network → click any page → Response Headers.
Or check the page source for the `<meta>` tag.

## Verifying in Browser

1. Open DevTools → Console
2. Look for CSP violation errors
3. If none — CSP is working correctly
