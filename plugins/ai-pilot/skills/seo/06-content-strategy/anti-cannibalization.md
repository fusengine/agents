---
name: anti-cannibalization
description: Anti-cannibalization strategy for keywords
---

# Anti-Cannibalization Strategy

**Preventing keyword conflicts between pages.**

## The Problem

```markdown
❌ Bad: Multiple pages targeting "SEO guide"
- /seo-guide
- /complete-seo-guide
- /seo-tutorial
- /seo-guide-2026

Result: Google confused, all rank poorly
```

---

## The Solution

### 1. One Primary Keyword Per Page

```markdown
✅ Good: Unique primary keywords
- /seo-guide → "SEO guide 2026"
- /technical-seo → "technical SEO checklist"
- /local-seo → "local SEO optimization"
- /seo-tools → "best SEO tools"
```

### 2. Keyword Mapping

| Page | Primary Keyword | Secondary Keywords |
|------|-----------------|-------------------|
| /seo-guide | SEO guide 2026 | SEO tutorial, SEO basics |
| /technical-seo | Technical SEO | Crawlability, indexation |
| /local-seo | Local SEO | Google Business Profile |

### 3. Internal Linking

```markdown
# Point all similar pages to MAIN page

Blog post → /seo-guide (main resource)
Old post → 301 redirect to /seo-guide
Related post → Internal link to /seo-guide
```

---

## Detection

```bash
# Google Search Console
site:example.com "SEO guide"

# Check which pages rank for same keyword
# Consolidate or differentiate
```

---

## Fixes

1. **Consolidate**: Merge pages, 301 redirect
2. **Differentiate**: Change keywords, re-optimize
3. **Canonical**: Point duplicates to main version
