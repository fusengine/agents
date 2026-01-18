# Design Patterns UI/UX

## Visual Hierarchy

### Size & Weight

```
Hierarchy Scale:
1. Hero headline → text-5xl/6xl font-bold
2. Section title → text-3xl/4xl font-semibold
3. Card title → text-xl/2xl font-medium
4. Body text → text-base font-normal
5. Caption/meta → text-sm text-muted-foreground
```

### Contrast & Color

```css
/* Primary action - high contrast */
.btn-primary {
  @apply bg-primary text-primary-foreground;
}

/* Secondary action - medium contrast */
.btn-secondary {
  @apply bg-secondary text-secondary-foreground;
}

/* Ghost action - low contrast */
.btn-ghost {
  @apply bg-transparent hover:bg-accent;
}
```

## Spacing Consistency

### Component Spacing

```
Card padding: p-6 (24px)
Section gap: gap-8 or gap-12 (32-48px)
Form fields: space-y-4 (16px)
Button groups: gap-2 or gap-3 (8-12px)
List items: space-y-2 (8px)
```

### Page Layout

```tsx
// Consistent container
<main className="container mx-auto px-4 py-8 md:py-12">
  <section className="space-y-6">
    {/* Content */}
  </section>
</main>
```

## Card Patterns

### Standard Card

```tsx
<div className="rounded-xl border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold">{title}</h3>
  <p className="mt-2 text-muted-foreground">{description}</p>
</div>
```

### Interactive Card

```tsx
<motion.div
  className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
  whileHover={{ y: -4 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {/* Content */}
</motion.div>
```

### Feature Card

```tsx
<div className="flex flex-col items-center text-center p-6">
  <div className="rounded-full bg-primary/10 p-3 mb-4">
    <Icon className="h-6 w-6 text-primary" />
  </div>
  <h3 className="font-semibold">{title}</h3>
  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
</div>
```

## Button Patterns

### Size Variants

```tsx
// Sizes
<Button size="sm">Small</Button>   // h-8 px-3 text-sm
<Button size="default">Default</Button>  // h-10 px-4
<Button size="lg">Large</Button>   // h-12 px-6 text-lg
```

### Icon Buttons

```tsx
// Icon with text
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Label
</Button>

// Icon only
<Button size="icon" variant="ghost">
  <Icon className="h-4 w-4" />
  <span className="sr-only">Action</span>
</Button>
```

## Form Patterns

### Input Group

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="name@example.com" />
  <p className="text-sm text-muted-foreground">
    We'll never share your email.
  </p>
</div>
```

### Error State

```tsx
<div className="space-y-2">
  <Label htmlFor="email" className="text-destructive">Email</Label>
  <Input
    id="email"
    className="border-destructive focus-visible:ring-destructive"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-destructive">
    Please enter a valid email address.
  </p>
</div>
```

## Navigation Patterns

### Responsive Navbar

```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
  <nav className="container flex h-16 items-center justify-between">
    <Logo />
    {/* Desktop nav */}
    <div className="hidden md:flex items-center gap-6">
      {links.map(link => <NavLink key={link.href} {...link} />)}
    </div>
    {/* Mobile menu */}
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent>{/* Mobile links */}</SheetContent>
    </Sheet>
  </nav>
</header>
```

## Loading States

### Skeleton

```tsx
<div className="space-y-3">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>
```

### Spinner

```tsx
<div className="flex items-center justify-center">
  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
</div>
```

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

## Responsive Patterns

### Grid Layouts

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

### Container Queries

```tsx
<div className="@container">
  <div className="grid gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
    {/* Responds to container, not viewport */}
  </div>
</div>
```

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

### Glassmorphism Alert

```tsx
<div className="rounded-2xl backdrop-blur-md bg-white/30 dark:bg-white/5 p-4 shadow-lg border border-white/20">
  <div className="flex items-center gap-2">
    <CheckCircle className="h-5 w-5 text-emerald-500" />
    <span className="font-medium">Success</span>
  </div>
  <p className="mt-1 text-sm text-muted-foreground">{message}</p>
</div>
```

### Corner Ribbon Status

```tsx
<div className="relative overflow-hidden rounded-xl bg-card p-6 shadow-md">
  <div className="absolute -right-10 top-4 rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 px-12 py-1 text-xs font-bold text-white shadow-lg">
    NEW
  </div>
  {children}
</div>
```

### Shadow-Based Status

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

## Dark Mode Patterns

### Semantic Colors

```css
/* Use semantic tokens that auto-switch */
.card {
  @apply bg-card text-card-foreground;
}

/* Background with transparency */
.overlay {
  @apply bg-background/80 backdrop-blur-sm;
}

/* Borders that adapt */
.divider {
  @apply border-border;
}
```

### Explicit Dark Variants

```tsx
<div className="bg-white dark:bg-slate-900">
  <p className="text-slate-900 dark:text-slate-100">
    Content
  </p>
</div>
```
