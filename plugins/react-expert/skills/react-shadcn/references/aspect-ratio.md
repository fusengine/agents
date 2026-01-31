---
name: aspect-ratio
description: Maintains consistent aspect ratio for media containers
when-to-use: Use when displaying images, videos, or embeds that need to maintain a specific aspect ratio. Prevents layout shift and ensures responsive images scale proportionally.
keywords: aspect ratio, image container, video embed, media container, proportional scaling
priority: low
requires: null
related: null
---

# AspectRatio Component

The AspectRatio component maintains a consistent aspect ratio for its content, preventing layout shift when media loads. It's essential for responsive image and video containers.

## Installation

Install the AspectRatio component using the shadcn/ui CLI:

```bash
bunx --bun shadcn@latest add aspect-ratio
```

## Basic Usage

### Image Container

Use AspectRatio to maintain consistent image dimensions:

```tsx
import Image from "next/image"
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

export function AspectRatioImageExample() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <Image
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Photo by Drew Beamer"
        fill
        className="rounded-md object-cover"
      />
    </AspectRatio>
  )
}
```

## Common Aspect Ratios

### 1:1 Square

Perfect for profile images and thumbnails:

```tsx
import Image from "next/image"
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

export function SquareAspectRatioExample() {
  return (
    <AspectRatio ratio={1 / 1} className="bg-muted">
      <Image
        src="https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=400&q=80"
        alt="Profile"
        fill
        className="object-cover rounded-lg"
      />
    </AspectRatio>
  )
}
```

### 4:3 Standard

Common for traditional video:

```tsx
import Image from "next/image"
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

export function StandardAspectRatioExample() {
  return (
    <AspectRatio ratio={4 / 3} className="bg-muted">
      <Image
        src="https://images.unsplash.com/photo-1634128221889-82ed6efcc547?w=600&q=80"
        alt="Standard format"
        fill
        className="object-cover rounded-md"
      />
    </AspectRatio>
  )
}
```

### 16:9 Widescreen

Most common for modern video and web content:

```tsx
import Image from "next/image"
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

export function WidescreenAspectRatioExample() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <Image
        src="https://images.unsplash.com/photo-1611339555312-e607c249352d?w=800&q=80"
        alt="Widescreen content"
        fill
        className="object-cover rounded-md"
      />
    </AspectRatio>
  )
}
```

### 21:9 Ultrawide

For panoramic images:

```tsx
import Image from "next/image"
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

export function UltrawideAspectRatioExample() {
  return (
    <AspectRatio ratio={21 / 9} className="bg-muted">
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&q=80"
        alt="Panoramic view"
        fill
        className="object-cover rounded-md"
      />
    </AspectRatio>
  )
}
```

## Video Embeds

### Embedded Video Player

Maintain aspect ratio for responsive video embeds:

```tsx
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

export function EmbeddedVideoExample() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-black">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video"
        allowFullScreen
        className="h-full w-full rounded-md"
      />
    </AspectRatio>
  )
}
```

### Vimeo Video

```tsx
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

export function VimeoVideoExample() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-black">
      <iframe
        src="https://player.vimeo.com/video/123456789"
        title="Vimeo video"
        allowFullScreen
        className="h-full w-full rounded-md"
      />
    </AspectRatio>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ratio` | `number` | `1 / 1` | Aspect ratio as width/height |
| `className` | `string` | - | Container CSS classes |
| `children` | `ReactNode` | - | Content to display |

## Advanced Patterns

### Responsive Grid of Images

Gallery with consistent aspect ratios:

```tsx
import Image from "next/image"
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

export function ImageGalleryExample() {
  const images = [
    "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?w=300&q=80",
    "https://images.unsplash.com/photo-1466891857616-5dba42b0e34c?w=300&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
  ]

  return (
    <div className="grid gap-4 grid-cols-3">
      {images.map((src, i) => (
        <AspectRatio key={i} ratio={1 / 1} className="bg-muted">
          <Image
            src={src}
            alt={`Gallery image ${i + 1}`}
            fill
            className="object-cover rounded-md"
          />
        </AspectRatio>
      ))}
    </div>
  )
}
```

### Dynamic Aspect Ratio

Calculate aspect ratio dynamically:

```tsx
import Image from "next/image"
import { AspectRatio } from "@/modules/cores/shadcn/components/ui/aspect-ratio"

interface MediaProps {
  src: string
  width: number
  height: number
  alt: string
}

export function DynamicAspectRatioExample({ src, width, height, alt }: MediaProps) {
  const ratio = width / height

  return (
    <AspectRatio ratio={ratio} className="bg-muted">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-md"
      />
    </AspectRatio>
  )
}
```

## Styling

### Rounded Corners

```tsx
// With rounded corners
<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
  <Image src="..." fill className="object-cover" />
</AspectRatio>
```

### With Border

```tsx
// With border
<AspectRatio ratio={16 / 9} className="border-2 border-primary rounded-md">
  <Image src="..." fill className="object-cover" />
</AspectRatio>
```

### Shadow Effect

```tsx
// With shadow
<AspectRatio ratio={16 / 9} className="shadow-lg rounded-md overflow-hidden">
  <Image src="..." fill className="object-cover" />
</AspectRatio>
```

## Best Practices

1. **Always specify ratio** - Never rely on default 1:1 ratio
2. **Use with React Image** - Combine with `fill` prop for optimization
3. **Set object-fit** - Use `object-cover` or `object-contain` for proper scaling
4. **Prevent layout shift** - AspectRatio prevents CLS (Cumulative Layout Shift)
5. **Responsive sizes** - Combine with responsive image srcset
6. **Accessibility** - Always include meaningful alt text

## Common Aspect Ratio Values

| Use Case | Ratio | Value |
|----------|-------|-------|
| Square | 1:1 | `1 / 1` |
| Portrait | 3:4 | `3 / 4` |
| Landscape | 4:3 | `4 / 3` |
| Widescreen | 16:9 | `16 / 9` |
| Ultrawide | 21:9 | `21 / 9` |
| Mobile | 9:16 | `9 / 16` |
| Instagram | 1:1, 4:5 | `1 / 1`, `4 / 5` |
| YouTube Thumbnail | 16:9 | `16 / 9` |

## Accessibility

- Use semantic `<figure>` elements for images
- Always provide descriptive `alt` text
- Ensure sufficient contrast with background
- Test video embeds with keyboard navigation
