# Image Alt Text Optimization

**Complete guide for writing SEO-friendly and accessible image alt text (2026).**

## Why Alt Text Matters

1. **Accessibility** (WCAG 2.2): Screen readers read alt text to blind users
2. **SEO**: Google Images uses alt text for ranking
3. **AI/GEO**: LLMs extract image context from alt text
4. **Fallback**: Displays if image fails to load
5. **Legal Compliance**: ADA, Section 508 requirements

---

## The Alt Text Formula

```html
<img src="image.jpg" alt="[What is shown] + [Contextual keyword]">
```

**Components**:
1. **Visual description** (what's IN the image)
2. **Contextual keyword** (relevant to page topic)
3. **Keep under 125 characters** (screen readers)

---

## Examples by Image Type

### Product Images

```html
<!-- ❌ Bad -->
<img src="shoe.jpg" alt="shoe">

<!-- ✅ Good -->
<img src="nike-air-max-90-white.jpg" alt="Nike Air Max 90 sneakers in white leather with red swoosh logo">
```

### Screenshots/Dashboards

```html
<!-- ❌ Bad -->
<img src="dashboard.jpg" alt="screenshot">

<!-- ✅ Good -->
<img src="analytics-dashboard.jpg" alt="Google Analytics dashboard showing 50K monthly visitors and 2.3% conversion rate">
```

### Infographics

```html
<!-- ❌ Bad -->
<img src="infographic.jpg" alt="infographic about SEO">

<!-- ✅ Good -->
<img src="seo-stats-2026.jpg" alt="Infographic showing 60% of searches are zero-click and AI Overviews appear on 16% of queries">
```

### Charts/Graphs

```html
<!-- ❌ Bad -->
<img src="chart.jpg" alt="chart">

<!-- ✅ Good -->
<img src="traffic-growth.jpg" alt="Line chart showing organic traffic growth from 10K to 100K visitors over 12 months">
```

### People/Team Photos

```html
<!-- ❌ Bad -->
<img src="team.jpg" alt="our team">

<!-- ✅ Good -->
<img src="founder-jean-dupont.jpg" alt="Jean Dupont, SEO consultant and founder of AgencySEO, working at desk">
```

### Decorative Images

```html
<!-- ❌ Bad -->
<img src="divider.jpg" alt="line">

<!-- ✅ Good (empty alt for decorative) -->
<img src="decorative-divider.svg" alt="">
<!-- Or use CSS background-image instead -->
```

### Logo Images

```html
<!-- ❌ Bad -->
<img src="logo.jpg" alt="logo">

<!-- ✅ Good -->
<img src="agency-seo-logo.svg" alt="AgencySEO - Professional SEO Services">
```

### Icons (UI Elements)

```html
<!-- ❌ Bad -->
<img src="search.svg" alt="icon">

<!-- ✅ Good -->
<img src="search-icon.svg" alt="Search">
<!-- Or better: use aria-label on button -->
<button aria-label="Search the site">
  <img src="search-icon.svg" alt="">
</button>
```

---

## Alt Text Rules

### ✅ DO

1. **Be descriptive** (what's in the image)
2. **Include keywords** (naturally, when relevant)
3. **Keep under 125 chars** (screen reader limit)
4. **Mention data/stats** if in image (charts, infographics)
5. **Empty alt=""** for purely decorative images
6. **Write naturally** (as if describing to someone)

### ❌ DON'T

1. Start with "image of" or "picture of" (redundant)
2. Keyword stuff ("SEO SEO SEO optimization")
3. Duplicate caption text (provide unique value)
4. Exceed 125 characters (gets cut off)
5. Use generic text ("image", "photo", "screenshot")
6. Leave alt attribute empty on meaningful images

---

## Character Limits

| Platform | Character Limit | Truncation |
|----------|-----------------|------------|
| **Screen readers** | ~125 chars | Cuts off at 125 |
| **Google Images** | ~16 words | Shows in image search |
| **HTML spec** | No limit | But keep reasonable |

**Best Practice**: Stay under **125 characters** for universal compatibility.

---

## Keyword Placement

### Strategic Use

```html
<!-- Page about "Core Web Vitals optimization" -->

<!-- ✅ Good (keyword in context) -->
<img src="cwv-score.jpg" alt="Core Web Vitals report showing LCP 2.1s, INP 150ms, CLS 0.05">

<!-- ❌ Bad (keyword stuffing) -->
<img src="cwv.jpg" alt="Core Web Vitals Core Web Vitals optimization Core Web Vitals guide">
```

### Multiple Images on Page

Vary keywords across images (don't repeat exact phrase):

```html
<!-- Image 1 -->
<img src="seo-checklist.jpg" alt="SEO audit checklist with 50 optimization tasks">

<!-- Image 2 -->
<img src="keyword-research.jpg" alt="Ahrefs keyword research tool showing search volume data">

<!-- Image 3 -->
<img src="backlink-profile.jpg" alt="Backlink analysis report with domain authority 65">
```

---

## Special Cases

### CMS/E-commerce Auto-Generated Alt Text

```html
<!-- ❌ Bad (auto-generated from filename) -->
<img src="product_image_12345_v2_final.jpg" alt="product_image_12345_v2_final">

<!-- ✅ Good (override with descriptive alt) -->
<img src="product_image_12345_v2_final.jpg" alt="Nike Air Max 90 white leather sneakers size 42">
```

### Multiple Product Views

```html
<!-- Front view -->
<img src="shoe-front.jpg" alt="Nike Air Max 90 white sneakers front view">

<!-- Side view -->
<img src="shoe-side.jpg" alt="Nike Air Max 90 white sneakers side profile showing red swoosh">

<!-- Back view -->
<img src="shoe-back.jpg" alt="Nike Air Max 90 white sneakers back view with Nike logo">
```

### Image Galleries

```html
<!-- ❌ Bad (all same alt text) -->
<img src="gallery-1.jpg" alt="office">
<img src="gallery-2.jpg" alt="office">
<img src="gallery-3.jpg" alt="office">

<!-- ✅ Good (unique descriptions) -->
<img src="office-reception.jpg" alt="Modern office reception area with minimalist design">
<img src="office-workspace.jpg" alt="Open-plan workspace with standing desks and natural light">
<img src="office-meeting.jpg" alt="Glass-walled meeting room with video conferencing setup">
```

### Images with Text Overlay

**Include text in alt**:

```html
<!-- Image has text "50% OFF SALE" -->
<img src="sale-banner.jpg" alt="50% off sale banner for SEO tools ending January 31st">
```

---

## Empty Alt Text (Decorative)

**When to use `alt=""`**:

1. **Decorative elements** (borders, dividers, backgrounds)
2. **Icons with adjacent text** (redundant)
3. **Spacer images** (layout only)

```html
<!-- ✅ Decorative divider -->
<img src="fancy-divider.svg" alt="">

<!-- ✅ Icon with adjacent text -->
<img src="checkmark.svg" alt=""> Yes, we offer free shipping

<!-- ❌ Bad (meaningful icon) -->
<button>
  <img src="download.svg" alt=""> <!-- Should have alt="Download" -->
</button>
```

---

## Accessibility Best Practices

### Complex Images (Longdesc)

For complex charts/diagrams, use `longdesc` or adjacent text:

```html
<!-- Option 1: Adjacent text description -->
<img src="complex-chart.jpg" alt="SEO traffic trends 2020-2026">
<p id="chart-desc">
  This chart shows organic traffic growth across 6 years.
  Starting at 10K monthly visitors in 2020, traffic grew
  steadily to 100K by 2026, with notable jumps after major
  algorithm updates in March 2023 and September 2025.
</p>

<!-- Option 2: aria-describedby -->
<img src="complex-chart.jpg" alt="SEO traffic trends 2020-2026" aria-describedby="chart-desc">
```

### Informative vs Decorative

| Type | Purpose | Alt Text |
|------|---------|----------|
| **Informative** | Conveys meaning | Descriptive alt required |
| **Decorative** | Visual enhancement | `alt=""` (empty) |
| **Functional** | Clickable/interactive | Describe function (e.g., "Search") |

---

## Google Images SEO

Alt text is **#1 ranking factor** for Google Images:

### Optimization Checklist

- [ ] Descriptive alt text (under 125 chars)
- [ ] Keyword included (naturally)
- [ ] Image filename descriptive (`core-web-vitals.jpg`, not `IMG_1234.jpg`)
- [ ] Surrounding text relevant
- [ ] Image format optimized (WebP for web)
- [ ] Image size reasonable (<200KB for web)
- [ ] Lazy loading implemented (`loading="lazy"`)

---

## Complete Examples

### Blog Post Featured Image

```html
<img
  src="seo-guide-2026-featured.jpg"
  alt="SEO guide 2026 cover showing search ranking analytics and optimization checklist"
  loading="lazy"
  width="1200"
  height="630"
>
```

### E-commerce Product

```html
<img
  src="macbook-pro-16-space-gray.jpg"
  alt="Apple MacBook Pro 16-inch laptop in space gray with M3 Max chip"
  loading="lazy"
  width="800"
  height="600"
>
```

### Tutorial Screenshot

```html
<img
  src="google-search-console-index-coverage.jpg"
  alt="Google Search Console Index Coverage report showing 1,250 valid pages and 3 errors"
  loading="lazy"
  width="1200"
  height="800"
>
```

---

## Testing & Validation

### Manual Check

```bash
# Chrome DevTools
1. Right-click image
2. Inspect
3. Check <img> tag has alt attribute
4. Verify alt text is descriptive (not empty/generic)
```

### Automated Tools

```bash
# WAVE (Web Accessibility Evaluation)
https://wave.webaim.org/
- Flags missing alt text
- Identifies suspicious alt text

# axe DevTools (Chrome Extension)
https://www.deque.com/axe/devtools/
- Comprehensive accessibility audit

# Screaming Frog SEO Spider
- Bulk check: Images > Missing Alt Text
```

### Screen Reader Test

```bash
# Test with real screen reader
- macOS: VoiceOver (Cmd+F5)
- Windows: NVDA (free) or JAWS
- Navigate page with Tab key
- Verify alt text is read aloud correctly
```

---

## Common Mistakes

### ❌ Mistake 1: "Image of..."

```html
<!-- ❌ Bad -->
<img src="dashboard.jpg" alt="Image of analytics dashboard">

<!-- ✅ Good -->
<img src="dashboard.jpg" alt="Google Analytics dashboard showing traffic metrics">
```

### ❌ Mistake 2: Filename as Alt

```html
<!-- ❌ Bad -->
<img src="IMG_5678.jpg" alt="IMG_5678">

<!-- ✅ Good -->
<img src="team-meeting-2026.jpg" alt="SEO team collaborating on keyword strategy in conference room">
```

### ❌ Mistake 3: Over-Optimization

```html
<!-- ❌ Bad (keyword stuffing) -->
<img src="seo.jpg" alt="SEO optimization SEO services best SEO agency SEO 2026">

<!-- ✅ Good -->
<img src="seo-report.jpg" alt="Monthly SEO performance report showing 45% traffic increase">
```

### ❌ Mistake 4: Empty Alt on Meaningful Images

```html
<!-- ❌ Bad (missing info) -->
<img src="product-bestseller.jpg" alt="">

<!-- ✅ Good -->
<img src="product-bestseller.jpg" alt="Bestseller badge indicating top 10 product in category">
```

---

## Alt Text Checklist

- [ ] All images have `alt` attribute (even if empty)
- [ ] Meaningful images have descriptive alt (not "image")
- [ ] Decorative images have empty alt (`alt=""`)
- [ ] Alt text under 125 characters
- [ ] Keywords included naturally (no stuffing)
- [ ] Alt text unique per image (no duplicates)
- [ ] Doesn't start with "image of" / "picture of"
- [ ] Data/stats mentioned if in image
- [ ] Tested with screen reader

---

## Resources

- **WCAG 2.2 Guidelines**: https://www.w3.org/WAI/WCAG22/quickref/#images-of-text
- **Google Images Best Practices**: https://developers.google.com/search/docs/appearance/google-images
- **WebAIM Alt Text Guide**: https://webaim.org/techniques/alttext/
