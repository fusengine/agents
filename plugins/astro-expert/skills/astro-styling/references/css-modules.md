# CSS Modules in Astro

## Overview

CSS Modules provide scoped, unique class names through a `.module.css` naming convention. Best for UI framework components (React, Vue, Svelte) co-located with Astro.

## Import Pattern

```typescript
import styles from './Button.module.css';

// styles object maps original names to unique identifiers
// styles.primary → "Button_primary_abc123"
```

## Usage in Frameworks

### React Component

```tsx
import styles from './Card.module.css';

export function Card({ title, children }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
```

### CSS Module File

```css
/* Card.module.css */
.card {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
}

.title {
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
}

.body {
  color: var(--color-text-muted);
}
```

## Combining Classes

```tsx
import styles from './Button.module.css';

function Button({ variant = 'primary', disabled }) {
  const classes = [
    styles.button,
    styles[variant],
    disabled && styles.disabled
  ].filter(Boolean).join(' ');

  return <button className={classes}>Click</button>;
}
```

## When to Use CSS Modules vs Scoped Styles

| Scenario | Use |
|----------|-----|
| `.astro` component | `<style>` scoped block |
| React/Vue/Svelte component | CSS Modules |
| Shared across frameworks | CSS Modules |
| Dynamic class logic in frameworks | CSS Modules |
