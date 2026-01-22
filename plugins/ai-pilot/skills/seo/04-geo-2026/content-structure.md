---
name: content-structure
description: Content structure for AI extraction
---

# Content Structure for AI

**How to format content for LLM extraction and citation.**

## The Inverted Pyramid

```
Quick Answer (100 words)
    ↓
Detailed Explanation (300 words)
    ↓
Comprehensive Guide (1500+ words)
    ↓
Advanced/Expert Content
```

---

## Quick Answer Block (Critical)

**First 100 words** should answer the query completely.

```markdown
# How to Optimize Core Web Vitals

**Quick Answer**: Optimize Core Web Vitals by focusing on three metrics: LCP (Largest Contentful Paint) under 2.5 seconds, INP (Interaction to Next Paint) under 200ms, and CLS (Cumulative Layout Shift) under 0.1. Achieve this through image optimization (WebP format, lazy loading), JavaScript minimization (defer non-critical scripts), and responsive design (fixed dimensions for images/videos). Use PageSpeed Insights to measure progress.

[Rest of detailed content follows...]
```

---

## Section Formatting

### H2: Question Format

```markdown
## What is E-E-A-T?
E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trust...

## Why is E-E-A-T important in 2026?
E-E-A-T is critical because Google's 2025 algorithm update...
```

### Standalone Paragraphs

Each paragraph = extractable unit:

```markdown
Core Web Vitals are Google's user experience metrics. They measure page load speed, interactivity, and visual stability.

LCP (Largest Contentful Paint) measures loading performance. Google recommends LCP under 2.5 seconds for good user experience.

INP (Interaction to Next Paint) measures responsiveness. It replaced FID (First Input Delay) in March 2024.
```

---

## Data Presentation

### Tables for Comparison

| SEO | GEO |
|-----|-----|
| Rankings | Citations |
| Google, Bing | ChatGPT, Gemini |
| 40% effort | 40% effort |

### Lists for Steps

1. **Audit**: Run PageSpeed Insights
2. **Optimize**: Implement fixes
3. **Verify**: Re-test performance

---

## AI-Extractable Patterns

```markdown
**Definition**: [Term] means [explanation]

**Statistic**: [Number]% of [population] [action] ([Source, Year])

**Quote**: "[Direct quote]" ([Name, Title, Year])

**Process**: [Step 1] → [Step 2] → [Step 3]

**Comparison**: [A] vs [B]: [Key differences]
```
