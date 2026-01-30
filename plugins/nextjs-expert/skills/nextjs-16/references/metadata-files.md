# Metadata Files

## File-based Metadata
```
app/
├── favicon.ico
├── icon.png              # App icon
├── apple-icon.png        # Apple touch icon
├── opengraph-image.png   # OG image (static)
├── twitter-image.png     # Twitter card
├── sitemap.xml           # or sitemap.ts
├── robots.txt            # or robots.ts
└── manifest.json         # or manifest.ts
```

## Dynamic opengraph-image.tsx
```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    <div style={{ fontSize: 64, background: '#000', color: '#fff',
      width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      {post.title}
    </div>,
    { ...size }
  )
}
```

## sitemap.ts
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()

  return [
    { url: 'https://example.com', lastModified: new Date() },
    ...posts.map(post => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ]
}
```

## robots.ts
```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

## manifest.ts
```typescript
// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My App',
    short_name: 'App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#000',
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  }
}
```
