---
name: patterns-cards
description: Card UI patterns and component variations
when-to-use: Creating card-based layouts, implementing card interactions, designing card hierarchies
keywords: cards, patterns, components, interactive, feature cards, skeleton
priority: high
related: patterns-buttons.md, patterns-navigation.md, design-patterns.md
---

# Card Patterns

## Standard Card

```tsx
<div className="rounded-xl border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold">{title}</h3>
  <p className="mt-2 text-muted-foreground">{description}</p>
</div>
```

---

## Interactive Card

```tsx
<motion.div
  className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
  whileHover={{ y: -4 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {/* Content */}
</motion.div>
```

---

## Feature Card

```tsx
<div className="flex flex-col items-center text-center p-6">
  <div className="rounded-full bg-primary/10 p-3 mb-4">
    <Icon className="h-6 w-6 text-primary" />
  </div>
  <h3 className="font-semibold">{title}</h3>
  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
</div>
```

---

## Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-muted p-4 mb-4">
    <Inbox className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="font-semibold">No items yet</h3>
  <p className="mt-1 text-sm text-muted-foreground max-w-sm">
    Get started by creating your first item.
  </p>
  <Button className="mt-4">Create item</Button>
</div>
```

---

## Loading States - Skeleton

```tsx
<div className="space-y-3">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>
```

---

## Loading States - Spinner

```tsx
<div className="flex items-center justify-center">
  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
</div>
```

---

## Alert/Callout Patterns (NO border-left)

### Icon-Led Alert (PREFERRED)

```tsx
<div className="flex gap-3 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/50">
  <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
  <div>
    <p className="font-medium text-blue-900 dark:text-blue-100">Info</p>
    <p className="text-sm text-blue-700 dark:text-blue-300">{message}</p>
  </div>
</div>
```

---

## Glassmorphism Alert

```tsx
<div className="rounded-2xl backdrop-blur-md bg-white/30 dark:bg-white/5 p-4 shadow-lg border border-white/20">
  <div className="flex items-center gap-2">
    <CheckCircle className="h-5 w-5 text-emerald-500" />
    <span className="font-medium">Success</span>
  </div>
  <p className="mt-1 text-sm text-muted-foreground">{message}</p>
</div>
```

---

## Corner Ribbon Status

```tsx
<div className="relative overflow-hidden rounded-xl bg-card p-6 shadow-md">
  <div className="absolute -right-10 top-4 rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 px-12 py-1 text-xs font-bold text-white shadow-lg">
    NEW
  </div>
  {children}
</div>
```

---

## Shadow-Based Status

```tsx
const statusShadows = {
  info: 'shadow-blue-200/50 dark:shadow-blue-900/30',
  success: 'shadow-emerald-200/50 dark:shadow-emerald-900/30',
  warning: 'shadow-amber-200/50 dark:shadow-amber-900/30',
  error: 'shadow-red-200/50 dark:shadow-red-900/30',
};

<div className={cn(
  "rounded-2xl bg-card p-4 shadow-lg transition-shadow hover:shadow-xl",
  statusShadows[status]
)}>
  {children}
</div>
```

---

## Bento Grids

```tsx
// Bento layout - varying card sizes
<div className="grid grid-cols-4 gap-4">
  {/* Large featured card */}
  <Card className="col-span-2 row-span-2">
    <span className="text-4xl font-bold">$12.5M</span>
    <span className="text-muted-foreground">Total Revenue</span>
  </Card>

  {/* Standard cards */}
  <Card className="col-span-1">
    <span className="text-2xl font-bold">2,847</span>
    <span className="text-sm text-muted-foreground">Users</span>
  </Card>

  <Card className="col-span-1">
    <span className="text-2xl font-bold">94%</span>
    <span className="text-sm text-muted-foreground">Satisfaction</span>
  </Card>

  {/* Wide card */}
  <Card className="col-span-2">
    <Chart data={weeklyData} />
  </Card>
</div>
```

---

## Grid Layouts

```tsx
// 1-2-3 column responsive
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// 1-2-4 column responsive
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {features.map(f => <FeatureCard key={f.id} {...f} />)}
</div>
```

---

## Container Queries

```tsx
<div className="@container">
  <div className="grid gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
    {/* Responds to container, not viewport */}
  </div>
</div>
```

---

## CHECKLIST: Card Patterns

- [ ] Clear visual hierarchy in cards
- [ ] Consistent padding and spacing
- [ ] Interactive states (hover, focus)
- [ ] Empty state messaging
- [ ] Loading states
- [ ] Alert/status feedback
- [ ] Responsive grid layouts
