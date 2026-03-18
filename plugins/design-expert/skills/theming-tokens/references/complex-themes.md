# Complex Themes — Multi-Level Token Architecture

## When You Need This

Simple apps: 2-tier (primitive + semantic) is enough.
Large apps (dashboards, design systems, multi-context): use 3-tier.

## The 3-Tier System

```
Tier 1 — Primitive    Raw values, never used directly in components
Tier 2 — Semantic     Meaning-based aliases (what it IS)
Tier 3 — Component    Context-specific (what it DOES in one component)
```

## Example: Button Component Tokens

```css
/* Tier 1 — Primitives */
:root {
  --blue-500: oklch(55% 0.20 260);
  --blue-600: oklch(48% 0.20 260);
  --white:    oklch(100% 0 0);
}

/* Tier 2 — Semantic */
:root {
  --color-primary:          var(--blue-500);
  --color-primary-hover:    var(--blue-600);
  --color-primary-text:     var(--white);
}

/* Tier 3 — Component */
:root {
  --button-primary-bg:      var(--color-primary);
  --button-primary-bg-hover:var(--color-primary-hover);
  --button-primary-text:    var(--color-primary-text);
  --button-primary-radius:  var(--radius-lg);
  --button-primary-height:  2.5rem;
}
```

## Contextual Overrides (same component, different context)

```css
/* Default button in app context */
.button-primary {
  background: var(--button-primary-bg);
}

/* Override for sidebar context */
[data-context="sidebar"] .button-primary {
  --button-primary-bg: var(--color-surface-2);
  --button-primary-text: var(--color-foreground);
}

/* Override for danger zone */
[data-context="danger"] .button-primary {
  --button-primary-bg: var(--color-error);
}
```

## Dark Mode at Each Tier

```css
/* Only Tier 1 and Tier 2 need dark overrides — Tier 3 inherits */
.dark {
  --blue-500: oklch(65% 0.17 260);   /* adjusted for dark bg */
  --color-primary: var(--blue-500);  /* automatically updates */
  /* button-primary-bg inherits — no change needed */
}
```

## Scale: Token Naming Convention

```
--[tier]-[category]-[variant]-[state]

Examples:
--color-primary                  (semantic, base)
--color-primary-hover            (semantic, state)
--button-primary-bg              (component, property)
--button-primary-bg-hover        (component, property, state)
--form-input-border-focus        (component, property, state)
```

## Rules
- Components consume Tier 3 tokens only
- Never reference a Tier 1 token from a component
- Dark mode overrides at Tier 1 and Tier 2 — never at Tier 3
- Document every token with a comment explaining its purpose
