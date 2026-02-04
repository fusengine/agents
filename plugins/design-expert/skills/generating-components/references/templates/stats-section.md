---
name: stats-section
description: Stats section with animated numbers
when-to-use: Displaying metrics and achievements with animated counters
keywords: stats, numbers, animated, counter, metrics
priority: medium
related: hero-section.md, feature-grid.md
---

# Stats Section Template

## Dependencies

```bash
bun add framer-motion
```

## Component

```tsx
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 2 });
    return animation.stop;
  }, [count, value]);

  return (
    <motion.span>
      {rounded}
      {suffix}
    </motion.span>
  );
}

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-4xl font-bold text-primary">
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
```

## Usage

```tsx
const stats = [
  { value: 10000, suffix: "+", label: "Active Users" },
  { value: 99, suffix: "%", label: "Uptime" },
  { value: 50, suffix: "+", label: "Countries" },
  { value: 24, suffix: "/7", label: "Support" }
];

<StatsSection stats={stats} />
```
