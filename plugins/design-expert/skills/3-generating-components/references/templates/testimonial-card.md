---
name: testimonial-card
description: Testimonial card with quote, avatar, role, company, and star rating
when-to-use: Social proof sections with customer testimonials and reviews
keywords: testimonial, review, rating, avatar, social-proof
priority: medium
related: stats-section.md, hero-section.md
---

# Testimonial Card Template

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>Testimonial card — quote + author + star rating, social proof grid</component>
    <aesthetics>Trust-first — card feels like a physical quote card, generous internal padding, star rating is prominent. Quotation mark as decorative element (large, positioned top-left of quote). No gradient backgrounds on individual cards</aesthetics>
    <typography>
      - Quote text: var(--font-body), 0.9375rem, line-height 1.7, color oklch(var(--muted-foreground)), font-style italic
      - Author name: var(--font-body), 0.9375rem, font-weight 600, color oklch(var(--foreground))
      - Role + company: var(--font-body), 0.8125rem, color oklch(var(--muted-foreground))
      - Decorative quote mark: var(--font-display), 5rem, leading-none, color oklch(var(--primary) / 0.15)
    </typography>
    <color_system>
      - Card bg: oklch(var(--card))
      - Card border: oklch(var(--border))
      - Star active: fill oklch(0.8 0.18 85), text oklch(0.8 0.18 85) (yellow OKLCH)
      - Star inactive: oklch(var(--muted-foreground) / 0.3)
      - Card hover shadow: shadow-lg shadow-black/5
      - Avatar border: ring-2 ring-background (white ring for separation)
    </color_system>
    <spacing>Card padding p-6. Stars mb-4. Quote mb-6. Author row gap-3. Avatar w-10 h-10 (40px). Section grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6</spacing>
    <states>
      - Default: card with border, full content visible
      - Hover: translateY -2px, shadow increase (shadow-lg), 0.2s spring
      - Avatar image load error: fallback to initials in colored bg (oklch from name hash)
      - Rating partial (4/5): 4 filled stars, 1 empty — never show 0/5
      - Card in carousel: pagination dots visible, swipe gesture on mobile
      - Featured testimonial (optional): larger card spanning full width, larger quote font
    </states>
    <animations>Framer Motion whileInView: staggerChildren 0.07s, once true. Each card: opacity 0→1, y 20→0, 0.4s easeOut. Stars: sequential fill with stagger 0.05s on view. Hover: whileHover spring stiffness 400 damping 25</animations>
    <forbidden>
      - No illustration avatars — use real photo placeholders or initials fallback
      - No generic quotes like "Great product!" (placeholder text must be specific)
      - No star ratings below 4/5 (never show negative social proof)
      - No card without company name (B2B credibility)
      - No centered quote text (left-align for readability)
      - No Inter/Roboto/Arial
      - No hard-coded hex
    </forbidden>
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## Card Structure

| Zone | Content | Notes |
|------|---------|-------|
| Top-left | Decorative quote mark | Purely visual, aria-hidden |
| Top-right | Star rating row | 5 stars, filled/empty |
| Middle | Blockquote (italic) | Use `<blockquote>` semantics |
| Bottom | Avatar + name + role + company | Flex row, gap-3 |

## Validation Checklist

- [ ] Blockquote uses semantic `<blockquote>` element
- [ ] Avatar fallback to initials if image fails
- [ ] Company name always present
- [ ] Stars: filled/empty distinction, never 0/5
- [ ] Stagger entrance on scroll intersection
- [ ] OKLCH CSS variables only, no hard-coded hex
