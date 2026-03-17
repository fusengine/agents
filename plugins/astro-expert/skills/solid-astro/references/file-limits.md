# File Size Limits in Astro

## The Rule

**Split files at 90 lines. Never exceed 100 lines.**

This is not a stylistic preference — it enforces Single Responsibility and prevents "god components."

## Limits by File Type

| File Type | Warning | Hard Limit | Action at Limit |
|-----------|---------|------------|-----------------|
| Page (`.astro` in `pages/`) | 40 lines | 50 | Extract components |
| Layout component | 70 lines | 80 | Extract sections |
| UI component | 50 lines | 60 | Split into sub-components |
| Service / utility | 70 lines | 80 | Extract helper functions |
| Content schema | 40 lines | 50 | Split into sub-schemas |
| Interface file | 40 lines | 50 | Split by domain |

## How to Split a Page

```astro
<!-- BAD: 80-line page doing everything -->
<!-- src/pages/index.astro -->

<!-- GOOD: Page as composition of focused components -->
---
// src/pages/index.astro — 30 lines max
import HeroSection from '../components/home/HeroSection.astro';
import FeaturesGrid from '../components/home/FeaturesGrid.astro';
import TestimonialsSlider from '../components/home/TestimonialsSlider.astro';
import CtaSection from '../components/home/CtaSection.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
import { getHomeData } from '../lib/home';

const { features, testimonials } = await getHomeData();
---

<BaseLayout title="Home">
  <HeroSection />
  <FeaturesGrid features={features} />
  <TestimonialsSlider testimonials={testimonials} />
  <CtaSection />
</BaseLayout>
```

## How to Split a Large Service

```typescript
// BAD: src/lib/blog.ts — 120 lines

// GOOD: Split by responsibility
// src/lib/blog/queries.ts    — database/API queries (< 80 lines)
// src/lib/blog/transforms.ts — data transformation (< 80 lines)
// src/lib/blog/index.ts      — public API re-exports (< 30 lines)
```

## Automated Check

```bash
# Check files exceeding 90 lines
find src -name "*.astro" -o -name "*.ts" -o -name "*.tsx" \
  | xargs wc -l | awk '$1 > 90 {print $0}' | grep -v total
```
