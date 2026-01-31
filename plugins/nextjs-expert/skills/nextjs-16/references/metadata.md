---
name: metadata
description: Static and dynamic metadata, OpenGraph images, and SEO optimization
when-to-use: SEO, social media previews, dynamic page titles
keywords: metadata, OpenGraph, OG image, SEO, generateMetadata
priority: medium
requires: app-router.md
related: metadata-files.md
---

# Metadata & SEO

## When to Use

- Static page metadata
- Dynamic metadata from DB
- OpenGraph image generation
- Icons and manifest

## Why Built-in Metadata

| Feature | Benefit |
|---------|---------|
| Type-safe | Full IntelliSense |
| Colocated | Next to pages |
| Dynamic | Async generation |
| OG Images | JSX to image |

## Static Metadata
```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'App description',
  openGraph: {
    title: 'My App',
    description: 'App description',
    images: ['/og-image.png'],
  },
}
```

## Dynamic Metadata (async params v16)
```typescript
// modules/public/blog/src/components/BlogPost.tsx
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.image],
    },
  }
}
```

## OpenGraph Image Generation
```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      <div style={{ fontSize: 64, background: '#000', color: '#fff',
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center' }}>
        {post.title}
      </div>
    ),
    { ...size }
  )
}
```

## Template & Default
```typescript
export const metadata: Metadata = {
  title: {
    template: '%s | My App',
    default: 'My App',
  },
}
```

## Icons & Manifest
```typescript
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
}
```
