---
name: twitter-cards
description: Twitter/X cards implementation guide
---

# Twitter Cards (X.com 2026)

**Complete implementation guide for Twitter/X Card markup.**

## What are Twitter Cards?

Twitter Cards control how URLs display when shared on:
- **X.com** (formerly Twitter)
- **TweetDeck**
- **Twitter embeds** on other sites

Without Twitter Cards, links show as plain text with no preview.

---

## Card Types

| Type | Use Case | Preview Size |
|------|----------|--------------|
| **summary** | General content, small image | Small square (1:1) |
| **summary_large_image** | **Articles, blogs (RECOMMENDED)** | Large rectangle (2:1) |
| **app** | Mobile app promotions | App store badge |
| **player** | Videos, audio players | Video player embed |

**Recommendation 2026**: Use `summary_large_image` for ALL content (best engagement).

---

## Required Twitter Card Tags (Minimum)

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="SEO Guide 2026: 47 Proven Techniques">
<meta name="twitter:description" content="Discover 2026 SEO best practices: E-E-A-T compliance, Core Web Vitals, and AI optimization.">
<meta name="twitter:image" content="https://example.com/images/seo-guide-twitter.jpg">
```

---

## Complete Implementation

### For Articles/Blog Posts (Recommended)

```html
<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@AgencySEO">
<meta name="twitter:creator" content="@JeanDupont">
<meta name="twitter:title" content="How to Optimize Core Web Vitals in 2026">
<meta name="twitter:description" content="Complete guide to improve LCP, INP, and CLS. Includes 15 actionable techniques tested on 1000+ websites.">
<meta name="twitter:image" content="https://example.com/images/core-web-vitals-twitter.jpg">
<meta name="twitter:image:alt" content="Core Web Vitals dashboard showing perfect scores">
```

### For Products (E-commerce)

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@AgencySEO">
<meta name="twitter:title" content="SEO Pro Tool - Professional SEO Suite">
<meta name="twitter:description" content="All-in-one SEO platform. Keyword tracking, backlink analysis, competitor research. €99/month.">
<meta name="twitter:image" content="https://example.com/images/seo-pro-tool-twitter.jpg">
<meta name="twitter:image:alt" content="SEO Pro Tool dashboard interface">

<!-- Optional: Add pricing info -->
<meta name="twitter:label1" content="Price">
<meta name="twitter:data1" content="€99/month">
<meta name="twitter:label2" content="Availability">
<meta name="twitter:data2" content="In Stock">
```

### For Videos

```html
<meta name="twitter:card" content="player">
<meta name="twitter:site" content="@AgencySEO">
<meta name="twitter:title" content="SEO Tutorial 2026: Complete Beginner's Guide">
<meta name="twitter:description" content="Learn SEO from scratch. 45-minute comprehensive tutorial.">
<meta name="twitter:image" content="https://example.com/images/video-thumbnail.jpg">

<!-- Player-specific -->
<meta name="twitter:player" content="https://example.com/video-player?id=123">
<meta name="twitter:player:width" content="1280">
<meta name="twitter:player:height" content="720">
<meta name="twitter:player:stream" content="https://example.com/videos/seo-tutorial.mp4">
```

### For Apps (Mobile)

```html
<meta name="twitter:card" content="app">
<meta name="twitter:site" content="@AgencySEO">
<meta name="twitter:description" content="The best SEO tool for mobile. Track rankings on the go.">

<!-- iOS App -->
<meta name="twitter:app:name:iphone" content="SEO Pro">
<meta name="twitter:app:id:iphone" content="123456789">
<meta name="twitter:app:url:iphone" content="seopro://open">

<!-- Android App -->
<meta name="twitter:app:name:googleplay" content="SEO Pro">
<meta name="twitter:app:id:googleplay" content="com.example.seopro">
<meta name="twitter:app:url:googleplay" content="seopro://open">
```

---

## Image Guidelines 2026

### Recommended Dimensions

| Card Type | Optimal Size | Ratio | Min Size | Max Size |
|-----------|--------------|-------|----------|----------|
| **summary** | 240x240px | 1:1 | 120x120px | - |
| **summary_large_image** | **1200x628px** | **1.91:1** | 300x157px | 5MB |
| **player** | 1280x720px | 16:9 | - | - |

**Universal Recommendation**: Use **1200x628px** (works for Twitter + Facebook OG).

### Image Best Practices

✅ **DO**:
- Use **1200x628px** JPG or PNG
- File size < 1MB (faster loading)
- Include branding (logo in corner)
- High contrast (white text on dark bg or vice versa)
- Test on mobile (50%+ of Twitter traffic)

❌ **DON'T**:
- Use images < 300x157px (too small)
- Put text too close to edges (gets cropped on mobile)
- Use GIFs (only first frame shows in card)
- Forget `twitter:image:alt` (accessibility)

### Image URL Requirements

```html
<!-- ✅ Good: Absolute URL, HTTPS -->
<meta name="twitter:image" content="https://example.com/images/article-twitter.jpg">

<!-- ❌ Bad: Relative URL -->
<meta name="twitter:image" content="/images/article-twitter.jpg">

<!-- ❌ Bad: HTTP -->
<meta name="twitter:image" content="http://example.com/images/article-twitter.jpg">
```

---

## Tag Reference

### Core Tags

| Tag | Required? | Description | Example |
|-----|-----------|-------------|---------|
| `twitter:card` | **YES** | Card type | `summary_large_image` |
| `twitter:title` | **YES** | Title (70 chars max) | `SEO Guide 2026` |
| `twitter:description` | **YES** | Description (200 chars max) | `Complete SEO guide...` |
| `twitter:image` | **YES** | Image URL (HTTPS, absolute) | `https://...jpg` |

### Optional Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `twitter:site` | Site's Twitter handle | `@AgencySEO` |
| `twitter:creator` | Author's Twitter handle | `@JeanDupont` |
| `twitter:image:alt` | Image alt text (420 chars max) | `SEO dashboard screenshot` |

### Product Tags (E-commerce)

| Tag | Description | Example |
|-----|-------------|---------|
| `twitter:label1` | Custom label 1 | `Price` |
| `twitter:data1` | Custom data 1 | `€99/month` |
| `twitter:label2` | Custom label 2 | `Availability` |
| `twitter:data2` | Custom data 2 | `In Stock` |

---

## Fallback to Open Graph

**Important**: Twitter Cards fallback to Open Graph tags if Twitter tags missing.

```html
<!-- If you have OG tags -->
<meta property="og:title" content="SEO Guide 2026">
<meta property="og:description" content="Complete SEO guide...">
<meta property="og:image" content="https://example.com/images/og.jpg">

<!-- Twitter will use them if twitter:* tags missing -->
<!-- BUT: Still add twitter:card -->
<meta name="twitter:card" content="summary_large_image">
```

**Best Practice**: Define BOTH Open Graph AND Twitter tags for full control.

---

## Testing & Validation

### Twitter Card Validator

```bash
URL: https://cards-dev.twitter.com/validator

Steps:
1. Paste your URL
2. Click "Preview card"
3. Check all tags are detected
4. Verify image displays correctly
5. Test on mobile preview
```

**Note**: Twitter caches cards for ~7 days. To force refresh:
1. Update tags
2. Wait 7 days OR
3. Add URL parameter (e.g., `?v=2`) to force new cache

---

## Twitter vs Open Graph

| Aspect | Twitter Cards | Open Graph |
|--------|---------------|------------|
| **Prefix** | `twitter:` | `og:` |
| **Platform** | X.com, TweetDeck | Facebook, LinkedIn, Discord, Slack |
| **Fallback** | Uses OG if Twitter tags missing | No fallback |
| **Image ratio** | 1.91:1 (1200x628px) | 1.91:1 (1200x630px) |
| **Title length** | 70 chars | 60-90 chars |
| **Desc length** | 200 chars | 150-200 chars |

**Pro Tip**: Use **identical images** (1200x628px) for both Twitter and OG to simplify.

---

## Complete Template (Copy-Paste)

```html
<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@YourHandle">
<meta name="twitter:creator" content="@AuthorHandle">
<meta name="twitter:title" content="Your Page Title (70 chars max)">
<meta name="twitter:description" content="Your description here (200 chars max)">
<meta name="twitter:image" content="https://example.com/images/twitter-card.jpg">
<meta name="twitter:image:alt" content="Image description for accessibility">

<!-- Optional: Product labels -->
<meta name="twitter:label1" content="Category">
<meta name="twitter:data1" content="SEO Tools">
<meta name="twitter:label2" content="Price">
<meta name="twitter:data2" content="€99/month">
```

---

## Common Issues & Fixes

### Issue 1: Card Not Showing

**Cause**: Missing required tags

**Fix**: Add minimum 4 tags:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### Issue 2: Wrong Image Displayed

**Cause**: Twitter cached old image (7-day cache)

**Fix**:
1. Update `twitter:image` URL
2. Add version parameter: `image.jpg?v=2`
3. Wait up to 7 days for cache to clear

### Issue 3: Image Not Loading

**Cause**: Image URL is HTTP (not HTTPS) or relative

**Fix**: Use absolute HTTPS URL:
```html
<meta name="twitter:image" content="https://example.com/images/card.jpg">
```

### Issue 4: Title/Description Truncated

**Cause**: Exceeded character limits

**Fix**:
- Title: Keep under **70 characters**
- Description: Keep under **200 characters**

---

## Multi-Language Sites

```html
<!-- Use same handle for all languages -->
<meta name="twitter:site" content="@AgencySEO">

<!-- Translate title/description per language -->
<!-- French version -->
<meta name="twitter:title" content="Guide SEO 2026: 47 Techniques Éprouvées">
<meta name="twitter:description" content="Découvrez les meilleures pratiques SEO 2026...">

<!-- English version (on /en/ URLs) -->
<meta name="twitter:title" content="SEO Guide 2026: 47 Proven Techniques">
<meta name="twitter:description" content="Discover 2026 SEO best practices...">
```

---

## Analytics Integration

Track Twitter Card clicks in Google Analytics:

```javascript
// UTM parameters for Twitter shares
https://example.com/page?utm_source=twitter&utm_medium=social&utm_campaign=twitter_card

// Or use Twitter's click tracking (auto-generated)
```

---

## Resources

- **Official Spec**: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- **Card Validator**: https://cards-dev.twitter.com/validator
- **Image Size Guide**: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
