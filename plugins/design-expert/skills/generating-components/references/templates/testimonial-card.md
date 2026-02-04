---
name: testimonial-card
description: Testimonial card with avatar, rating, and quote
when-to-use: Building social proof sections with customer testimonials
keywords: testimonial, review, rating, stars, avatar
priority: medium
related: cards-guide.md, hero-section.md
---

# Testimonial Card Template

## Dependencies

```bash
bun add lucide-react
```

## Component

```tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  rating: number;
}

export function TestimonialCard({ content, author, rating }: TestimonialProps) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>

      <blockquote className="mt-4 text-muted-foreground">
        "{content}"
      </blockquote>

      <div className="mt-6 flex items-center gap-3">
        <Image
          src={author.avatar}
          alt={author.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-medium text-sm">{author.name}</p>
          <p className="text-xs text-muted-foreground">{author.role}</p>
        </div>
      </div>
    </div>
  );
}
```

## Usage

```tsx
<TestimonialCard
  content="This product has completely transformed our workflow."
  author={{
    name: "Jane Doe",
    role: "CEO at Acme",
    avatar: "/avatars/jane.jpg"
  }}
  rating={5}
/>
```
