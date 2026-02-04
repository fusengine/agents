---
name: pricing-card
description: Pricing card with features list and popular badge
when-to-use: Creating individual pricing plan cards for subscription tiers
keywords: pricing, card, features, popular, subscription
priority: high
related: pricing-cards.md, cards-guide.md
---

# Pricing Card Template

## Dependencies

```bash
bun add framer-motion lucide-react
```

## Component

```tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  popular = false
}: PricingCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border p-8",
        popular && "border-primary shadow-lg"
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
          Most Popular
        </span>
      )}

      <div className="text-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-6">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className="mt-8 w-full"
        variant={popular ? "default" : "outline"}
      >
        Get Started
      </Button>
    </motion.div>
  );
}
```

## Usage

```tsx
<PricingCard
  name="Pro"
  price={29}
  description="For growing teams"
  features={["Unlimited projects", "Priority support", "Custom domains"]}
  popular
/>
```
