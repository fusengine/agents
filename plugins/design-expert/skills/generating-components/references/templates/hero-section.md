---
name: hero-section
description: Complete hero section with badge, headline, CTA buttons
when-to-use: Building landing pages with compelling headline sections and CTAs
keywords: hero, landing, headline, cta, motion
priority: high
related: feature-grid.md, pricing-cards.md
---

# Hero Section Template

## Dependencies

```bash
bun add framer-motion lucide-react
```

## Component

```tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="container px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            New Release
          </span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Build faster with{" "}
            <span className="text-primary">modern tools</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, accessible interfaces with our comprehensive
            design system. Ship products faster without compromising quality.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

## Usage

```tsx
import { HeroSection } from "@/components/sections/HeroSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
```
