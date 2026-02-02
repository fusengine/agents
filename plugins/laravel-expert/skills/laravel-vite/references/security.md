---
name: security
description: CSP nonce and security configuration
when-to-use: Implementing Content Security Policy
keywords: csp, nonce, security, headers
---

# Security

## Decision Tree

```
Using Content Security Policy?
├── YES → Configure CSP nonce
└── NO → Standard @vite directive
```

## CSP Nonce

| Method | Purpose |
|--------|---------|
| `Vite::useCspNonce()` | Auto-generate nonce |
| `Vite::useCspNonce($nonce)` | Custom nonce |
| `Vite::cspNonce()` | Get current nonce |

## Middleware Setup

| Step | Action |
|------|--------|
| Create middleware | Handle CSP header |
| Call `Vite::useCspNonce()` | Before response |
| Add header | `script-src 'nonce-...'` |

## CSP Header

| Directive | Purpose |
|-----------|---------|
| `script-src` | Script sources |
| `style-src` | Style sources |
| `img-src` | Image sources |
| `connect-src` | XHR/fetch sources |

## Nonce Usage

| Context | Method |
|---------|--------|
| Vite scripts | Automatic |
| Inline scripts | `nonce="{{ Vite::cspNonce() }}"` |
| Inline styles | Same nonce |

## Script Attributes

| Method | Purpose |
|--------|---------|
| `Vite::useScriptTagAttributes([...])` | Add attributes |
| `Vite::useStyleTagAttributes([...])` | Style attributes |

## Common Attributes

| Attribute | Purpose |
|-----------|---------|
| `defer` | Defer execution |
| `async` | Async loading |
| `crossorigin` | CORS mode |
| `integrity` | SRI hash |

## Security Best Practices

| DO | DON'T |
|----|-------|
| Use CSP in production | Skip CSP |
| Strict nonce policy | `'unsafe-inline'` |
| HTTPS in production | HTTP for scripts |
| SRI for CDN assets | Trust CDN blindly |

→ **Code examples**: See [ViteConfigAdvanced.js.md](templates/ViteConfigAdvanced.js.md)
