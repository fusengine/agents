---
name: formatting
description: Format nombres, dates, temps relatif, listes selon locale et Intl APIs
when-to-use: prix en devises, dates localisées, temps relatif, listes conjonctions
keywords: useFormatter, number, dateTime, relativeTime, list, currency, localization
priority: medium
requires: client-components.md
related: translations.md, configuration.md
---

# next-intl Formatting

## When to Use

- Display prices in local currency format
- Format dates according to user's locale
- Show relative time ("5 days ago")
- Format lists with proper conjunctions

## Why useFormatter

- **Locale-aware**: Automatically uses current locale
- **Consistent**: Same API for numbers, dates, lists
- **ICU standard**: Uses Intl APIs under the hood

## Numbers

```typescript
import { useFormatter } from 'next-intl'

function Component() {
  const format = useFormatter()

  format.number(1234.56)
  // en: "1,234.56" | fr: "1 234,56"

  format.number(1234.56, { style: 'currency', currency: 'EUR' })
  // en: "€1,234.56" | fr: "1 234,56 €"

  format.number(0.85, { style: 'percent' })
  // "85%"
}
```

## Dates

```typescript
const format = useFormatter()
const date = new Date('2024-01-15T10:30:00')

format.dateTime(date)
// en: "1/15/2024" | fr: "15/01/2024"

format.dateTime(date, { dateStyle: 'full' })
// en: "Monday, January 15, 2024"

format.dateTime(date, { timeStyle: 'short' })
// "10:30 AM"

format.dateTime(date, { year: 'numeric', month: 'long', day: 'numeric' })
// "January 15, 2024"
```

## Relative Time

```typescript
const format = useFormatter()
const date = new Date('2024-01-10')

format.relativeTime(date)
// "5 days ago"

format.relativeTime(date, { unit: 'day' })
// "5 days ago"

format.relativeTime(date, new Date('2024-01-15'))
// "5 days ago" (relative to second date)
```

## Lists

```typescript
const format = useFormatter()
const items = ['Apple', 'Banana', 'Orange']

format.list(items)
// en: "Apple, Banana, and Orange"
// fr: "Apple, Banana et Orange"

format.list(items, { type: 'disjunction' })
// "Apple, Banana, or Orange"
```

## In Messages (ICU)

```json
{
  "price": "Price: {price, number, ::currency/EUR}",
  "date": "Date: {date, date, medium}",
  "time": "Time: {time, time, short}"
}
```

```typescript
t('price', { price: 99.99 })
t('date', { date: new Date() })
```
