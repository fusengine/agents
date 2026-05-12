---
name: seo-geo
description: Use when optimizing for AI search engines (Generative Engine Optimization 2026). Covers Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, Copilot, LLM-readiness scoring 0-100, llms.txt.
user-invocable: false
related-skills: seo, seo-content, seo-featured-snippets, seo-schema
---

# GEO — Generative Engine Optimization 2026

## Target Engines

- **Google AI Overviews** (formerly SGE)
- **ChatGPT** with web search
- **Perplexity**
- **Claude** with web search
- **Gemini**
- **Bing Copilot**

## LLM-Readiness Score (0-100)

`scripts/geo-score.ts` checks:

| Signal | Points |
|--------|--------|
| Quick answer in first 100 words | 15 |
| Direct H2 questions ("What is X?") | 10 |
| Tables/lists for comparable data | 10 |
| Citations with dates + sources | 15 |
| Statistics with attribution | 10 |
| Author bio with credentials | 10 |
| Schema.org markup | 10 |
| Updated date < 12 months | 10 |
| llms.txt present | 5 |
| No JS-only content (SSR) | 5 |

## Content Structure for LLMs

```markdown
# <Topic>

**Quick answer** (40-60 words, factual, no fluff)

## What is <topic>?
Definition paragraph...

## Why does it matter?
Stats with sources...

## How to <task>?
Numbered steps...

## Comparison
| X | Y |
|---|---|

## FAQ
- Q: ...
- A: ...
```

## llms.txt

Place at site root: `https://example.com/llms.txt`
```
# Site Name
> One-line description

## Pages
- [Homepage](https://example.com/): description
- [Docs](https://example.com/docs/): description
```

## References

- `skills/seo/04-geo-2026/` (ai-platforms, citation-strategies, content-structure, llm-crawlability, zero-click-optimization)
- `skills/seo/08-measurement/share-of-model.md`
