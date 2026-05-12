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
