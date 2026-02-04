---
name: pricing-cards
description: Complete pricing section with 3 tiers, toggle, and glassmorphism
when-to-use: Building SaaS landing pages with multiple pricing plans
keywords: pricing, cards, toggle, subscription, tiers
priority: high
related: pricing-card.md, hero-section.md
---

# Pricing Cards Section

## Required Dependencies

```bash
bun add framer-motion lucide-react
```

## Complete Component

```tsx
// components/sections/PricingSection.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    description: "Perfect for side projects",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: [
      "5 projects",
      "10GB storage",
      "Basic analytics",
      "Email support"
    ]
  },
  {
    name: "Pro",
    description: "For growing teams",
    monthlyPrice: 29,
    yearlyPrice: 290,
    popular: true,
    features: [
      "Unlimited projects",
      "100GB storage",
      "Advanced analytics",
      "Priority support",
      "Custom domains",
      "Team collaboration"
    ]
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "SSO & SAML",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations"
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[var(--color-primary)]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-[var(--color-accent)]/10 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold
                        text-[var(--color-foreground)] mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-[var(--color-muted-foreground)] text-lg max-w-xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={cn(
            "text-sm font-medium transition-colors",
            !isYearly ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"
          )}>
            Monthly
          </span>

          <button
            onClick={() => setIsYearly(!isYearly)}
            className={cn(
              "relative w-14 h-8 rounded-full transition-colors",
              isYearly ? "bg-[var(--color-primary)]" : "bg-[var(--color-muted)]"
            )}
          >
            <motion.div
              layout
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
              style={{ left: isYearly ? "calc(100% - 28px)" : "4px" }}
            />
          </button>

          <span className={cn(
            "text-sm font-medium transition-colors",
            isYearly ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"
          )}>
            Yearly
            <span className="ml-2 text-xs text-[var(--color-accent)]">Save 20%</span>
          </span>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className={cn(
                "relative rounded-2xl p-8 transition-shadow",
                plan.popular
                  ? "bg-[var(--color-primary)] text-white shadow-2xl shadow-[var(--color-primary)]/30"
                  : "bg-white/10 backdrop-blur-xl border border-white/20"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                 bg-[var(--color-accent)] text-xs font-semibold">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-[var(--font-display)] text-xl font-bold mb-2">
                  {plan.name}
                </h3>
                <p className={cn(
                  "text-sm",
                  plan.popular ? "text-white/70" : "text-[var(--color-muted-foreground)]"
                )}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="font-[var(--font-display)] text-4xl font-bold">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className={cn(
                  "text-sm ml-2",
                  plan.popular ? "text-white/70" : "text-[var(--color-muted-foreground)]"
                )}>
                  /{isYearly ? "year" : "month"}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className={cn(
                      "h-5 w-5 flex-shrink-0",
                      plan.popular ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"
                    )} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full h-12 rounded-xl font-medium",
                  plan.popular
                    ? "bg-white text-[var(--color-primary)] hover:bg-white/90"
                    : "bg-[var(--color-primary)] text-white hover:opacity-90"
                )}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

## Anti-AI-Slop Checklist

- [x] Font: CSS variable --font-display (NOT Inter)
- [x] Colors: OKLCH variables (NOT purple gradients)
- [x] Popular card: Primary color (NOT border-left indicator)
- [x] Cards: Glassmorphism on non-popular (NOT flat white)
- [x] Toggle: Custom animated (NOT generic switch)
- [x] Shadow: shadow-primary/30 on popular (NOT generic)
- [x] Animation: Framer Motion stagger + hover lift
