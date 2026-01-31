---
name: grids-layout
description: Grid system and layout best practices for responsive design
keywords: grid, layout, columns, gutters, margins, responsive, 12-column
priority: high
---

# Grids & Layout Guide

## WHY GRIDS MATTER

| Benefit | Description |
|---------|-------------|
| **Clarity** | Organized visual structure |
| **Consistency** | Uniform spacing and alignment |
| **Reusability** | Design patterns that scale |
| **Responsive** | Adaptable to all screen sizes |
| **First Impression** | Professional, polished appearance |

## GRID ANATOMY

```
┌──────────────────────────────────────────────────┐
│ ← MARGIN →│         CONTENT AREA         │← MARGIN →│
│           ├─────┬─────┬─────┬─────┬─────┤           │
│           │ COL │ GUT │ COL │ GUT │ COL │           │
│           │     │ TER │     │ TER │     │           │
│           ├─────┼─────┼─────┼─────┼─────┤           │
│           │     │     │     │     │     │  ← ROW    │
│           ├─────┼─────┼─────┼─────┼─────┤           │
│           │     │     │     │     │     │  ← ROW    │
│           └─────┴─────┴─────┴─────┴─────┘           │
└──────────────────────────────────────────────────┘
```

### Components

| Element | Description |
|---------|-------------|
| **Columns** | Vertical divisions (typically 12 for web) |
| **Gutters** | Spacing between columns |
| **Margins** | Outer padding around grid |
| **Rows** | Horizontal divisions (less common in web) |
| **Modules** | Intersection of column and row |

## 12-COLUMN SYSTEM (WEB STANDARD)

```tsx
// Tailwind CSS Implementation
<div className="container mx-auto px-4">
  <div className="grid grid-cols-12 gap-6">
    {/* Full width */}
    <div className="col-span-12">Header</div>

    {/* 2/3 + 1/3 split */}
    <div className="col-span-8">Main Content</div>
    <div className="col-span-4">Sidebar</div>

    {/* 3 equal columns */}
    <div className="col-span-4">Card 1</div>
    <div className="col-span-4">Card 2</div>
    <div className="col-span-4">Card 3</div>
  </div>
</div>
```

### Common Column Divisions

| Columns | Use Case |
|---------|----------|
| **12** | Full width content |
| **6 + 6** | Two equal halves |
| **8 + 4** | Content + sidebar |
| **4 + 4 + 4** | Three equal cards |
| **3 + 3 + 3 + 3** | Four equal items |

## GUTTER SIZING

| Size | Pixels | Tailwind | Use Case |
|------|--------|----------|----------|
| **xs** | 8px | gap-2 | Compact/mobile |
| **sm** | 16px | gap-4 | Standard mobile |
| **md** | 24px | gap-6 | Desktop standard |
| **lg** | 32px | gap-8 | Spacious layouts |
| **xl** | 48px | gap-12 | Hero sections |

```tsx
// Responsive gutters
<div className="grid gap-4 md:gap-6 lg:gap-8">
```

## MARGIN GUIDELINES

```tsx
// Container with responsive margins
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

**WARNING**: Minimal margins = cramped design, poor aesthetics.

## RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Columns | Use Case |
|------------|-------|---------|----------|
| **xs** | < 640px | 4 | Mobile |
| **sm** | ≥ 640px | 8 | Large mobile |
| **md** | ≥ 768px | 12 | Tablet |
| **lg** | ≥ 1024px | 12 | Desktop |
| **xl** | ≥ 1280px | 12 | Large desktop |
| **2xl** | ≥ 1536px | 12 | Ultra-wide |

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## LAYOUT PATTERNS

### Cards Grid
```tsx
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>
```

### Content + Sidebar
```tsx
<div className="grid lg:grid-cols-12 gap-8">
  <main className="lg:col-span-8">{content}</main>
  <aside className="lg:col-span-4">{sidebar}</aside>
</div>
```

### Hero Section
```tsx
<section className="container mx-auto px-4 py-16 lg:py-24">
  <div className="max-w-3xl mx-auto text-center">
    <h1>Headline</h1>
    <p>Description</p>
  </div>
</section>
```

### Masonry Layout
```tsx
<div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
  {items.map(item => (
    <div key={item.id} className="break-inside-avoid mb-6">
      <Card {...item} />
    </div>
  ))}
</div>
```

## CONTAINER QUERIES (2026)

```tsx
<div className="@container">
  <div className="grid gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
    {/* Responds to container width, not viewport */}
  </div>
</div>
```

## ALIGNMENT & SPACING

### Vertical Centering
```tsx
<div className="flex min-h-screen items-center justify-center">
  {/* Centered content */}
</div>
```

### Space Between Sections
```tsx
<main className="space-y-16 lg:space-y-24">
  <section>{/* Hero */}</section>
  <section>{/* Features */}</section>
  <section>{/* CTA */}</section>
</main>
```

## FORBIDDEN PATTERNS

- No grid system at all
- Inconsistent gutters across sections
- Zero margins on desktop
- Not adapting columns for mobile
- Fixed pixel widths instead of grid

## MOBILE-FIRST APPROACH

```tsx
// Start with single column, add complexity
<div className="
  grid
  grid-cols-1       /* Mobile: 1 column */
  sm:grid-cols-2    /* Tablet: 2 columns */
  lg:grid-cols-3    /* Desktop: 3 columns */
  xl:grid-cols-4    /* Large: 4 columns */
  gap-4
  sm:gap-6
  lg:gap-8
">
```

## ACCESSIBILITY CONSIDERATIONS

- [ ] Reading order matches visual order
- [ ] Semantic HTML (header, main, nav, aside)
- [ ] Skip to content link
- [ ] Landmark regions defined
- [ ] Logical focus order
