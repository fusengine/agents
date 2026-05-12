---
name: seo-content-brief
description: Use when generating detailed SEO content briefs. Covers target keywords, search intent, outline (H2/H3), word count, internal links, schema requirements, GEO readiness checklist.
user-invocable: false
related-skills: seo, seo-content, seo-cluster, seo-geo
---

# Content Brief Generator

## Brief Structure

```markdown
# Content Brief: <topic>

## Target Keywords
- Primary: <kw> (vol, KD, intent)
- Secondary: <kw1>, <kw2>, <kw3>
- Long-tail: <lt1>, <lt2>, <lt3>

## Search Intent
- Type: informational | navigational | commercial | transactional
- User question: "<exact question>"
- Expected format: guide | listicle | comparison | tutorial

## Outline
- H1: <title 50-60 chars>
- H2: <section 1>
  - H3: ...
- H2: <section 2>
- H2: FAQ
- H2: Conclusion

## Quick Answer (first 100 words)
<concise answer for AI Overviews / featured snippet>

## Word Count Target
<based on top 10 SERP average>

## Internal Links (5-10)
- → <pillar page>
- → <related cluster pages>

## Schema
- Article + BreadcrumbList (always)
- FAQPage (if FAQ section)
- VideoObject (if video embed)

## GEO Requirements
- Quick answer paragraph in first 100 words
- Cite 3-5 authoritative sources
- Use tables/lists for comparison data
- Include statistics with dates and sources
```

## References

- `skills/seo/04-geo-2026/content-structure.md`
- `skills/seo/06-content-strategy/keyword-research.md`
