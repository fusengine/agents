# Container Queries

CSS `@container` lets components respond to their parent's size — not the viewport.

## When to Use Container Queries vs Media Queries

| Use Case | Tool |
|----------|------|
| Page-level layout (sidebar, columns) | Media query |
| Component-level layout (card, widget) | Container query |
| Same component used in multiple contexts | Container query |

## Setup

```css
/* Tailwind v4: @container is built-in */
/* Plain CSS: enable with @layer */
.container-parent {
  container-type: inline-size;
  container-name: card; /* optional name */
}
```

## Basic Pattern

```tsx
<div className="@container">
  <div className="flex flex-col @md:flex-row gap-4">
    <img className="w-full @md:w-48 shrink-0" />
    <div className="@md:flex-1">
      <h3 className="text-sm @md:text-base">Title</h3>
    </div>
  </div>
</div>
```

## Named Container

```tsx
<div className="@container/sidebar">
  <nav className="flex flex-col @[200px]/sidebar:flex-row gap-2">
    ...
  </nav>
</div>
```

## Card in Multiple Contexts

```tsx
// Same card component — layout changes based on container
<article className="@container rounded-xl p-4">
  <div className="grid grid-cols-1 @sm:grid-cols-[auto_1fr] gap-4">
    <div className="@sm:row-span-2">
      <img className="w-full @sm:w-24 rounded-lg" />
    </div>
    <h2 className="font-semibold">Title</h2>
    <p className="text-muted-foreground text-sm hidden @sm:block">Description</p>
  </div>
</article>
```

## Tailwind v4 Container Breakpoints

| Variant | Container Width |
|---------|----------------|
| `@xs:` | ≥ 320px |
| `@sm:` | ≥ 384px |
| `@md:` | ≥ 448px |
| `@lg:` | ≥ 512px |
| `@xl:` | ≥ 576px |
| `@2xl:` | ≥ 672px |
| `@[400px]:` | ≥ custom value |
