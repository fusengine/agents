---
name: pluralization
description: Count-based translation rules - plural forms, zero handling, ICU MessageFormat
when-to-use: counting items, quantity display, language-specific plural rules
keywords: plural, count, pluralization, ICU, cardinal, ordinal
priority: medium
related: interpolation.md, templates/plural-interpolation.md
---

# Pluralization

## Basic Plural Forms

**Automatic plural form selection based on count.**

### Purpose
- Display correct grammatical form
- Handle "1 item" vs "5 items"
- Language-specific plural rules

### When to Use
- Displaying item counts
- Notification badges
- Cart quantities
- Any numeric display

### Key Points
- Pass `count` option to `t()`
- i18next selects correct suffix
- Language rules auto-applied
- Supports all CLDR plural categories

---

## Plural Suffixes

**Key naming convention for plural forms.**

### Purpose
- Define translations for each form
- Support complex plural rules
- Handle zero as special case

### When to Use
- Creating translation files
- Supporting multiple languages
- Custom zero messages

### Key Points
- English: `_one`, `_other`
- Use `_zero` for empty state
- Some languages: `_few`, `_many`
- i18next matches automatically

---

## Language Plural Rules

| Language | Forms | Suffixes |
|----------|-------|----------|
| English | 2 | `_one`, `_other` |
| French | 2 | `_one` (0,1), `_other` |
| Russian | 3 | `_one`, `_few`, `_many` |
| Arabic | 6 | `_zero`, `_one`, `_two`, `_few`, `_many`, `_other` |
| Japanese | 1 | `_other` only |

---

## ICU MessageFormat

**Complex pluralization with inline rules.**

### Purpose
- Single key for all forms
- Inline conditional logic
- Gender and select support

### When to Use
- Complex plural scenarios
- Gender-based translations
- Reducing translation key count

### Key Points
- Requires `i18next-icu` plugin
- Uses `{count, plural, ...}` syntax
- Supports `select` for gender
- More complex but powerful

---

## Context + Plural

**Combine context and plural for variations.**

### Purpose
- Gender + count combinations
- Category + count variations
- Complex message variations

### When to Use
- "1 male friend" vs "3 female friends"
- Category-specific plurals
- Highly contextual messages

### Key Points
- Suffix format: `key_context_plural`
- Both options passed to `t()`
- Falls back gracefully
- Use sparingly for maintainability

---

→ See `templates/plural-interpolation.md` for complete examples
