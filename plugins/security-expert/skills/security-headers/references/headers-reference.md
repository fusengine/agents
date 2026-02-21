---
name: headers-reference
description: HTTP security headers reference (CSP, HSTS, CORS, X-Frame-Options, Permissions-Policy)
when-to-use: When auditing or configuring HTTP security headers
keywords: csp, hsts, cors, x-frame-options, referrer-policy, headers
priority: high
related: templates/headers-config.md
---

# Security Headers Reference

## Content-Security-Policy (CSP)

- **Purpose**: Controls which resources the browser can load
- **Recommended**: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`
- **Risk**: XSS attacks if misconfigured
- **Directives**: default-src, script-src, style-src, img-src, connect-src, font-src, frame-src

## Strict-Transport-Security (HSTS)

- **Purpose**: Forces HTTPS connections
- **Recommended**: `max-age=63072000; includeSubDomains; preload`
- **Risk**: Man-in-the-middle attacks
- **Note**: Include preload for HSTS preload list

## X-Content-Type-Options

- **Purpose**: Prevents MIME type sniffing
- **Recommended**: `nosniff`
- **Risk**: MIME confusion attacks

## X-Frame-Options

- **Purpose**: Prevents clickjacking via iframes
- **Recommended**: `DENY` or `SAMEORIGIN`
- **Risk**: Clickjacking attacks
- **Note**: Being replaced by CSP frame-ancestors

## Referrer-Policy

- **Purpose**: Controls referrer information sent
- **Recommended**: `strict-origin-when-cross-origin`
- **Risk**: Information leakage

## Permissions-Policy

- **Purpose**: Controls browser feature access
- **Recommended**: `camera=(), microphone=(), geolocation=()`
- **Risk**: Unauthorized feature usage

## Cross-Origin Headers

- **CORS**: `Access-Control-Allow-Origin` - restrict to known domains
- **COEP**: `Cross-Origin-Embedder-Policy: require-corp`
- **COOP**: `Cross-Origin-Opener-Policy: same-origin`
- **CORP**: `Cross-Origin-Resource-Policy: same-origin`
