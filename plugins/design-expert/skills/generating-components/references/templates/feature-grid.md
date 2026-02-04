---
name: feature-grid
description: Feature grid with icons and stagger animation
when-to-use: Displaying product features with animated grid layout
keywords: features, grid, icons, stagger, motion
priority: high
related: grids-layout.md, motion-patterns.md
---

# Feature Grid Template

## Dependencies

```bash
bun add framer-motion lucide-react
```

## Component

```tsx
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <motion.div
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {features.map((feature) => (
        <motion.div
          key={feature.title}
          className="relative rounded-2xl border bg-card p-6"
          variants={item}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <feature.icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold">{feature.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

## Usage

```tsx
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { Zap, Shield, Palette } from "lucide-react";

const features = [
  { icon: Zap, title: "Fast", description: "Lightning fast performance" },
  { icon: Shield, title: "Secure", description: "Enterprise-grade security" },
  { icon: Palette, title: "Customizable", description: "Full design control" }
];

<FeatureGrid features={features} />
```
