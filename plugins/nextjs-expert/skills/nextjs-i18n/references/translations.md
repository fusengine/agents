---
name: translations
description: Utilisation des messages ICU, interpolation, pluralisation et texte enrichi
when-to-use: afficher texte traduit, pluralisation, variables dans texte, composants React
keywords: useTranslations, ICU format, t.rich, t.markup, messages, namespaces
priority: high
requires: installation.md, translations.md
related: formatting.md, messages-validation.md
---

# next-intl Translations

## When to Use

- Display text in user's language
- Handle pluralization (1 item vs 5 items)
- Inject variables into messages
- Render rich text with HTML/React components

## Why ICU Message Format

| Feature | Template Strings | ICU Format |
|---------|------------------|------------|
| Pluralization | Manual if/else | Built-in |
| Gender | Not supported | `{gender, select, ...}` |
| Rich text | Dangerous innerHTML | Safe `t.rich()` |
| Tooling | None | Industry standard |

## useTranslations Hook

```typescript
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('Namespace')
  return <p>{t('key')}</p>
}
```

## Message Syntax (ICU)

```json
{
  "Namespace": {
    "simple": "Hello",
    "interpolation": "Hello {name}",
    "plural": "You have {count, plural, =0 {no items} one {# item} other {# items}}",
    "select": "{gender, select, male {He} female {She} other {They}} is online",
    "rich": "Please <link>click here</link>"
  }
}
```

## Interpolation

```typescript
t('interpolation', { name: 'John' })
// → "Hello John"
```

## Pluralization

```typescript
t('plural', { count: 0 })  // → "You have no items"
t('plural', { count: 1 })  // → "You have 1 item"
t('plural', { count: 5 })  // → "You have 5 items"
```

## Rich Text (React Components)

```typescript
t.rich('rich', {
  link: (chunks) => <a href="/docs">{chunks}</a>
})
// → "Please <a href="/docs">click here</a>"
```

## Raw Markup

```typescript
t.markup('html', {
  b: (chunks) => `<b>${chunks}</b>`
})
```

## Nested Keys

```json
{ "nav": { "home": "Home", "about": "About" } }
```

```typescript
const t = useTranslations('nav')
t('home')  // → "Home"

// Or access nested
const t = useTranslations()
t('nav.home')  // → "Home"
```

## Default Values

```typescript
t('mayNotExist', { defaultValue: 'Fallback' })
```
