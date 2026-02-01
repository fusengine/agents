---
name: pluralization
description: Laravel pluralization and trans_choice patterns
when-to-use: Implementing count-based translations, plural forms
keywords: pluralization, trans_choice, count, plural
priority: medium
related: localization.md
---

# Pluralization

## Syntax

Laravel uses the `|` character to separate singular and plural forms.

### Basic Pluralization

```php
// lang/en/messages.php
'apples' => '{0} No apples|{1} One apple|[2,*] :count apples',
```

### Range Syntax

| Syntax | Meaning |
|--------|---------|
| `{0}` | Exactly 0 |
| `{1}` | Exactly 1 |
| `[2,5]` | Between 2 and 5 |
| `[2,*]` | 2 or more |
| `[*,10]` | 10 or less |

## Usage

```php
trans_choice('messages.apples', 0);  // "No apples"
trans_choice('messages.apples', 1);  // "One apple"
trans_choice('messages.apples', 5);  // "5 apples"
```

## With Replacements

```php
// lang/en/messages.php
'items' => '{1} :name has one item|[2,*] :name has :count items',

// Usage
trans_choice('messages.items', 3, ['name' => 'John']);
// "John has 3 items"
```

## Best Practices

1. **Always handle zero** - Users expect "No items" not "0 items"
2. **Use `:count`** - Automatic replacement with the count value
3. **Test edge cases** - 0, 1, 2, and large numbers
