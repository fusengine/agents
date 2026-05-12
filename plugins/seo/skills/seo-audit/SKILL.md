---
name: seo-audit
description: Use when running a full-site SEO audit via /seo audit. Covers parallel sub-agent orchestration, business-type detection, SEO Health Score 0-100, prioritized action plan.
user-invocable: false
related-skills: seo, seo-technical, seo-schema, seo-content, seo-geo, seo-images, seo-sitemap
---

# SEO Audit Orchestrator

## Workflow

1. **Detect business type** from homepage signals (SaaS, local, ecommerce, publisher, agency)
2. **Spawn sub-agents in parallel** (single message, multiple Agent calls):
   - `seo-technical`, `seo-schema`, `seo-content`, `seo-geo`, `seo-images`, `seo-sitemap`
3. **Conditional spawns**:
   - Local business → `seo-local`
   - Blog/pillar pages detected → `seo-cluster`
4. **Aggregate results** → SEO Health Score 0-100
5. **Generate report** in `.fuse-seo/reports/<date>-audit.md`
6. **Prioritize actions**: Critical → High → Medium → Low

## Health Score Formula

```
Technical (25 pts):  robots OK + sitemap valid + CWV green + crawlable
Schema (15 pts):     JSON-LD present + validated against schema.org
Content (20 pts):    E-E-A-T signals + no cannibalization + meta complete
GEO (20 pts):        quick answer first 100 words + citations + structure
Images (10 pts):     alt text 100% + formats (WebP/AVIF) + lazy loading
Local (10 pts):      NAP consistent + GBP linked (if applicable)
```

## Report Template

```markdown
# SEO Audit Report — <url> — <date>

## Health Score: <score>/100

### Critical Issues
- ...

### High Priority
- ...

### Medium / Low
- ...

## Sub-Agent Results
- Technical: <summary>
- Schema: <summary>
- Content: <summary>
- GEO: <summary>
- Images: <summary>
- Sitemap: <summary>
```

## Related

- Scripts: `parse-meta.ts`, `check-cwv.ts`, `validate-schema.ts`
- References: `skills/seo/09-checklists/` (pre-publication, technical audit)
