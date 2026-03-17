# CSP Script Directive

## Overview

The `scriptDirective` option configures the `script-src` CSP directive. Astro auto-includes hashes for all bundled scripts. Use `scriptDirective` to allow additional external scripts.

## Configuration

```javascript
security: {
  csp: {
    scriptDirective: {
      hashes: ['sha384-...', 'sha512-...'],
      resources: ["'self'", 'https://cdn.example.com'],
      strictDynamic: true
    }
  }
}
```

## Options

### `hashes` (Array\<string\>)

Additional SHA hashes for external or inline scripts not managed by Astro.

- Format: `"sha256-base64hash"`, `"sha384-base64hash"`, or `"sha512-base64hash"`
- Added to all pages globally

```javascript
hashes: [
  'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC'
]
```

### `resources` (Array\<string\>)

Allowed script source URLs or keywords. Note: `'self'` is NOT included by default.

```javascript
resources: [
  "'self'",
  'https://www.googletagmanager.com',
  'https://cdn.jsdelivr.net'
]
```

### `strictDynamic` (boolean, default: false)

Enables `'strict-dynamic'` keyword, which allows dynamically injected scripts from trusted scripts.

## How to Compute External Script Hash

```bash
# Linux/Mac
curl -s https://cdn.example.com/script.js | openssl dgst -sha384 -binary | openssl base64 -A
```

Then prefix with `sha384-`:
```
sha384-<base64output>
```

## Generated Output

```html
<meta
  http-equiv="content-security-policy"
  content="script-src 'self' https://cdn.example.com 'sha384-externalHash' 'sha512-astroHash1' 'sha512-astroHash2' 'strict-dynamic';"
>
```
