---
name: header-structure
description: Header structure and hierarchy guide
---

# Header Structure (H1-H6 Hierarchy)

**Complete guide for semantic HTML heading hierarchy (2026 best practices).**

## Why Header Structure Matters

1. **SEO**: Search engines use headers to understand page structure
2. **Accessibility**: Screen readers use headers for navigation
3. **User Experience**: Clear hierarchy improves scannability
4. **AI/GEO**: LLMs extract information based on header context

---

## The Rules (MANDATORY)

### ✅ DO

1. **One H1 per page** (page title)
2. **Logical hierarchy** (H1 → H2 → H3 → H4, NO SKIPPING)
3. **Include keywords** in H2/H3 (natural placement)
4. **Descriptive text** (not "Introduction", but "What is SEO?")
5. **Short and scannable** (3-10 words)

### ❌ DON'T

1. Skip levels (H2 → H4)
2. Multiple H1s on one page
3. Use headers for styling (use CSS instead)
4. Keyword stuff headers
5. Generic headers ("More Information")

---

## Hierarchy Example

```html
<h1>SEO Guide 2026: Complete Beginner's Tutorial</h1>

  <h2>What is SEO?</h2>
    <h3>Technical SEO Definition</h3>
    <h3>Why SEO Matters in 2026</h3>

  <h2>Keyword Research</h2>
    <h3>Finding Keywords</h3>
      <h4>Using Google Keyword Planner</h4>
      <h4>Using Ahrefs</h4>
    <h3>Analyzing Search Intent</h3>
      <h4>Informational Intent</h4>
      <h4>Transactional Intent</h4>

  <h2>On-Page SEO</h2>
    <h3>Meta Tags Optimization</h3>
    <h3>Header Structure</h3>
    <h3>Internal Linking</h3>

  <h2>FAQ</h2>
    <h3>How long does SEO take?</h3>
    <h3>What is E-E-A-T?</h3>
```

---

## H1: Page Title

**Rules**:
- **One per page** (critical)
- **Match meta title** (or be very similar)
- **Include primary keyword**
- **50-70 characters** (readable, not SEO limit)

```html
<!-- ✅ Good H1 -->
<h1>How to Optimize Core Web Vitals in 2026</h1>

<!-- ❌ Bad H1 -->
<h1>Welcome</h1> <!-- Too generic -->
<h1>Core Web Vitals Optimization Guide 2026: Complete Tutorial for Beginners and Advanced Users</h1> <!-- Too long -->
```

### H1 Formulas

| Intent | Formula | Example |
|--------|---------|---------|
| **Guide** | `How to [Action]: [Benefit] ([Year])` | `How to Optimize SEO: Complete Guide (2026)` |
| **List** | `[Number] [Adjective] [Topic] ([Year])` | `10 Best SEO Tools (2026 Comparison)` |
| **Definition** | `What is [Topic]? [Context]` | `What is E-E-A-T? Google's Quality Guidelines` |
| **Comparison** | `[A] vs [B]: [Criteria]` | `SEO vs GEO: Complete Comparison` |

---

## H2: Main Sections

**Rules**:
- **2-6 H2s per page** (typical)
- **Include secondary keywords** (natural)
- **Question format** for FAQ sections
- **Parallel structure** (consistency)

```html
<!-- ✅ Good H2s (parallel structure) -->
<h2>What is Technical SEO?</h2>
<h2>Why is Technical SEO Important?</h2>
<h2>How to Implement Technical SEO</h2>

<!-- ❌ Bad H2s (inconsistent) -->
<h2>Technical SEO</h2>
<h2>It's Important</h2>
<h2>Implementation Tips and Tricks</h2>
```

### H2 for Long-Tail Keywords

```html
<h2>How to improve Core Web Vitals in WordPress?</h2>
<!-- Targets long-tail: "how to improve core web vitals wordpress" -->

<h2>What is the difference between SEO and GEO?</h2>
<!-- Targets: "difference between seo and geo" -->
```

---

## H3: Subsections

**Rules**:
- **Nest under H2** (logical hierarchy)
- **3-8 H3s per H2** (typical)
- **Support H2 topic** (related)

```html
<h2>Keyword Research</h2>
  <h3>Finding Keywords</h3> <!-- Specific subtopic -->
  <h3>Analyzing Competition</h3>
  <h3>Selecting Target Keywords</h3>
```

---

## H4-H6: Deep Subsections

**Rules**:
- **Rare in most content** (H4 ok, H5/H6 uncommon)
- **Only if truly nested** (don't force it)
- **Avoid over-segmentation**

```html
<h2>On-Page SEO</h2>
  <h3>Meta Tags</h3>
    <h4>Title Tag Optimization</h4>
    <h4>Meta Description Best Practices</h4>
  <h3>Header Structure</h3>
    <h4>H1 Rules</h4>
    <h4>H2-H6 Hierarchy</h4>
```

**Note**: Most blog posts use H1-H3 only. H4+ for very detailed guides.

---

## Visual Hierarchy (Table of Contents)

Good header structure enables auto-generated TOC:

```markdown
# SEO Guide 2026 (H1)

## Table of Contents
- [What is SEO?](#what-is-seo)
  - [Technical SEO Definition](#technical-seo-definition)
  - [Why SEO Matters in 2026](#why-seo-matters-in-2026)
- [Keyword Research](#keyword-research)
  - [Finding Keywords](#finding-keywords)
  - [Analyzing Search Intent](#analyzing-search-intent)

## What is SEO? (H2)

### Technical SEO Definition (H3)
...

### Why SEO Matters in 2026 (H3)
...
```

---

## Keyword Placement

### Strategic Keyword Distribution

| Header | Keyword Type | Example |
|--------|--------------|---------|
| **H1** | Primary | "SEO Guide 2026" |
| **H2** | Secondary | "Technical SEO Checklist" |
| **H3** | Long-tail | "How to fix crawl errors in GSC" |
| **H4** | Specific | "301 vs 302 redirects" |

### Density Guidelines

- **H1**: Primary keyword (100%)
- **H2**: 50-75% include secondary keywords
- **H3**: 30-50% include long-tail variations
- **Natural placement** (no forcing)

---

## Common Mistakes

### ❌ Mistake 1: Multiple H1s

```html
<!-- ❌ Bad -->
<h1>SEO Guide</h1>
<h1>Welcome to Our Website</h1>

<!-- ✅ Good -->
<h1>SEO Guide 2026: Complete Tutorial</h1>
<h2>Welcome: What You'll Learn</h2>
```

### ❌ Mistake 2: Skipping Levels

```html
<!-- ❌ Bad -->
<h1>SEO Guide</h1>
<h3>Keyword Research</h3> <!-- Skipped H2 -->

<!-- ✅ Good -->
<h1>SEO Guide</h1>
<h2>Keyword Research</h2>
<h3>Finding Keywords</h3>
```

### ❌ Mistake 3: Headers for Styling

```html
<!-- ❌ Bad (using H3 for small text) -->
<h3 class="small-gray-text">Posted on January 15, 2026</h3>

<!-- ✅ Good (use CSS for styling) -->
<p class="post-meta">Posted on January 15, 2026</p>
```

### ❌ Mistake 4: Keyword Stuffing

```html
<!-- ❌ Bad -->
<h2>SEO Guide 2026 - SEO Best Practices - SEO Tutorial</h2>

<!-- ✅ Good -->
<h2>SEO Best Practices for 2026</h2>
```

---

## Accessibility (WCAG 2.2)

Headers are critical for screen readers:

```html
<!-- ✅ Accessible structure -->
<h1>Main Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>

<!-- Screen reader navigation:
"Heading level 1: Main Page Title"
"Heading level 2: Section 1"
"Heading level 3: Subsection 1.1"
-->
```

---

## Testing & Validation

### Manual Check

```bash
# Chrome DevTools
1. Right-click page
2. Inspect
3. Elements tab
4. Search for <h1>, <h2>, etc.
5. Verify hierarchy

# Keyboard navigation (accessibility test)
Press Tab key → Should skip through headers logically
```

### Automated Tools

```bash
# HeadingsMap (Chrome Extension)
https://chrome.google.com/webstore/detail/headingsmap/

# WAVE (Web Accessibility Evaluation)
https://wave.webaim.org/

# Screaming Frog SEO Spider
Download → Crawl site → Check H1, H2 columns
```

### Checklist

- [ ] Exactly ONE H1 per page
- [ ] H1 contains primary keyword
- [ ] No skipped levels (H1→H2→H3, not H1→H3)
- [ ] H2s include secondary keywords (naturally)
- [ ] Headers are descriptive (not generic)
- [ ] Parallel structure in H2s
- [ ] Total header count: 5-15 (typical)

---

## AI/GEO Optimization

**LLMs extract content based on headers**:

```html
<!-- ✅ AI-friendly (clear structure) -->
<h2>What is E-E-A-T?</h2>
<p>E-E-A-T stands for Experience, Expertise, Authoritativeness, Trust...</p>

<h2>Why is E-E-A-T Important?</h2>
<p>E-E-A-T is critical because...</p>

<!-- AI can extract clean Q&A pairs -->
```

**Best for AI citation**:
- Question-format H2s/H3s
- Clear, standalone sections
- Concise answers after headers

---

## Header Templates

### Blog Post Template

```html
<h1>Main Article Title</h1>
<h2>Introduction: What You'll Learn</h2>
<h2>Section 1 Topic</h2>
  <h3>Subtopic 1.1</h3>
  <h3>Subtopic 1.2</h3>
<h2>Section 2 Topic</h2>
  <h3>Subtopic 2.1</h3>
<h2>FAQ</h2>
  <h3>Question 1?</h3>
  <h3>Question 2?</h3>
<h2>Conclusion</h2>
```

### Product Page Template

```html
<h1>Product Name: One-Line Description</h1>
<h2>Features</h2>
<h2>Specifications</h2>
  <h3>Technical Specs</h3>
  <h3>Dimensions</h3>
<h2>Pricing</h2>
<h2>Customer Reviews</h2>
<h2>FAQ</h2>
  <h3>How does it work?</h3>
  <h3>What's included?</h3>
```

### Local Business Template

```html
<h1>Business Name: Service in City</h1>
<h2>Services Offered</h2>
  <h3>Service 1</h3>
  <h3>Service 2</h3>
<h2>About Us</h2>
<h2>Service Area</h2>
<h2>Contact Information</h2>
```

---

## Resources

- **W3C HTML Spec**: https://www.w3.org/TR/html52/sections.html#the-h1-h2-h3-h4-h5-and-h6-elements
- **Google Search Central**: https://developers.google.com/search/docs/appearance/structured-data
- **WCAG 2.2 Guidelines**: https://www.w3.org/WAI/WCAG22/quickref/#headings-and-labels
