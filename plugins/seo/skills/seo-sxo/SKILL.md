---
name: seo-sxo
description: Use when optimizing search experience (SXO). Covers intent matching, user personas, user stories, page-type analysis, dwell time, scroll depth, pogo-sticking prevention.
user-invocable: false
related-skills: seo, seo-content, seo-featured-snippets
---

# Search Experience Optimization (SXO)

## Intent Matching (5 layers, 2026)

| Layer | Intent | Expected Page | Key Signals | CTA |
|-------|--------|---------------|-------------|-----|
| L1 | Informational | Guide, tutorial | Quick answer, TOC, depth | Newsletter / next article |
| L2 | Navigational | Homepage, brand page | Logo, navigation, search | Direct link to feature |
| L3 | Commercial | Comparison, reviews | Tables, pros/cons, ratings | Trial / demo / comparator |
| L4 | Transactional | Product, pricing | CTA, price, trust signals | Low-friction purchase |
| L5 | Post-conversion | Docs, FAQ, troubleshoot | Steps, search, error fixes | Support / upsell / community |

- **>80% of queries carry mixed / multi-layer intent** — map the dominant layer, then serve secondary layers below the fold.
- **Conflict rule**: when query modifiers disagree with the live SERP layout, **trust the SERP layout** (it reflects Google's resolved intent).

## Local vs Global Intent (2026)

| Dimension | Local | Global / National |
|-----------|-------|-------------------|
| Dominant intent | Immediate transactional + proximity navigational | Informational + commercial → deferred transactional |
| SERP trigger | Map Pack (3-Pack) + local AI Overviews | Organic results + AI Overviews |
| Behavioural signal | "[service] near me", "[service] [city]", direct call/tap | "[service] reviews", "best [service]", "how to choose [service]" |
| Conversion speed | Fast (ready to act now) | Slow (nurture across buyer journey) |
| AI Overview CTR erosion | Low — Map Pack resists (physical intent can't be answered by AI) | High — informational keywords absorbed (-40% to -58% in 2026) |

- Diagnose intent geography first: a query with implicit local intent must serve a location page + Map Pack assets, not a blog post.
- Protect against erosion: shift global informational pages toward entity signals + structured data so they earn AI citations instead of losing the click.

## User Persona Method

1. Define 2-3 personas (role, goals, pain points)
2. Map each persona to query types they search
3. Build pages addressing their specific intent
4. Validate with user testing (heatmaps, session recordings)

## User Stories Format

```
As a <persona>, I search "<query>" because I need <goal>.
I expect to find <expected content> within <time>.
I'll engage by <action: scroll, click, share, convert>.
```

## SXO Metrics

- **Dwell time**: > 1 minute for informational, > 3 for in-depth guides
- **Scroll depth**: > 50% reach mid-page, > 25% reach bottom
- **Pogo-sticking**: < 10% (users returning to SERP)
- **Click-through (next step)**: > 30% click expected CTA
- **CWV → conversion**: speed is UX — every 1s of extra delay = ~-7% conversions (keep LCP < 2.5s, INP < 200ms)

## Conversion Levers (local transactional pages)

Transactional intent = a **minimum-friction action CTA above the fold**. Answer-first text serves the AI Overview *and* the click; the CTA + proof serve the conversion.

- **Explicit CTA above the fold, repeated** (top + after pricing): "Call now — [phone]" / "Get a free quote".
- **Native click-to-call** `tel:[phone]` — most urgent local traffic is mobile.
- **Urgency / live availability**: "Available now", real-time slots.
- **Friction reduction next to the CTA**: "No commitment · Reply in 2 min · Pay after service".
- **Trust proof glued to the CTA**: rating [x.x]/5 ([n] reviews), warranty/guarantee, license [number].

## Anti-Patterns

- ❌ Above-fold pop-ups (delay 30s+ or scroll-trigger)
- ❌ Wall of text (paragraphs > 4 lines)
- ❌ Generic headlines (specific > clever)
- ❌ Buried answer (quick answer should be in first 100 words)
- ❌ Aggressive selling on an informational page (intent mismatch) — match the CTA to the intent layer
