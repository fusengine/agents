---
name: images
description: Image optimization with next/image, lazy loading, responsive images
when-to-use: all images in Next.js, LCP optimization, responsive design
keywords: next/image, optimization, lazy loading, blur placeholder, responsive
priority: medium
requires: app-router.md
related: fonts.md
---

# Image Optimization

## When to Use

- All images in Next.js
- LCP optimization with priority
- Responsive image srcset
- Remote image loading

## Why next/image

| Feature | Benefit |
|---------|---------|
| Auto-optimize | WebP/AVIF conversion |
| Lazy loading | Viewport-based load |
| Blur placeholder | Better UX |
| Prevent CLS | Reserved space |

## Basic Usage
```typescript
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
    />
  )
}
```

## Priority (LCP)
```typescript
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // Load immediately for LCP
/>
```

## Responsive Images
```typescript
<Image
  src="/photo.jpg"
  alt="Photo"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover' }}
/>
```

## Placeholder Blur
```typescript
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

## Remote Images Config
```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/my-bucket/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
}
```

## Formats & Sizes
```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
}
```

## Loader Custom
```typescript
const cloudinaryLoader = ({ src, width, quality }) => {
  return `https://res.cloudinary.com/demo/image/upload/w_${width},q_${quality || 75}/${src}`
}

<Image loader={cloudinaryLoader} src="sample.jpg" alt="Sample" width={500} height={500} />
```
