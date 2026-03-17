# Template: Scoped Astro Component

Complete component with scoped CSS, CSS custom properties, and `class:list`.

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  variant?: 'default' | 'featured' | 'muted';
  isHighlighted?: boolean;
}

const {
  title,
  variant = 'default',
  isHighlighted = false
} = Astro.props;
---

<article class:list={[
  'card',
  `card--${variant}`,
  { 'card--highlighted': isHighlighted }
]}>
  <h2 class="card__title">{title}</h2>
  <div class="card__body">
    <slot />
  </div>
</article>

<style>
  .card {
    padding: var(--space-4, 1rem);
    border-radius: var(--radius-md, 0.5rem);
    border: 1px solid var(--color-border, #e5e7eb);
    background: var(--color-surface, #f9fafb);
  }

  .card--featured {
    border-color: var(--color-primary, #6366f1);
    background: color-mix(in srgb, var(--color-primary, #6366f1) 5%, white);
  }

  .card--muted {
    opacity: 0.7;
  }

  .card--highlighted {
    box-shadow: 0 0 0 2px var(--color-primary, #6366f1);
  }

  .card__title {
    font-size: var(--text-xl, 1.25rem);
    font-weight: 600;
    margin: 0 0 var(--space-2, 0.5rem);
    color: var(--color-text, #1a1a1a);
  }

  .card__body {
    color: var(--color-text-muted, #6b7280);
    line-height: 1.6;
  }
</style>
```

## Usage

```astro
<Card title="My Post" variant="featured" isHighlighted>
  <p>Content here</p>
</Card>
```
