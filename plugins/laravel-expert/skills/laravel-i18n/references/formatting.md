---
name: formatting
description: Date, number, and currency formatting by locale
when-to-use: Displaying localized dates, numbers, currencies, percentages
keywords: NumberFormatter, Carbon, date, currency, number, format
---

# Locale-Aware Formatting

## Decision Tree

```
Format type?
├── Date/Time → Carbon::setLocale() + isoFormat()
├── Number → NumberFormatter::DECIMAL
├── Currency → NumberFormatter::CURRENCY
├── Percentage → NumberFormatter::PERCENT
└── Custom → Create helper function
```

## Carbon Date Formatting

| Method | Output (fr) |
|--------|-------------|
| `$date->isoFormat('LLLL')` | lundi 3 février 2026 10:30 |
| `$date->translatedFormat('l d F Y')` | lundi 03 février 2026 |
| `$date->diffForHumans()` | il y a 2 heures |
| `$date->monthName` | février |
| `$date->dayName` | lundi |

## Carbon Setup

| Method | Purpose |
|--------|---------|
| `Carbon::setLocale(App::currentLocale())` | Set locale |
| `Carbon::getLocale()` | Get current locale |

## NumberFormatter Types

| Constant | Purpose | Example (fr) |
|----------|---------|--------------|
| `DECIMAL` | Numbers | 1 234 567,89 |
| `CURRENCY` | Money | 1 234,56 € |
| `PERCENT` | Percentages | 16 % |
| `SPELLOUT` | Words | mille deux cent |
| `ORDINAL` | Ordinals | 1er, 2e |

## Number Formatting

| Locale | 1234567.89 |
|--------|------------|
| en | 1,234,567.89 |
| fr | 1 234 567,89 |
| de | 1.234.567,89 |

## Currency Formatting

| Locale | €1234.56 |
|--------|----------|
| en | €1,234.56 |
| fr | 1 234,56 € |
| de | 1.234,56 € |

## Percentage Formatting

| Locale | 0.156 |
|--------|-------|
| en | 16% |
| fr | 16 % |
| de | 16 % |

## Helper Functions

| Helper | Purpose |
|--------|---------|
| `format_money($amount, $currency)` | Currency with locale |
| `format_number($value)` | Number with locale |
| `format_date($date, $format)` | Date with locale |

## In Blade

| Usage | Purpose |
|-------|---------|
| `{{ $date->isoFormat('LL') }}` | Localized date |
| `{{ format_money($price, 'EUR') }}` | Localized currency |

## Best Practices

| DO | DON'T |
|----|-------|
| Set Carbon locale in middleware | Format dates without locale |
| Create helpers for common formats | Repeat NumberFormatter code |
| Use isoFormat for localized dates | Use format() for user-facing dates |
| Cache NumberFormatter instances | Create new instance per format |

→ **See template**: [LocaleServiceProvider.php.md](templates/LocaleServiceProvider.php.md)
