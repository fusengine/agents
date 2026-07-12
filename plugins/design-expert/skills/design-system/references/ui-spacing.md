---
name: ui-spacing
description: Spacing system, 8px grid, whitespace management, and density levels
when-to-use: Implementing consistent spacing, applying component padding, managing visual density
keywords: spacing, grid, whitespace, padding, margins, gaps, density
priority: high
related: ui-hierarchy.md, ui-trends-2026.md
---

# UI Spacing System

## Base Scale (8px Grid)

```
--spacing-0.5: 0.125rem;   /* 2px  - micro adjustments */
--spacing-1:   0.25rem;    /* 4px  - tight spacing */
--spacing-2:   0.5rem;     /* 8px  - base unit */
--spacing-3:   0.75rem;    /* 12px */
--spacing-4:   1rem;       /* 16px - standard gap */
--spacing-6:   1.5rem;     /* 24px - component padding */
--spacing-8:   2rem;       /* 32px - section gap */
--spacing-12:  3rem;       /* 48px - major sections */
--spacing-16:  4rem;       /* 64px - page sections */
--spacing-24:  6rem;       /* 96px - hero spacing */
```

---

## Usage Patterns

```tsx
// Component internal spacing
<Card className="p-6">                    {/* 24px padding */}
  <CardHeader className="space-y-1.5">   {/* 6px between items */}
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent className="pt-6">          {/* 24px top padding */}
    {content}
  </CardContent>
</Card>

// Grid gaps
<div className="grid gap-4 md:gap-6">    {/* 16px → 24px on desktop */}
  {items.map(item => <Card {...item} />)}
</div>

// Section spacing
<section className="py-16 md:py-24">     {/* Generous vertical rhythm */}
  <div className="container space-y-12"> {/* 48px between sub-sections */}
    ...
  </div>
</section>
```

---

## Whitespace Density Levels

```
COMPACT (Data tables, dashboards)
- Gap: 8px (gap-2)
- Padding: 12px (p-3)
- Row height: 40px

COMFORTABLE (Forms, cards)
- Gap: 16px (gap-4)
- Padding: 24px (p-6)
- Row height: 56px

SPACIOUS (Marketing, landing)
- Gap: 32px (gap-8)
- Padding: 48px (p-12)
- Section gap: 96px (py-24)
```

---

## Typography Spacing

```
LINE LENGTH:
✅ 70-80 characters optimal
⚠️ 50-70 acceptable for narrow columns
❌ 80+ forces head movement (fatigue)

LINE HEIGHT:
- Headlines: 1.1-1.2 (tight)
- Body text: 1.5-1.7 (comfortable)
- Dense UI: 1.4 (compact but readable)

PARAGRAPH SPACING:
- Between paragraphs: margin-bottom: 1em
- After headings: margin-top: 2em
```

```tsx
// CORRECT - Optimal readability
<article className="max-w-prose">
  <h1 className="text-4xl font-bold leading-tight">Headline</h1>
  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
    Lead paragraph with comfortable line height...
  </p>
  <div className="mt-8 space-y-4">
    <p className="leading-relaxed">Body paragraph...</p>
  </div>
</article>

// max-w-prose = ~65ch (ideal line length)
```

---

## CHECKLIST: Spacing

- [ ] 8px grid system
- [ ] Consistent component padding
- [ ] Generous whitespace on landing pages
- [ ] Tighter spacing for data-dense UIs
- [ ] Line length 70-80 characters
- [ ] Body text 16px minimum
- [ ] Comfortable line height (1.5-1.7)
