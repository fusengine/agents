---
name: photos-images
description: Photo and image best practices for UI design
keywords: photos, images, background, overlay, resolution, focal point, consistency
priority: medium
---

# Photos & Images Guide

## IMAGE SOURCES (FREE)

| Source | Quality | License |
|--------|---------|---------|
| **Unsplash** | High | Free commercial |
| **Pexels** | High | Free commercial |
| **Undraw** | Illustrations | Free |
| **Storyset** | Illustrations | Free with attribution |

**RULE**: Never use low-res Google Images. Always use high-res from these sources.

## RESOLUTION REQUIREMENTS

### Minimum Resolutions
- **Hero images**: 1920x1080 or higher
- **Card images**: 800x600 or higher
- **Thumbnails**: 400x400 or higher
- **Avatars**: 256x256 or higher

### Responsive Images
```tsx
<Image
  src="/hero.jpg"
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1920px"
  alt="Hero description"
/>
```

## SINGLE FOCAL POINT (CRITICAL)

### Choose Images That:
- Have ONE clear subject
- Guide user attention naturally
- Don't require searching the entire image

```tsx
// ✅ Clear focal point
<Image src="/product-focus.jpg" alt="MacBook on desk" />

// ❌ Busy, no focal point
<Image src="/cluttered-desk.jpg" alt="Various items on desk" />
```

## BACKGROUND IMAGES

### Problem: Text Readability
Text on photos varies in readability based on placement.

### Solutions

#### 1. Gradient Overlay
```tsx
<div className="relative">
  <Image src="/hero.jpg" className="object-cover" fill />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
  <div className="relative z-10 text-white">
    <h1>Headline</h1>
  </div>
</div>
```

#### 2. Color Overlay
```tsx
<div className="relative">
  <Image src="/hero.jpg" className="object-cover" fill />
  <div className="absolute inset-0 bg-primary/60" />
  <div className="relative z-10 text-white">
    <h1>Headline</h1>
  </div>
</div>
```

#### 3. Scrim/Vignette
```tsx
<div className="relative">
  <Image src="/hero.jpg" className="object-cover" fill />
  <div className="absolute inset-0 bg-black/40" />
  <div className="relative z-10 text-white">
    <h1>Headline</h1>
  </div>
</div>
```

#### 4. Blur Background
```tsx
<div className="relative">
  <Image src="/hero.jpg" className="object-cover blur-sm" fill />
  <div className="relative z-10 backdrop-blur-md bg-white/10 p-6 rounded-xl">
    <h1>Headline</h1>
  </div>
</div>
```

## VISUAL CONSISTENCY

### Apply Unified Treatment
All images in a section should share:
- Similar color temperature
- Consistent lighting
- Same aspect ratio

```tsx
// Color overlay for consistency
<div className="grid grid-cols-3 gap-4">
  {images.map(img => (
    <div key={img.id} className="relative aspect-square">
      <Image src={img.src} fill className="object-cover" />
      <div className="absolute inset-0 bg-primary/20" /> {/* Unifying overlay */}
    </div>
  ))}
</div>
```

## ASPECT RATIOS

| Ratio | Use Case | Tailwind |
|-------|----------|----------|
| 1:1 | Avatars, thumbnails | `aspect-square` |
| 16:9 | Video, hero | `aspect-video` |
| 4:3 | Product images | `aspect-[4/3]` |
| 3:2 | Photography | `aspect-[3/2]` |
| 21:9 | Cinematic hero | `aspect-[21/9]` |

```tsx
<div className="aspect-video overflow-hidden rounded-lg">
  <Image src="/video-thumb.jpg" fill className="object-cover" />
</div>
```

## BAD PHOTOS (AVOID)

### Red Flags
- Low resolution (pixelated)
- Doesn't match context
- Too busy/cluttered
- Obvious stock photo poses
- Watermarks

### Example
```tsx
// ❌ Wrong context - Street photo for travel landing
// Even if technically fine, doesn't match "explore Paris" theme

// ✅ Right context - Iconic landmark for travel
<Image src="/eiffel-tower.jpg" alt="Eiffel Tower" />
```

## IMAGE EFFECTS

### Rounded Corners
```tsx
<Image className="rounded-lg" />      // 8px
<Image className="rounded-xl" />      // 12px
<Image className="rounded-2xl" />     // 16px
<Image className="rounded-full" />    // Circle
```

### Shadow
```tsx
<Image className="shadow-md rounded-lg" />
<Image className="shadow-xl rounded-xl" />
```

### Border
```tsx
<Image className="border border-border rounded-lg" />
<Image className="ring-4 ring-primary/20 rounded-full" />
```

## OPTIMIZATION

### Next.js Image
```tsx
import Image from 'next/image';

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  quality={85}
  placeholder="blur"
  blurDataURL={blurDataUrl}
  loading="lazy"
  alt="Description"
/>
```

### Size Recommendations
- Compress before upload
- Use WebP/AVIF formats
- Provide multiple sizes (srcSet)
- Lazy load below-fold images

## ILLUSTRATIONS VS PHOTOS

| Use Photos | Use Illustrations |
|------------|-------------------|
| Real products | Abstract concepts |
| Team members | Onboarding flows |
| Locations | Empty states |
| Testimonials | Features explanation |

```tsx
// Empty state with illustration
<div className="text-center py-12">
  <Image src="/illustrations/no-data.svg" width={200} height={200} />
  <h3 className="mt-4 font-semibold">No items yet</h3>
  <p className="text-muted-foreground">Create your first item</p>
</div>
```

## 3D ILLUSTRATIONS (2026 TREND)

Isometric 3D illustrations add modern visual appeal:
- Use sparingly (hero sections, landing pages)
- Animate for extra impact
- Match color palette to design system

## FORBIDDEN PATTERNS

- Low-resolution images
- Obvious stock photos (forced smiles, pointing)
- Text on busy background without overlay
- Inconsistent image treatments
- Missing alt text
- Non-optimized large files

## ACCESSIBILITY

- [ ] All images have descriptive alt text
- [ ] Decorative images have `alt=""`
- [ ] Text over images has sufficient contrast
- [ ] Images don't convey info without text alternative
