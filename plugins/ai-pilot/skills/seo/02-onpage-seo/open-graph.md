---
name: open-graph
description: Open Graph tags implementation guide
---

# Open Graph Tags (Facebook, LinkedIn, Discord)

**Complete implementation guide for Open Graph protocol (OG 2.0 - 2026).**

## What is Open Graph?

Open Graph (OG) controls how URLs are displayed when shared on:
- **Facebook** (posts, messenger)
- **LinkedIn** (posts, articles)
- **Discord** (link previews)
- **Slack** (unfurls)
- **WhatsApp** (link previews)
- **Microsoft Teams**

Without OG tags, platforms use generic fallbacks (often incorrect).

---

## Required OG Tags (Minimum)

```html
<meta property="og:title" content="SEO Guide 2026: 47 Proven Techniques">
<meta property="og:description" content="Discover 2026 SEO best practices: E-E-A-T compliance, Core Web Vitals, and AI optimization.">
<meta property="og:image" content="https://example.com/images/seo-guide-og.jpg">
<meta property="og:url" content="https://example.com/seo-guide-2026">
<meta property="og:type" content="website">
```

### Tag Explanations

| Tag | Purpose | Rules |
|-----|---------|-------|
| `og:title` | Title in preview card | 60-90 chars (optimal: 70) |
| `og:description` | Description text | 150-200 chars (optimal: 160) |
| `og:image` | Preview image | **1200x630px** (ratio 1.91:1) |
| `og:url` | Canonical URL | Absolute URL, no parameters |
| `og:type` | Content type | `website`, `article`, `product`, `video` |

---

## Complete OG Implementation

### For Articles/Blog Posts

```html
<!-- Basic OG -->
<meta property="og:title" content="How to Optimize Core Web Vitals in 2026">
<meta property="og:description" content="Complete guide to improve LCP, INP, and CLS. Includes 15 actionable techniques tested on 1000+ websites.">
<meta property="og:image" content="https://example.com/images/core-web-vitals-og.jpg">
<meta property="og:url" content="https://example.com/blog/core-web-vitals-2026">
<meta property="og:type" content="article">

<!-- Article-specific -->
<meta property="article:published_time" content="2026-01-15T09:00:00+00:00">
<meta property="article:modified_time" content="2026-01-18T14:30:00+00:00">
<meta property="article:author" content="Jean Dupont">
<meta property="article:section" content="SEO">
<meta property="article:tag" content="Core Web Vitals">
<meta property="article:tag" content="Performance">
<meta property="article:tag" content="SEO 2026">

<!-- Site info -->
<meta property="og:site_name" content="AgencySEO Blog">
<meta property="og:locale" content="fr_FR">
```

### For Products (E-commerce)

```html
<!-- Basic OG -->
<meta property="og:title" content="SEO Pro Tool - Professional SEO Suite">
<meta property="og:description" content="All-in-one SEO platform. Keyword tracking, backlink analysis, competitor research. Trusted by 10K+ agencies.">
<meta property="og:image" content="https://example.com/images/seo-pro-tool-og.jpg">
<meta property="og:url" content="https://example.com/products/seo-pro-tool">
<meta property="og:type" content="product">

<!-- Product-specific -->
<meta property="product:price:amount" content="99.00">
<meta property="product:price:currency" content="EUR">
<meta property="product:availability" content="in stock">
<meta property="product:condition" content="new">
<meta property="product:brand" content="AgencySEO">

<!-- Multiple images (product gallery) -->
<meta property="og:image" content="https://example.com/images/product-1.jpg">
<meta property="og:image" content="https://example.com/images/product-2.jpg">
<meta property="og:image" content="https://example.com/images/product-3.jpg">
```

### For Homepage/Website

```html
<meta property="og:title" content="AgencySEO - Expert SEO Consultant in Paris">
<meta property="og:description" content="Professional SEO services. 15 years experience, 500+ clients. E-E-A-T compliant strategies for 2026.">
<meta property="og:image" content="https://example.com/images/homepage-og.jpg">
<meta property="og:url" content="https://example.com">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AgencySEO">
<meta property="og:locale" content="fr_FR">
<meta property="og:locale:alternate" content="en_GB">
```

### For Videos

```html
<meta property="og:title" content="SEO Tutorial 2026: Complete Beginner's Guide">
<meta property="og:description" content="Learn SEO from scratch. 45-minute comprehensive tutorial covering keywords, on-page, and technical SEO.">
<meta property="og:image" content="https://example.com/images/video-thumbnail.jpg">
<meta property="og:url" content="https://example.com/videos/seo-tutorial-2026">
<meta property="og:type" content="video.other">

<!-- Video-specific -->
<meta property="og:video" content="https://example.com/videos/seo-tutorial-2026.mp4">
<meta property="og:video:type" content="video/mp4">
<meta property="og:video:width" content="1920">
<meta property="og:video:height" content="1080">
<meta property="og:video:duration" content="2700">
```

---

## Image Guidelines 2026

### Recommended Dimensions

| Platform | Optimal Size | Ratio | Min Size | Max Size |
|----------|--------------|-------|----------|----------|
| **Facebook** | 1200x630px | 1.91:1 | 600x315px | 8MB |
| **LinkedIn** | 1200x627px | 1.91:1 | 520x272px | 5MB |
| **Discord** | 1200x630px | 1.91:1 | 400x300px | - |
| **Universal** | **1200x630px** | **1.91:1** | - | - |

### Image Best Practices

✅ **DO**:
- Use **1200x630px** (works everywhere)
- JPG or PNG format
- File size < 1MB (faster loading)
- Include branding (logo, colors)
- High contrast text (if text overlay)
- Test preview on all platforms

❌ **DON'T**:
- Use images < 600x315px (low quality)
- Put critical text near edges (gets cropped)
- Use transparent backgrounds (shows as black on some platforms)
- Forget alt text in `<img>` tag

### Image URL Requirements

```html
<!-- ✅ Good: Absolute URL, HTTPS -->
<meta property="og:image" content="https://example.com/images/article-og.jpg">

<!-- ❌ Bad: Relative URL -->
<meta property="og:image" content="/images/article-og.jpg">

<!-- ❌ Bad: HTTP (not HTTPS) -->
<meta property="og:image" content="http://example.com/images/article-og.jpg">
```

### Image Metadata (Optional but Recommended)

```html
<meta property="og:image" content="https://example.com/images/article-og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="SEO Guide 2026 cover image showing analytics dashboard">
```

---

## Content Type Reference

| og:type | Use Case | Required Properties |
|---------|----------|---------------------|
| `website` | Homepage, general pages | title, description, image, url |
| `article` | Blog posts, news | + published_time, author, section |
| `product` | E-commerce products | + price:amount, price:currency, availability |
| `video.other` | Video content | + video, video:type |
| `music.song` | Music tracks | + audio, duration |
| `book` | Books, publications | + isbn, author, release_date |
| `profile` | Personal profiles | + first_name, last_name, username |

---

## Testing & Validation

### Facebook Sharing Debugger

```bash
URL: https://developers.facebook.com/tools/debug/

Steps:
1. Paste your URL
2. Click "Debug"
3. Check all OG tags are detected
4. Click "Scrape Again" to refresh cache
5. Preview how it appears in feed
```

### LinkedIn Post Inspector

```bash
URL: https://www.linkedin.com/post-inspector/

Steps:
1. Paste your URL
2. Click "Inspect"
3. Verify preview appearance
4. Clear cache if needed
```

### Discord Embed Tester

```bash
# Paste URL in any Discord channel
# Check preview appearance
# If wrong, update OG tags and wait 24h or use Discord cache bypass
```

### Generic OG Testing

```bash
# Open Graph Checker
https://www.opengraph.xyz/

# Meta Tags Preview
https://metatags.io/
```

---

## Common Issues & Fixes

### Issue 1: Wrong Image Displayed

**Cause**: Facebook/LinkedIn cached old image

**Fix**:
```bash
1. Update og:image URL
2. Go to Facebook Debugger
3. Click "Scrape Again"
4. Wait 24 hours for full cache clear
```

### Issue 2: No Preview Shown

**Cause**: Missing required OG tags

**Fix**: Add minimum 4 tags:
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
```

### Issue 3: Image Cropped Badly

**Cause**: Wrong aspect ratio

**Fix**: Use **1200x630px** (1.91:1 ratio)

### Issue 4: Duplicate og:image Tags

**Cause**: Multiple OG image tags (intentional for galleries)

**Fix**: If ONE image intended, remove duplicates

---

## Multi-Language Sites

```html
<!-- French version -->
<meta property="og:locale" content="fr_FR">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:locale:alternate" content="de_DE">

<!-- Use hreflang for URL variants -->
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page">
```

---

## Complete Template (Copy-Paste)

```html
<!-- Open Graph Tags -->
<meta property="og:title" content="Your Page Title (60-90 chars)">
<meta property="og:description" content="Your description here (150-200 chars)">
<meta property="og:image" content="https://example.com/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Image description for accessibility">
<meta property="og:url" content="https://example.com/your-page">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Your Site Name">
<meta property="og:locale" content="fr_FR">

<!-- Article-specific (if applicable) -->
<meta property="article:published_time" content="2026-01-18T10:00:00+00:00">
<meta property="article:author" content="Author Name">
<meta property="article:section" content="Category">
<meta property="article:tag" content="Tag1">
<meta property="article:tag" content="Tag2">
```

---

## Resources

- **Official Spec**: https://ogp.me/
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/
- **Testing Tool**: https://www.opengraph.xyz/
