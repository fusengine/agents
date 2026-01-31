---
name: interpolation
description: Dynamic values in translations - variables, formatting, nesting, dates, numbers
when-to-use: dynamic content, user names, dates, numbers, currency
keywords: interpolation, variables, formatting, dates, numbers, currency
priority: medium
related: pluralization.md, templates/date-number-formatter.md
---

# Interpolation & Formatting

## Basic Interpolation

**Insert dynamic values into translations.**

### Purpose
- Personalize messages with names
- Display dynamic data
- Avoid string concatenation

### When to Use
- User greetings
- Dynamic content display
- Any variable in text

### Key Points
- Use `{{variable}}` in translation
- Pass values object to `t()`
- Variables are HTML-escaped by default
- Works with any data type

---

## Number Formatting

**Locale-aware number display.**

### Purpose
- Format numbers per locale
- Display currency properly
- Show percentages

### When to Use
- Prices and currency
- Statistics and metrics
- Progress percentages

### Key Points
- Uses Intl.NumberFormat
- Configure via format function
- Locale-specific separators
- Currency symbol placement

---

## Date Formatting

**Locale-aware date and time display.**

### Purpose
- Format dates per locale
- Display relative time
- Consistent date presentation

### When to Use
- Created/updated timestamps
- Event dates
- Relative time (2 hours ago)

### Key Points
- Uses Intl.DateTimeFormat
- Multiple preset formats
- Relative time with RelativeTimeFormat
- Timezone handling

---

## Nested Translations

**Reference other translations within a translation.**

### Purpose
- Reuse common phrases
- Compose complex messages
- Reduce duplication

### When to Use
- Repeated phrases
- Building block messages
- Shared terminology

### Key Points
- Use `$t(key)` syntax
- Resolved at runtime
- Can nest multiple levels
- Use sparingly for clarity

---

## Format Options

| Format | Output (en-US) | Output (de-DE) |
|--------|----------------|----------------|
| Number | 1,234.56 | 1.234,56 |
| Currency | $1,234.56 | 1.234,56 € |
| Percent | 12.3% | 12,3 % |
| Date short | 1/31/26 | 31.01.26 |
| Date long | January 31, 2026 | 31. Januar 2026 |

---

→ See `templates/date-number-formatter.md` for formatting examples
