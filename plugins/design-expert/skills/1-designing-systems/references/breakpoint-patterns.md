# Breakpoint Patterns

## Sidebar Collapse Pattern

```tsx
// Sidebar: full at lg, icon-only at md, hidden at sm
<aside className="
  hidden sm:block
  w-16 md:w-16 lg:w-64
  transition-all duration-300
">
  <nav>
    <a className="flex items-center gap-3 px-3 py-2">
      <Icon className="shrink-0 h-5 w-5" />
      <span className="hidden lg:block">Dashboard</span>
    </a>
  </nav>
</aside>
```

## Stacked Layout Pattern

```tsx
// Side-by-side on desktop, stacked on mobile
<div className="flex flex-col lg:flex-row gap-6">
  <main className="flex-1 min-w-0">Main content</main>
  <aside className="w-full lg:w-80 shrink-0">Sidebar</aside>
</div>
```

## Fluid Grid Pattern

```tsx
// Auto-fit grid: fills columns based on available width
<div className="grid gap-4"
  style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## Responsive Table Pattern

```tsx
// Table → card list on mobile
<div className="hidden md:block">
  <table>...</table>
</div>
<div className="md:hidden space-y-3">
  {rows.map(row => <MobileCard key={row.id} row={row} />)}
</div>
```

## Navigation Collapse

```tsx
// Horizontal nav → hamburger menu on mobile
<nav className="hidden md:flex items-center gap-6">...</nav>
<button className="md:hidden" aria-label="Open menu">
  <Menu className="h-6 w-6" />
</button>
```

## Rules
- Always mobile-first (base → sm → md → lg → xl)
- Use `min-w-0` on flex children to prevent overflow
- Use `shrink-0` on fixed-width elements in flex containers
- Test at 320px, 375px, 768px, 1024px, 1440px
