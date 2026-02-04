---
name: hero-glassmorphism
description: Complete hero section with glassmorphism, gradient orbs, and Framer Motion
when-to-use: Creating modern hero sections with glassmorphism and animated backgrounds
keywords: hero, glassmorphism, landing, gradient, framer-motion
priority: high
related: hero-section.md, motion-patterns.md
---

# Hero Section with Glassmorphism

## Required Dependencies

```bash
bun add framer-motion lucide-react
```

## CSS Variables (globals.css)

```css
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');

:root {
  --font-display: 'Clash Display', sans-serif;
  --font-sans: 'Satoshi', sans-serif;

  --color-primary: oklch(55% 0.20 260);
  --color-primary-foreground: oklch(98% 0.01 260);
  --color-accent: oklch(70% 0.19 145);
  --color-background: oklch(99% 0.005 260);
  --color-foreground: oklch(15% 0.02 260);
  --color-muted: oklch(95% 0.01 260);
  --color-muted-foreground: oklch(45% 0.02 260);
}

.dark {
  --color-primary: oklch(65% 0.2 260);
  --color-background: oklch(12% 0.02 260);
  --color-foreground: oklch(95% 0.01 260);
}
```

## Complete Component

```tsx
// components/sections/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Orbs Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-accent)]/15 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--color-primary)]/10 rounded-full blur-[60px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-white/10 backdrop-blur-xl border border-white/20
                         text-sm font-medium text-[var(--color-foreground)]">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
            New Feature Released
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-[var(--font-display)] text-5xl md:text-6xl lg:text-7xl
                     font-bold tracking-tight text-[var(--color-foreground)] mb-6"
        >
          Build Beautiful
          <br />
          <span className="text-[var(--color-primary)]">Interfaces Faster</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="font-[var(--font-sans)] text-lg md:text-xl
                     text-[var(--color-muted-foreground)] max-w-2xl mx-auto mb-10"
        >
          Design and ship production-ready components with our AI-powered
          platform. No more generic templates.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="h-14 px-8 text-base font-medium rounded-xl
                       bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
                       hover:opacity-90 transition-opacity"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 text-base font-medium rounded-xl
                       bg-white/10 backdrop-blur-xl border-white/20
                       hover:bg-white/20 transition-colors"
          >
            View Demo
          </Button>
        </motion.div>

        {/* Glassmorphism Card Preview */}
        <motion.div
          variants={itemVariants}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden
                         bg-white/10 backdrop-blur-xl border border-white/20
                         shadow-2xl shadow-black/10 p-8">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="h-32 rounded-xl bg-white/5 border border-white/10"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

## Anti-AI-Slop Checklist

- [x] Font: Clash Display (NOT Inter/Roboto)
- [x] Colors: OKLCH CSS variables (NOT hard-coded hex)
- [x] Background: Gradient orbs with blur (NOT solid white)
- [x] Cards: Glassmorphism (bg-white/10 backdrop-blur-xl)
- [x] Animation: Framer Motion stagger (NOT random bounce)
- [x] Shadows: shadow-primary/10 (NOT generic shadow)
- [x] Hover: Intentional y-4 lift (NOT scale-105 only)
