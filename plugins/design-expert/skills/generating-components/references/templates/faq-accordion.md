---
name: faq-accordion
description: FAQ accordion section with chevron indicator and Schema.org structured data
when-to-use: FAQ pages, support sections, knowledge base with expandable Q&A
keywords: faq, accordion, questions, collapsible, schema-org
priority: medium
related: contact-form.md
---

# FAQ Accordion Template

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>FAQ accordion — shadcn Accordion, single open, Schema.org FAQPage</component>
    <aesthetics>Editorial list — accordion items feel like a high-quality editorial list. Question is the entry point, answer is the payoff. No decorative cards, no colored backgrounds per item. Chevron is the only interactive affordance. Max-w-3xl centered for comfortable reading line length</aesthetics>
    <typography>
      - Section title: var(--font-display), clamp(1.75rem, 4vw, 2.5rem), font-weight 700
      - Question trigger: var(--font-body), 1rem, font-weight 500, color oklch(var(--foreground)), text-left
      - Answer content: var(--font-body), 0.9375rem, line-height 1.7, color oklch(var(--muted-foreground))
      - Item number (optional): var(--font-mono), 0.75rem, color oklch(var(--muted-foreground) / 0.5)
    </typography>
    <color_system>
      - Section bg: oklch(var(--background))
      - Item border: oklch(var(--border))
      - Question hover bg: oklch(var(--muted) / 0.5)
      - Chevron: oklch(var(--muted-foreground)), rotates to oklch(var(--foreground)) when open
      - Answer bg: transparent (no colored answer backgrounds)
    </color_system>
    <spacing>Section max-w-3xl mx-auto py-20. AccordionItem py-1. AccordionTrigger py-4 px-0. AccordionContent pb-4 pt-0. Gap between section title and accordion: mt-12</spacing>
    <states>
      - Default: all items collapsed, chevron pointing down
      - Open item: chevron rotated 180deg, content height auto, smooth spring
      - Item hover (collapsed): bg-muted/50 on trigger
      - Item focus-visible: outline ring-2 ring-ring/20 (keyboard nav)
      - Active/open trigger: font-weight 600, chevron color oklch(var(--foreground))
      - Max open: type="single" — only 1 item open at a time
    </states>
    <animations>Built-in shadcn Accordion spring animation for height. Chevron: data-[state=open]:rotate-180, transition-transform 0.2s. Section entrance: opacity 0→1, y 20→0, 0.4s on scroll. Do NOT add custom height animation (conflicts with shadcn)</animations>
    <forbidden>
      - No custom accordion implementation — use shadcn Accordion
      - No type="multiple" (users get lost with multiple open items)
      - No colorful question backgrounds
      - No accordion without Schema.org FAQPage JSON-LD
      - No more than 10 items
      - No answers hidden in nested accordions
      - No Inter/Roboto/Arial
      - No hard-coded hex
    </forbidden>
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## Schema.org Requirement

Every FAQ section MUST include this JSON-LD block:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Q1", "acceptedAnswer": { "@type": "Answer", "text": "A1" }}
  ]
}
</script>
```

## Validation Checklist

- [ ] Uses shadcn Accordion, not custom implementation
- [ ] type="single" collapsible (one open at a time)
- [ ] Chevron rotates on open/close
- [ ] Max 7-10 items, high-traffic questions first
- [ ] Schema.org FAQPage JSON-LD included
- [ ] All states: default, open, hover, focus-visible
