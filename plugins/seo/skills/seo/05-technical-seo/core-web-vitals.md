---
name: core-web-vitals
description: Core Web Vitals metrics (LCP, INP, CLS)
---

# Core Web Vitals (2026)

**LCP, INP, CLS - Google's user experience metrics.**

## Three Core Metrics

| Metric | Threshold | Description |
|--------|-----------|-------------|
| **LCP** | <2.5s | Largest Contentful Paint (loading) |
| **INP** | <200ms | Interaction to Next Paint (responsiveness) |
| **CLS** | <0.1 | Cumulative Layout Shift (stability) |

---

## LCP Optimization

```bash
# Target: <2.5 seconds

1. Optimize images:
   - Use WebP format
   - Implement lazy loading
   - Responsive images (srcset)

2. Minimize CSS/JS:
   - Defer non-critical JavaScript
   - Inline critical CSS
   - Remove unused code

3. Use CDN:
   - Cloudflare, Fastly
   - Edge caching

4. Server optimization:
   - TTFB <600ms
   - HTTP/2 or HTTP/3
```

---

## INP Optimization

```bash
# Target: <200ms (replaced FID in 2024)

1. Minimize JavaScript:
   - Code splitting
   - Remove unnecessary libraries
   - Defer third-party scripts

2. Optimize event handlers:
   - Use passive listeners
   - Debounce/throttle inputs

3. Reduce main thread work:
   - Web Workers for heavy tasks
```

---

## CLS Optimization

```bash
# Target: <0.1

1. Set image/video dimensions:
   <img width="800" height="600" ...>

2. Reserve space for ads:
   min-height in CSS

3. Avoid inserting content above:
   No dynamic content injection at top

4. Use font-display: swap:
   @font-face { font-display: swap; }
```

---

## Testing Tools

- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Chrome DevTools**: Lighthouse tab
- **Search Console**: Core Web Vitals report
