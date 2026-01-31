---
name: cards-guide
description: Card design patterns with anatomy, layouts, and best practices
keywords: cards, grid, masonry, anatomy, content priority, responsive
priority: medium
---

# Card Design Guide

## CARD PURPOSE

Cards are **concise previews** that help users:
- Make quick decisions
- Scan content efficiently
- Navigate to detailed views

## CARD ANATOMY

```
┌────────────────────────────────┐
│ [PHOTO/IMAGE]                  │ ← Media (optional)
├────────────────────────────────┤
│ [ICON] Header Text             │ ← Title + icon
│ Short description text here    │ ← Description (max 3 lines)
│                                │
│ $999        [Button text]      │ ← Price + CTA
└────────────────────────────────┘
```

## LAYOUT PATTERNS

### Horizontal Carousel
```tsx
<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory">
  {cards.map(card => (
    <div key={card.id} className="snap-start shrink-0 w-72">
      <Card {...card} />
    </div>
  ))}
</div>
```

### Vertical Stack
```tsx
<div className="flex flex-col gap-4">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>
```

### Grid (Equal Height)
```tsx
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>
```

### Masonry (Variable Height)
```tsx
<div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
  {cards.map(card => (
    <div key={card.id} className="break-inside-avoid mb-6">
      <Card {...card} />
    </div>
  ))}
</div>
```

## CONTENT PRIORITY RULES

### Include (Essential)
- Primary image/media
- Title (1-2 lines max)
- Key info (price, date, status)
- Single primary action

### Exclude (Move to Detail View)
- Long descriptions
- Multiple actions
- Secondary metadata
- Complex forms

```tsx
// ✅ Concise card
<Card>
  <CardImage src={product.image} />
  <CardTitle>{product.name}</CardTitle>
  <CardPrice>${product.price}</CardPrice>
  <Button>Add to Cart</Button>
</Card>

// ❌ Overloaded card
<Card>
  <CardImage src={product.image} />
  <CardTitle>{product.name}</CardTitle>
  <CardDescription>{product.fullDescription}</CardDescription> {/* TOO LONG */}
  <CardSpecs>{specs.map(...)}</CardSpecs> {/* TOO DETAILED */}
  <Button>Add to Cart</Button>
  <Button>Compare</Button>  {/* TOO MANY CTAs */}
  <Button>Share</Button>
</Card>
```

## TEXT LIMITS

| Element | Max Lines | Tailwind |
|---------|-----------|----------|
| Title | 2 lines | `line-clamp-2` |
| Description | 3 lines | `line-clamp-3` |
| Meta | 1 line | `truncate` |

```tsx
<h3 className="line-clamp-2 font-semibold">{title}</h3>
<p className="line-clamp-3 text-muted-foreground">{description}</p>
```

## BUTTON RULES

- **Maximum 1 primary button** per card
- Secondary actions → icon buttons or dropdown
- Full-width button for mobile/compact cards

```tsx
// ✅ Single CTA
<Button className="w-full">Buy Now</Button>

// ✅ Primary + subtle secondary
<div className="flex items-center justify-between">
  <Button>Buy Now</Button>
  <Button variant="ghost" size="icon">
    <Heart className="h-4 w-4" />
  </Button>
</div>

// ❌ Too many buttons
<div className="flex gap-2">
  <Button>Buy</Button>
  <Button>Compare</Button>
  <Button>Share</Button>
  <Button>Save</Button>
</div>
```

## INTERACTIVE PATTERNS

### Hover Effect (Desktop)
```tsx
<motion.div
  className="rounded-xl border bg-card p-4 shadow-sm"
  whileHover={{ y: -4, shadow: "lg" }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {children}
</motion.div>
```

### Clickable Card (Full Surface)
```tsx
<Link href={`/products/${id}`} className="group block">
  <Card className="transition-shadow group-hover:shadow-md">
    <CardContent>
      <h3 className="group-hover:text-primary transition-colors">{title}</h3>
    </CardContent>
  </Card>
</Link>
```

### Focus State (Accessibility)
```tsx
<Card className="focus-within:ring-2 focus-within:ring-primary">
  <Link href={href} className="focus:outline-none">
    {content}
  </Link>
</Card>
```

## RESPONSIVE BEHAVIOR

```tsx
// 1 → 2 → 3 → 4 columns
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>
```

### Card Size Variants
```tsx
// Compact (mobile, sidebar)
<Card className="p-3">
  <div className="flex items-center gap-3">
    <Image className="h-12 w-12 rounded" />
    <div>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-xs text-muted-foreground">{meta}</p>
    </div>
  </div>
</Card>

// Standard (grid)
<Card className="p-4">
  <Image className="aspect-video rounded-lg" />
  <h3 className="mt-3 font-semibold">{title}</h3>
  <p className="text-sm text-muted-foreground">{description}</p>
</Card>

// Featured (hero)
<Card className="p-6">
  <Image className="aspect-[16/9] rounded-xl" />
  <h2 className="mt-4 text-2xl font-bold">{title}</h2>
  <p className="mt-2 text-muted-foreground">{description}</p>
  <Button className="mt-4">Learn More</Button>
</Card>
```

## SPACING CONSISTENCY

| Element | Spacing | Tailwind |
|---------|---------|----------|
| Card padding | 16-24px | `p-4` or `p-6` |
| Between elements | 8-16px | `gap-2` to `gap-4` |
| Between cards | 16-24px | `gap-4` or `gap-6` |
| Image margin-bottom | 12-16px | `mb-3` or `mb-4` |

## FORBIDDEN PATTERNS

- More than 3 lines of description
- Multiple primary buttons
- Filler/placeholder content
- Inconsistent padding across cards
- Missing hover/focus states
- Cards without clear clickable area

## ACCESSIBILITY CHECKLIST

- [ ] Interactive elements keyboard accessible
- [ ] Focus visible on clickable cards
- [ ] Image alt text provided
- [ ] Card role="article" if standalone
- [ ] Links have meaningful text
- [ ] Color contrast 4.5:1 for text
