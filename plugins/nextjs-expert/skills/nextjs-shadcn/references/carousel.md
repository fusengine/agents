---
name: carousel
description: Touch-enabled carousel component with navigation controls and plugins
when-to-use: Use when displaying image galleries, product showcases, testimonials, or any content that benefits from slide-based navigation. Supports autoplay, navigation buttons, and swipe gestures.
keywords: carousel, slider, image gallery, embla carousel, autoplay, swipe
priority: medium
requires: null
related: scroll-area.md
---

# Carousel Component

The Carousel component provides a feature-rich carousel/slider built on Embla Carousel. It supports touch gestures, keyboard navigation, plugins, and responsive layouts.

## Installation

Install the Carousel component using the shadcn/ui CLI:

```bash
bunx --bun shadcn@latest add carousel
```

## Basic Usage

### Simple Carousel

Create a basic carousel with navigation buttons:

```tsx
import * as React from "react"
import { Card, CardContent } from "@/modules/cores/shadcn/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/cores/shadcn/components/ui/carousel"

export function CarouselExample() {
  return (
    <Carousel>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

## Components

### Carousel

Main carousel container.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opts` | `EmblaOptionsType` | - | Embla options (alignment, loop, etc.) |
| `plugins` | `EmblaPluginType[]` | - | Array of Embla plugins |
| `className` | `string` | - | Container CSS classes |
| `orientation` | `"horizontal" \| "vertical"` | - | Slide direction |

### CarouselContent

Wrapper for carousel items.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Content CSS classes |

### CarouselItem

Individual slide item.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Item CSS classes |

### CarouselPrevious / CarouselNext

Navigation buttons for previous/next slides.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Button CSS classes |
| `variant` | `string` | - | Button variant style |

## Autoplay Plugin

### Basic Autoplay

Enable automatic slide rotation:

```tsx
"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/modules/cores/shadcn/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/cores/shadcn/components/ui/carousel"

export function CarouselAutoplayExample() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel plugins={[plugin.current]}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

## Responsive Layouts

### Multi-Column Carousel

Display multiple items per slide on different screen sizes:

```tsx
import * as React from "react"
import { Card, CardContent } from "@/modules/cores/shadcn/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/cores/shadcn/components/ui/carousel"

export function ResponsiveCarouselExample() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

### Custom Item Spacing

Control spacing between carousel items:

```tsx
import * as React from "react"
import { Card, CardContent } from "@/modules/cores/shadcn/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/cores/shadcn/components/ui/carousel"

export function SpacedCarouselExample() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent className="-ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

## Advanced Patterns

### Image Gallery Carousel

Full-featured image carousel:

```tsx
"use client"

import * as React from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/cores/shadcn/components/ui/carousel"

interface GalleryImage {
  id: string
  src: string
  alt: string
}

export function ImageGalleryCarouselExample() {
  const images: GalleryImage[] = [
    { id: "1", src: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?w=800&q=80", alt: "Image 1" },
    { id: "2", src: "https://images.unsplash.com/photo-1466891857616-5dba42b0e34c?w=800&q=80", alt: "Image 2" },
    { id: "3", src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80", alt: "Image 3" },
  ]

  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <div className="relative w-full aspect-video">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

### Product Showcase Carousel

Carousel for product display:

```tsx
"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/modules/cores/shadcn/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/cores/shadcn/components/ui/carousel"

interface Product {
  id: string
  name: string
  price: number
  image: string
}

export function ProductCarouselExample() {
  const products: Product[] = [
    { id: "1", name: "Product 1", price: 99.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" },
    { id: "2", name: "Product 2", price: 149.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" },
    { id: "3", name: "Product 3", price: 179.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" },
  ]

  return (
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id}>
            <div className="space-y-4">
              <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-lg font-bold mt-2">${product.price}</p>
                <Button className="w-full mt-2">Add to Cart</Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

### Testimonials Carousel

Carousel for displaying testimonials:

```tsx
"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/cores/shadcn/components/ui/carousel"

interface Testimonial {
  id: string
  text: string
  author: string
  role: string
}

export function TestimonialsCarouselExample() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const testimonials: Testimonial[] = [
    { id: "1", text: "Great product, highly recommend!", author: "John Doe", role: "CEO" },
    { id: "2", text: "Excellent service and support.", author: "Jane Smith", role: "Manager" },
    { id: "3", text: "Best solution we found in the market.", author: "Bob Johnson", role: "Developer" },
  ]

  return (
    <Carousel plugins={[plugin.current]} className="w-full max-w-2xl">
      <CarouselContent>
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id}>
            <div className="p-8 rounded-lg border bg-card">
              <p className="text-lg italic mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

## Configuration Options

### Embla Options

```tsx
const opts = {
  align: "start",      // "start", "center", "end"
  loop: true,          // Enable infinite loop
  active: true,        // Enable active slide indicator
  direction: "ltr",    // "ltr" or "rtl"
  startIndex: 0,       // Initial slide index
  inViewThreshold: 0,  // Visibility threshold
}
```

## Best Practices

1. **Always include navigation** - Previous/Next buttons or dots
2. **Responsive sizing** - Use max-w utilities for different screen sizes
3. **Image optimization** - Use Next.js Image component
4. **Accessibility** - Supports keyboard navigation automatically
5. **Touch support** - Swipe gestures work on touch devices
6. **Autoplay carefully** - Consider user preference with `stopOnInteraction`
7. **Performance** - Use `lazy` loading for images

## Accessibility

- Keyboard navigation: Arrow keys move between slides
- Focus management for navigation buttons
- Touch swipe gestures supported
- Respects `prefers-reduced-motion`
- ARIA labels on navigation controls
