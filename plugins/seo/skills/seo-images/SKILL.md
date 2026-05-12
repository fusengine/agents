---
name: seo-images
description: Use when optimizing images for SEO. Covers alt text, descriptive filenames, modern formats (WebP/AVIF), lazy loading, responsive sizing (srcset), ImageObject schema.
user-invocable: false
related-skills: seo, seo-schema, seo-technical
---

# Image SEO

## Checks

- All `<img>` have descriptive `alt` (empty `alt=""` only for decorative)
- Filenames: kebab-case, descriptive (`red-running-shoes.webp` not `IMG_1234.jpg`)
- Formats: WebP/AVIF with JPG/PNG fallback
- Lazy loading: `loading="lazy"` on below-fold images
- Responsive: `srcset` + `sizes` for different viewports
- Dimensions: `width` + `height` set to prevent CLS

## File Optimization Targets

| Type | Format | Max size | Quality |
|------|--------|----------|---------|
| Hero | AVIF/WebP | 200 KB | 75-80 |
| Content | WebP | 100 KB | 75 |
| Thumbnail | WebP | 30 KB | 70 |

## References

- `skills/seo/02-onpage-seo/alt-text-images.md`
