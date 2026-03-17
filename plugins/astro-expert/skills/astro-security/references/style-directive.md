# CSP Style Directive

## Overview

The `styleDirective` option configures the `style-src` CSP directive. Astro auto-includes hashes for all bundled and component-scoped styles.

## Configuration

```javascript
security: {
  csp: {
    styleDirective: {
      hashes: ['sha384-...'],
      resources: ["'self'", 'https://fonts.googleapis.com']
    }
  }
}
```

## Options

### `hashes` (Array\<string\>)

Additional SHA hashes for external or third-party stylesheets.

- Added to all pages globally
- Must start with `sha256-`, `sha384-`, or `sha512-`

### `resources` (Array\<string\>)

Allowed style source URLs. Use for Google Fonts, CDN stylesheets, etc.

```javascript
resources: [
  "'self'",
  'https://fonts.googleapis.com'
]
```

## Google Fonts Example

```javascript
export default defineConfig({
  security: {
    csp: {
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

## SVG Inline Styles Issue (Astro 6)

SVG files imported as components may contain `<style>` tags that Astro doesn't hash automatically (known issue in Astro 6). Workaround:

```javascript
styleDirective: {
  hashes: ['sha384-svgStyleHash']  // Add hash manually
}
```

## Generated Output

```html
<meta
  http-equiv="content-security-policy"
  content="style-src 'self' https://fonts.googleapis.com 'sha512-styleHash1' 'sha512-styleHash2';"
>
```
