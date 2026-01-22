---
name: meta-tags
description: Meta tags optimization guide
---

# Meta Tags Optimization

**Complete guide for HTML meta tags (title, description, canonical, robots).**

## Meta Title

### Rules 2026
- **Length**: 50-60 characters (Google displays ~60)
- **Keyword position**: Primary keyword in first 30 chars
- **Format**: `[Primary Keyword]: [Benefit] | [Brand]`
- **Uniqueness**: Every page must have unique title

### Examples

```html
<!-- Good -->
<title>SEO Guide 2026: 47 Proven Techniques | AgencySEO</title>
<!-- Length: 55 chars, keyword at start, clear benefit -->

<!-- Bad -->
<title>Welcome to Our Website - Home Page</title>
<!-- No keyword, no benefit, generic -->
```

### Title Formulas

| Intent | Formula | Example |
|--------|---------|---------|
| **Informational** | `How to [Action]: [Benefit] ([Year])` | `How to Optimize SEO: Complete Guide (2026)` |
| **Transactional** | `Buy [Product]: [USP] | [Brand]` | `Buy SEO Services: 100% White-Hat | AgencySEO` |
| **Navigational** | `[Brand]: [Service] in [Location]` | `AgencySEO: SEO Consultant in Paris` |
| **Commercial** | `[Number] Best [Product] ([Year])` | `10 Best SEO Tools (2026 Comparison)` |

### Testing

```bash
# Check title length
echo -n "Your Title Here" | wc -c

# Preview in SERP (Google truncates at ~60 chars)
# Use: https://www.portent.com/serp-preview-tool/
```

---

## Meta Description

### Rules 2026
- **Length**: 120-155 characters (Google displays ~155)
- **Format**: `[Hook] + [Benefit] + [CTA]`
- **Keywords**: Include primary + 1-2 secondary (naturally)
- **Uniqueness**: Every page must have unique description
- **No duplication**: Don't repeat title content

### Examples

```html
<!-- Good -->
<meta name="description" content="Discover 2026 SEO best practices: E-E-A-T compliance, Core Web Vitals, and AI optimization. Download our free checklist.">
<!-- Length: 147 chars, hook + benefit + CTA -->

<!-- Bad -->
<meta name="description" content="SEO Guide">
<!-- Too short, no value, no CTA -->
```

### Description Formulas

| Intent | Formula | Example |
|--------|---------|---------|
| **Guide** | `Learn [topic]. Includes [benefit]. [CTA].` | `Learn SEO optimization. Includes 47 techniques tested in 2026. Download now.` |
| **Product** | `[Product] offers [USP]. [Social proof]. [CTA].` | `Our SEO tool offers real-time tracking. Trusted by 10K+ agencies. Try free.` |
| **Local** | `[Service] in [Location]. [USP]. [CTA].` | `SEO consultant in Paris. 15 years experience. Get free audit.` |

### Character Count Tool

```javascript
// Count description length
const desc = "Your meta description here";
console.log(desc.length); // Should be 120-155
```

---

## Canonical Tag

### Purpose
- Prevent duplicate content issues
- Consolidate ranking signals
- Specify preferred URL version

### Rules 2026
- **Self-referencing**: Every page should have canonical (even if unique)
- **Absolute URLs**: Always use full URL (https://example.com/page)
- **Consistency**: Match with sitemap and internal links

### Examples

```html
<!-- Standard (self-referencing) -->
<link rel="canonical" href="https://example.com/seo-guide-2026">

<!-- Product variations (point to main) -->
<!-- Page: /product?color=red&size=large -->
<link rel="canonical" href="https://example.com/product">

<!-- Pagination (point to main or use rel="prev/next") -->
<!-- Page: /blog?page=2 -->
<link rel="canonical" href="https://example.com/blog">
```

### Common Scenarios

| Scenario | Solution |
|----------|----------|
| **HTTP vs HTTPS** | Canonical to HTTPS version |
| **www vs non-www** | Choose one, canonical to it |
| **Trailing slash** | Choose one convention |
| **URL parameters** | Canonical to clean version |
| **Pagination** | Use `rel="prev"` + `rel="next"` OR canonical to page 1 |
| **Mobile version** | Canonical from m.example.com to www.example.com |

---

## Robots Meta Tag

### Purpose
- Control indexing and following links
- Page-specific crawler directives

### Directives 2026

```html
<!-- Allow indexing and following (default) -->
<meta name="robots" content="index, follow">

<!-- Prevent indexing (staging, thank-you pages) -->
<meta name="robots" content="noindex, follow">

<!-- Prevent following links (low-quality outbound) -->
<meta name="robots" content="index, nofollow">

<!-- Block everything (login, admin pages) -->
<meta name="robots" content="noindex, nofollow">

<!-- Advanced directives -->
<meta name="robots" content="noarchive, noimageindex, nosnippet">
```

### Use Cases

| Page Type | Directive | Reason |
|-----------|-----------|--------|
| **Public content** | `index, follow` | Default, allow crawling |
| **Thank you pages** | `noindex, follow` | Avoid thin content, keep link juice |
| **Staging environment** | `noindex, nofollow` | Prevent duplicate content |
| **Login/Register** | `noindex, nofollow` | No search value |
| **Printer version** | `noindex, follow` | Duplicate of main content |
| **Internal search** | `noindex, follow` | Dynamic, no value |

### Advanced Directives

```html
<!-- Prevent Google cache -->
<meta name="robots" content="noarchive">

<!-- Prevent snippet in SERP (show title only) -->
<meta name="robots" content="nosnippet">

<!-- Prevent image indexing -->
<meta name="robots" content="noimageindex">

<!-- Max snippet length -->
<meta name="robots" content="max-snippet:150">

<!-- Max video preview -->
<meta name="robots" content="max-video-preview:30">

<!-- Googlebot-specific -->
<meta name="googlebot" content="index, follow">
```

---

## Viewport (Mobile-First 2026)

```html
<!-- Required for mobile-first indexing -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## Language & Charset

```html
<!-- Always UTF-8 -->
<meta charset="UTF-8">

<!-- Language declaration (for multi-lang sites) -->
<html lang="fr">
<meta http-equiv="Content-Language" content="fr">
```

---

## Complete Meta Tags Template

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO Meta Tags -->
  <title>SEO Guide 2026: 47 Proven Techniques | AgencySEO</title>
  <meta name="description" content="Discover 2026 SEO best practices: E-E-A-T compliance, Core Web Vitals, and AI optimization. Download our free checklist.">
  <link rel="canonical" href="https://example.com/seo-guide-2026">
  <meta name="robots" content="index, follow">

  <!-- Open Graph (see open-graph.md) -->
  <meta property="og:title" content="SEO Guide 2026: 47 Proven Techniques">
  <meta property="og:description" content="Discover 2026 SEO best practices: E-E-A-T compliance, Core Web Vitals, and AI optimization.">
  <meta property="og:image" content="https://example.com/images/seo-guide-og.jpg">
  <meta property="og:url" content="https://example.com/seo-guide-2026">
  <meta property="og:type" content="article">

  <!-- Twitter Card (see twitter-cards.md) -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="SEO Guide 2026: 47 Proven Techniques">
  <meta name="twitter:description" content="Discover 2026 SEO best practices: E-E-A-T compliance, Core Web Vitals, and AI optimization.">
  <meta name="twitter:image" content="https://example.com/images/seo-guide-twitter.jpg">
</head>
<body>
  <!-- Content -->
</body>
</html>
```

---

## Validation Tools

```bash
# Check all meta tags
- Google Rich Results Test: https://search.google.com/test/rich-results
- Meta Tags Checker: https://metatags.io/
- SERP Preview: https://www.portent.com/serp-preview-tool/

# Bulk check
- Screaming Frog SEO Spider (check missing/duplicate meta)
```

---

## Common Mistakes

❌ **Title too long** (>60 chars) - Gets truncated in SERP
❌ **Duplicate titles/descriptions** - Confuses search engines
❌ **Missing canonical** - Potential duplicate content
❌ **Keyword stuffing in meta** - Looks spammy, no benefit
❌ **Generic descriptions** - Low CTR, wasted opportunity
❌ **Wrong robots directive** - Accidentally noindex important pages
