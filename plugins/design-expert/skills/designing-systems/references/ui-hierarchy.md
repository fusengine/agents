---
name: ui-hierarchy
description: Visual hierarchy principles - size, weight, color contrast, and emphasis
when-to-use: Creating clear information hierarchy, establishing visual priorities, guiding user attention
keywords: hierarchy, size, weight, contrast, emphasis, typography scale
priority: high
related: ui-spacing.md, ui-trends-2026.md, color-system.md
---

# UI Visual Hierarchy

## Sources
- [Netwave Interactive](https://www.netwaveinteractive.com/blog/visual-hierarchy-in-ui-ux-design-principles-strategies-and-best-practices/)
- [Promodo](https://www.promodo.com/blog/key-ux-ui-design-trends)

---

## Size Hierarchy (MANDATORY)

```
1. Hero headline     → text-5xl/6xl font-bold (48-60px)
2. Section title     → text-3xl/4xl font-semibold (30-36px)
3. Card title        → text-xl/2xl font-medium (20-24px)
4. Body text         → text-base font-normal (16px)
5. Caption/meta      → text-sm text-muted-foreground (14px)
6. Labels/badges     → text-xs uppercase tracking-wide (12px)
```

```tsx
// CORRECT - Clear hierarchy
<article>
  <h1 className="text-5xl font-bold">Main Headline</h1>
  <p className="text-xl text-muted-foreground mt-4">Subtitle or lead</p>
  <div className="mt-8">
    <h2 className="text-2xl font-semibold">Section</h2>
    <p className="text-base mt-2">Body content...</p>
  </div>
</article>

// WRONG - No hierarchy
<article>
  <h1 className="text-lg">Main Headline</h1>
  <p className="text-lg">Subtitle</p>
  <h2 className="text-lg">Section</h2>
  <p className="text-lg">Body</p>
</article>
```

---

## Color Hierarchy

```tsx
// PRIMARY - Most important (CTAs, key actions)
<Button className="bg-primary text-primary-foreground">Get Started</Button>

// SECONDARY - Supporting actions
<Button variant="outline">Learn More</Button>

// MUTED - De-emphasized content
<p className="text-muted-foreground">Last updated 2 days ago</p>

// DESTRUCTIVE - Dangerous actions
<Button variant="destructive">Delete</Button>
```

---

## Contrast for Attention

| Element | Contrast Level | Example |
|---------|---------------|---------|
| Primary CTA | High | `bg-primary` on white |
| Secondary CTA | Medium | `border-primary` outline |
| Navigation | Low-Medium | `text-foreground` |
| Metadata | Low | `text-muted-foreground` |

---

## CHECKLIST: Visual Hierarchy

- [ ] Clear size hierarchy (5-6 levels)
- [ ] Color contrast creates emphasis
- [ ] Primary actions visually distinct
- [ ] Secondary elements appropriately de-emphasized
- [ ] Metadata and labels are smallest
