---
name: analytics-setup
description: Analytics setup for SEO and GEO
---

# Analytics Setup (SEO + GEO)

**Tracking both traditional SEO and AI visibility.**

## Google Analytics 4

```javascript
// GA4 Setup
gtag('config', 'G-XXXXXXXXXX');

// Custom events for GEO
gtag('event', 'ai_referral', {
  platform: 'ChatGPT',
  query: 'best SEO tools'
});
```

---

## Google Search Console

```bash
# Key Reports
1. Performance → Queries (keyword tracking)
2. Performance → Pages (top content)
3. Index Coverage (crawl issues)
4. Core Web Vitals (UX metrics)
5. Enhancements → Structured Data
```

---

## Tracking Dashboard

| Metric | Source | Frequency |
|--------|--------|-----------|
| **Organic Traffic** | GA4 | Daily |
| **Keyword Rankings** | Ahrefs | Weekly |
| **AI Citations** | OmniSEO | Weekly |
| **Core Web Vitals** | Search Console | Monthly |
| **Backlinks** | Ahrefs | Monthly |

---

## UTM Parameters

```bash
# Track AI referrals
?utm_source=chatgpt&utm_medium=ai&utm_campaign=geo

# Track featured snippets
?utm_source=google&utm_medium=organic&utm_campaign=featured_snippet
```
