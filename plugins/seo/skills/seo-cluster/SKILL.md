---
name: seo-cluster
description: Use when building semantic keyword clusters from SERP overlap. Covers seed keyword expansion, Jaccard SERP overlap, intent grouping, pillar/cluster content architecture.
user-invocable: false
related-skills: seo, seo-internal-linking, seo-content, seo-content-brief
---

# Semantic Clustering

## Method

1. Take seed keyword (e.g. "claude code")
2. Fetch SERP for seed via WebFetch/Playwright (top 10 results)
3. For each related keyword (autocomplete + "People Also Ask"):
   - Fetch its SERP
   - Compute overlap with seed's SERP (Jaccard index)
4. Group keywords where SERP overlap ≥ 30% → same cluster
5. Cluster center = highest-volume keyword

## Output

```markdown
# Cluster: "claude code"

## Pillar: claude code (vol: 12K, KD: 45)
- Intent: informational
- Featured: AI Overview, video

## Cluster pages
1. claude code installation (vol: 2.4K)
2. claude code vs cursor (vol: 1.8K)
3. claude code mcp servers (vol: 900)
4. claude code hooks (vol: 720)
```

## Anti-Cannibalization Check

Before creating cluster pages, verify no existing page targets same intent. Use `seo-content` skill.
