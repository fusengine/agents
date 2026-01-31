# Date and Number Formatting

Locale-aware formatting using i18next with Intl API.

---

## i18n Configuration

### src/i18n/config.ts

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  // ... other config

  interpolation: {
    escapeValue: false,

    // Custom format function for dates and numbers
    format: (value, format, lng) => {
      // Date formatting
      if (value instanceof Date) {
        return formatDate(value, format, lng)
      }

      // Number formatting
      if (typeof value === 'number') {
        return formatNumber(value, format, lng)
      }

      return value
    },
  },
})

/**
 * Format date using Intl.DateTimeFormat.
 */
function formatDate(date: Date, format: string | undefined, lng: string | undefined): string {
  const locale = lng || 'en'

  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'short',
      }).format(date)

    case 'long':
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'long',
      }).format(date)

    case 'full':
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'full',
      }).format(date)

    case 'time':
      return new Intl.DateTimeFormat(locale, {
        timeStyle: 'short',
      }).format(date)

    case 'datetime':
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)

    case 'relative':
      return formatRelativeTime(date, locale)

    default:
      return new Intl.DateTimeFormat(locale).format(date)
  }
}

/**
 * Format number using Intl.NumberFormat.
 */
function formatNumber(value: number, format: string | undefined, lng: string | undefined): string {
  const locale = lng || 'en'

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: getCurrencyForLocale(locale),
      }).format(value)

    case 'percent':
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(value)

    case 'compact':
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
      }).format(value)

    case 'decimal':
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)

    default:
      return new Intl.NumberFormat(locale).format(value)
  }
}

/**
 * Format relative time (e.g., "2 hours ago").
 */
function formatRelativeTime(date: Date, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diffInSeconds = (date.getTime() - Date.now()) / 1000

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(Math.round(diffInSeconds), 'second')
  }
  if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(Math.round(diffInSeconds / 60), 'minute')
  }
  if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(Math.round(diffInSeconds / 3600), 'hour')
  }
  if (Math.abs(diffInSeconds) < 2592000) {
    return rtf.format(Math.round(diffInSeconds / 86400), 'day')
  }
  if (Math.abs(diffInSeconds) < 31536000) {
    return rtf.format(Math.round(diffInSeconds / 2592000), 'month')
  }
  return rtf.format(Math.round(diffInSeconds / 31536000), 'year')
}

/**
 * Get currency code for locale.
 */
function getCurrencyForLocale(locale: string): string {
  const currencyMap: Record<string, string> = {
    'en': 'USD',
    'en-GB': 'GBP',
    'en-US': 'USD',
    'fr': 'EUR',
    'de': 'EUR',
    'ja': 'JPY',
  }
  return currencyMap[locale] || 'USD'
}

export default i18n
```

---

## Translation Files

### public/locales/en/common.json

```json
{
  "dates": {
    "created": "Created: {{date, short}}",
    "updated": "Last updated: {{date, long}}",
    "event": "Event on {{date, full}}",
    "time": "Time: {{date, time}}",
    "full": "{{date, datetime}}",
    "ago": "{{date, relative}}"
  },
  "numbers": {
    "price": "Price: {{amount, currency}}",
    "discount": "Discount: {{value, percent}}",
    "users": "{{count, compact}} users",
    "balance": "Balance: {{amount, decimal}}",
    "total": "Total: {{value}}"
  },
  "order": {
    "summary": "Order placed on {{date, long}} for {{amount, currency}}"
  }
}
```

---

## Usage in Components

### DateDisplay.tsx

```typescript
import { useTranslation } from 'react-i18next'

interface DateDisplayProps {
  date: Date
}

/**
 * Display formatted date.
 */
export function DateDisplay({ date }: DateDisplayProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <p>{t('dates.created', { date })}</p>
      <p>{t('dates.updated', { date })}</p>
      <p>{t('dates.event', { date })}</p>
      <p>{t('dates.time', { date })}</p>
      <p>{t('dates.full', { date })}</p>
      <p>{t('dates.ago', { date })}</p>
    </div>
  )
}
```

### Output (English)

```text
Created: 1/31/26
Last updated: January 31, 2026
Event on Friday, January 31, 2026
Time: 2:30 PM
January 31, 2026, 2:30 PM
2 hours ago
```

### Output (French)

```text
Created: 31/01/26
Last updated: 31 janvier 2026
Event on vendredi 31 janvier 2026
Time: 14:30
31 janv. 2026, 14:30
il y a 2 heures
```

---

## Number Formatting Component

### PriceDisplay.tsx

```typescript
import { useTranslation } from 'react-i18next'

interface PriceDisplayProps {
  amount: number
  discount?: number
}

/**
 * Display formatted price with optional discount.
 */
export function PriceDisplay({ amount, discount }: PriceDisplayProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-1">
      <p className="text-2xl font-bold">
        {t('numbers.price', { amount })}
      </p>
      {discount && (
        <p className="text-green-600">
          {t('numbers.discount', { value: discount })}
        </p>
      )}
    </div>
  )
}
```

### Output

```text
English: Price: $99.99 | Discount: 15%
French:  Price: 99,99 € | Discount: 15 %
German:  Price: 99,99 € | Discount: 15 %
```

---

## Compact Number Display

### UserCount.tsx

```typescript
import { useTranslation } from 'react-i18next'

/**
 * Display user count in compact format.
 */
export function UserCount({ count }: { count: number }) {
  const { t } = useTranslation()

  return (
    <span className="text-gray-600">
      {t('numbers.users', { count })}
    </span>
  )
}
```

### Output

```text
1234 users       → 1.2K users (en) / 1,2 k users (fr)
1234567 users    → 1.2M users (en) / 1,2 M users (fr)
```

---

## Custom Formatting Hook

### hooks/useFormatters.ts

```typescript
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

/**
 * Hook for locale-aware formatters.
 */
export function useFormatters() {
  const { i18n } = useTranslation()
  const locale = i18n.language

  return useMemo(() => ({
    /**
     * Format date.
     */
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, options).format(date)
    },

    /**
     * Format number.
     */
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, options).format(value)
    },

    /**
     * Format currency.
     */
    formatCurrency: (value: number, currency = 'USD') => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(value)
    },

    /**
     * Format percent.
     */
    formatPercent: (value: number) => {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(value)
    },

    /**
     * Format relative time.
     */
    formatRelative: (date: Date) => {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
      const diff = (date.getTime() - Date.now()) / 1000

      if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second')
      if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute')
      if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
      return rtf.format(Math.round(diff / 86400), 'day')
    },
  }), [locale])
}
```

### Usage

```typescript
function OrderSummary({ order }: { order: Order }) {
  const { formatDate, formatCurrency } = useFormatters()

  return (
    <div>
      <p>Order Date: {formatDate(order.createdAt, { dateStyle: 'long' })}</p>
      <p>Total: {formatCurrency(order.total, 'EUR')}</p>
    </div>
  )
}
```

---

## Format Examples by Locale

### Date Formats

| Format | English | French | German |
|--------|---------|--------|--------|
| short | 1/31/26 | 31/01/26 | 31.01.26 |
| long | January 31, 2026 | 31 janvier 2026 | 31. Januar 2026 |
| full | Friday, January 31, 2026 | vendredi 31 janvier 2026 | Freitag, 31. Januar 2026 |

### Number Formats

| Format | English | French | German |
|--------|---------|--------|--------|
| decimal | 1,234.56 | 1 234,56 | 1.234,56 |
| currency | $1,234.56 | 1 234,56 € | 1.234,56 € |
| percent | 12.3% | 12,3 % | 12,3 % |
| compact | 1.2K | 1,2 k | 1234 |

---

## Best Practices

| Practice | Description |
|----------|-------------|
| Use Intl API | Browser-native, locale-aware |
| Custom formats | Define named formats in config |
| Consistent keys | Use `{{value, format}}` pattern |
| Memoize formatters | Avoid recreating on each render |
| Test locales | Verify format differences |
