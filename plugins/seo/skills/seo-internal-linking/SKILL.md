---
name: seo-internal-linking
description: Use when designing internal linking strategy. Covers pillar/cluster architecture, anchor text optimization, link distribution, orphan page detection, click depth, broken link audit.
user-invocable: false
related-skills: seo, seo-cluster, seo-content
---

# Internal Linking

## Pillar/Cluster Model

- **Pillar page**: broad topic, targets head keyword (e.g. "SEO Guide")
- **Cluster pages**: subtopics, target long-tail (e.g. "SEO meta tags", "SEO schema")
- Cluster pages link **up** to pillar
- Pillar links **down** to all cluster pages
- Cluster pages cross-link contextually

## Anchor Text Rules

- ✅ Descriptive, varied, natural ("learn how to validate JSON-LD")
- ❌ Generic ("click here", "read more")
- ❌ Over-optimized exact match (looks spammy, can trigger penalties)

## Local vs Global Architecture (2026)

URL structure (placeholders, no real city):

```
/services/[service]/              → global pillar — primary "[service]", NO city in title/H1
/zones-intervention/[region]/     → regional hub — groups the local pages, owns "[service] [region]"
/zones-intervention/[city]/       → local page — Map Pack target, owns "[service] [city]"
```

Link mesh:

- Global pillar `/services/[service]/` → down to each local page with a **geo-specific anchor** ("[service] in [city]"), and each local page → back up to the pillar.
- Regional hub `/zones-intervention/[region]/` → down to its city pages, and back up.
- Keep navigation/footer lean: link the hub, not a grid of every city (a city footer grid dilutes PageRank and triggers near-duplicate suppression).

**Anti-cannibalization (local/global)**: the primary keyword is exclusive per page — pillar = `[service]` (no city), local = `[service] [city]`. See `seo-cluster` for the one-intent-one-URL rule and when to split.

### Doorway pages — quality, not a number

Doorway risk is a quality judgement, not an absolute page-count threshold. One local page per documented presence/service area, each differentiable on **>= 3-4 dimensions** (local testimonials, local FAQ, geo context, area-specific services/hours). Risk signal: **70-90% identical content** across local pages (templated city-name swap) → near-duplicate suppression.

## Audits

- **Orphan pages**: pages with 0 internal incoming links
- **Click depth**: every page reachable in ≤ 3 clicks from homepage
- **Link distribution**: no page concentrates >10% of internal links
- **Broken internal links**: 404s within site

## Workflow

1. Crawl site (cheerio + breadth-first)
2. Build link graph (page → outgoing links)
3. Compute click depth from homepage
4. Detect orphans and dead ends
5. Suggest contextual link insertions based on topic clusters
