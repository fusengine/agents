# next-intl Translations

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

## Rich Text (HTML)

```typescript
t.rich('rich', {
  link: (chunks) => <a href="/docs">{chunks}</a>
})
// → "Please <a href="/docs">click here</a>"
```

## Raw HTML

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
