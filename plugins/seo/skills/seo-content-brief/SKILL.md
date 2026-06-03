---
name: seo-content-brief
description: Use when generating detailed SEO content briefs. Covers target keywords, search intent, outline (H2/H3), word count, internal links, schema requirements, GEO readiness checklist.
user-invocable: false
related-skills: seo, seo-content, seo-cluster, seo-geo, seo-entity
---

# Content Brief Generator

## Content Intelligence First

Before generating a brief, run `scripts/analyze-keywords.ts` (local-first, no API key) on the target or a top competitor URL. Use the result to shape target keywords, semantic variants, heading coverage, local modifiers, and stuffing warnings.

```bash
bun run scripts/analyze-keywords.ts <url-or-path> --keyword "<primary keyword>" --synonyms "<syn1,syn2>" --locations "<city1,city2>" --format markdown
```

## Metadata and Heading Rules

- Meta title must be 60 characters or less.
- Meta description must be 150 characters or less.
- Do not include the company or brand name in the meta title unless the client explicitly asks. If useful, provide a branded variant as an option or exception.
- Meta title and H1 should be semantically similar, but not necessarily identical.
- Meta title and H1 need the primary keyword or a strong variant.
- H2/H3 headings should distribute synonyms, long-tail phrases, questions, and sub-intents.
- Avoid repeating the exact keyword across every heading.

## Long-Tail by Buyer State (2026)

Layer keywords by buyer state, not by surface similarity:

| Layer | State | Intent signal | Example phrasing |
|-------|-------|---------------|------------------|
| **L1** | Awareness | "what is", "why", symptoms, problems | broad informational, conversational |
| **L2** | Comparison | "vs", "alternatives", "best for" | options weighing |
| **L3** | Evaluation | "pricing", "reviews", "is X worth it" | scrutiny, objections |
| **L4** | Decision | "buy", "near me", "demo", "signup" | transactional/local |

One brief targets one buyer state per URL. Cluster by buyer state + intent, never by lexical surface similarity.

### Citation eligibility

AI Overviews capture ~30-60% of the informational CTR. Optimize for **verbatim LLM extraction**, not raw traffic alone: every section must yield a self-contained, quotable answer. A brief that ranks but is not extractable loses the AI Overview slot.

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
- Meta title: <primary keyword or strong variant, <=60 chars, no brand unless requested>
- Meta description: <benefit + intent match, <=150 chars>
- H1: <semantic match to title, primary keyword or strong variant>
- H2: <synonym, long-tail phrase, question, or sub-intent>
  - H3: <supporting sub-intent>
- H2: <section 2>
- H2: FAQ
- H2: Conclusion

## Answer Capsules (per H2)
<40-60 word self-contained answer opening EACH H2, not only the first 100 words — citation-eligible for AI Overviews>

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
- Answer capsule (40-60 words) opening every H2
- One hyperlinked statistic to its primary source every 150-200 words
- Name key entities explicitly (no pronouns for the primary entity)
- Cite 3-5 authoritative sources
- Use tables/lists for comparison data
```

## References

- `seo-geo` — AI Overviews / LLM readiness
- `seo-content` — copywriting 2026 (answer capsules, named entities)
- `seo-entity` — entity salience and knowledge graph
- `skills/seo/04-geo-2026/content-structure.md`
- `skills/seo/06-content-strategy/keyword-research.md`
