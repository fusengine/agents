---
name: seo-content
description: Use when analyzing content quality. Covers E-E-A-T scoring (Experience, Expertise, Authoritativeness, Trustworthiness), anti-cannibalization, keyword distribution, AI content disclosure, search intent matching.
user-invocable: false
related-skills: seo, seo-content-brief, seo-cluster, seo-geo, seo-entity, seo-featured-snippets
---

# Content Quality (E-E-A-T 2026)

## Content Intelligence Workflow

Before content recommendations, run `scripts/analyze-keywords.ts` (local-first, no API key). Use it as first-pass evidence for keyword distribution, semantic breadth, local modifier placement, heading coverage, and stuffing risk.

```bash
bun run scripts/analyze-keywords.ts <url-or-path> --keyword "<primary keyword>" --synonyms "<syn1,syn2>" --locations "<city1,city2>" --format markdown
```

It returns density, n-grams, a 0-100 stuffing score, heading coverage, and per-location contextual mentions — purely local HTML parsing.

## E-E-A-T Pillars

- **Experience**: First-hand knowledge signals (case studies, photos, "I tried...")
- **Expertise**: Author credentials, depth, technical accuracy
- **Authoritativeness**: Industry recognition, citations, backlinks
- **Trustworthiness**: Contact info, HTTPS, transparent ownership, fact-checking

## Anti-Cannibalization

- One primary keyword per URL
- Different search intents per page (info / navigational / transactional)
- Internal linking respects pillar/cluster topology

## Metadata and Heading Rules

- Meta title must be 60 characters or less.
- Meta description must be 150 characters or less.
- Do not include the company or brand name in the meta title unless the client explicitly asks. If needed, present a branded title as an option or exception.
- Meta title and H1 should be semantically similar, but not necessarily identical.
- Meta title and H1 need the primary keyword or a strong variant.
- H2/H3 headings distribute synonyms, long-tail phrases, questions, and sub-intents.
- Avoid repeating the exact keyword across every heading.

## Local Semantic Distribution

- The client's target localities (primary `[city]` + neighbouring municipalities/`[region]`) must appear naturally near service terms, never as a dumped city list.
- Prefer sentence-level relevance such as `[service]` + `[city]` + proof or context.
- On a LOCAL page, alternate `[city]` with `[region]` and district/neighbourhood names instead of repeating the same city token.

## Keyword Distribution by Zone

Place terms by page zone, not by hitting a density target. Anti-stuffing 2026 is multi-signal, not a fixed percentage (Google's leaked `KeywordStuffingScore` runs 0-127; risk rises past ~3% density).

| Zone | Primary `[service]` | Local modifier `[city]/[region]` | Synonyms + entities | Secondary terms |
|------|---------------------|----------------------------------|---------------------|-----------------|
| Title / H1 | Yes (exact or strong variant) | Local page only | — | — |
| H2 / H3 | Sparingly (1-2) | Local page only, varied | Yes (distribute) | Yes |
| First 100 words / answer capsule | Yes (once) | Local page: once | Yes | — |
| Body | Natural flow | Local page: spread | Yes (bulk of coverage) | Yes |
| Anchors / alt / meta | Variant | Geo-specific on local | Yes | — |

Reference counts for a 1000-1500 word page:

- **Primary `[service]`**: 5-8 occurrences (~1-1.5% — the sweet spot, never above ~3%).
- **Semantic family (synonyms + named entities)**: 12-18 occurrences — this carries topical depth, not exact repetition.
- **Local modifier `[city]/[region]`**: 4-6 occurrences on a LOCAL page; 1-2 mentions on a GLOBAL page (zone signal, not stuffing). On the local page, rotate `[city]` with `[region]`/district rather than repeating one city.

## Keyword Stuffing Detection

Do not use a fixed `>3%` density threshold as the stuffing rule. Flag keyword stuffing only when multiple signals align:

- Exact keyword repetition
- Repeated n-grams
- Repeated local modifiers
- Low semantic diversity
- Thin content
- Unnatural heading, anchor, or paragraph placement

`scripts/analyze-keywords.ts` computes these signals into a 0-100 stuffing score.

## Copywriting 2026 (citation-eligible writing)

- **Answer capsule per H2**: open *every* H2 with a self-contained 40-60 word answer, not only the page's first 100 words. AI Overviews and LLMs extract per-section; each H2 must stand alone as a quotable verbatim answer.
- **Hyperlinked statistics**: one statistic linked to its primary source every 150-200 words. Naked or undated stats are not citation-eligible.
- **Named entities, not pronouns**: name key entities explicitly (product, person, place, organization) instead of "it", "they", "this tool". LLMs disambiguate by surface entity mentions, not coreference.
- Keep the anti-AI-slop tone: no "In conclusion...", "It's important to note...", no marketing filler.

## AI Content Guidelines

- Disclose AI-assisted content where required
- Human review + first-hand experience injected
- Avoid generic AI-typical structures ("In conclusion...", "It's important to note...")

## Entities and Semantics

For entity-based optimization (knowledge graph alignment, `sameAs`, entity salience, semantic depth), use the `seo-entity` skill. Anchor each page to a primary entity and its attributes rather than to a keyword string alone.

## References

- `seo-entity` — entity SEO, knowledge graph, semantic depth
- `seo-featured-snippets` — answer capsule / position 0 formats
- `skills/seo/06-content-strategy/` (eeat-implementation, anti-cannibalization, ai-content-guidelines, keyword-research, keyword-distribution)
