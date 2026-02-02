---
name: serialization
description: Model serialization - toArray, toJson, hiding, appending
when-to-use: API responses, JSON export, data transformation
keywords: toArray, toJson, hidden, visible, appends, makeHidden, makeVisible
---

# Serialization

## Decision Tree

```
Serializing model?
├── To array → toArray()
├── To JSON → toJson()
├── Hide sensitive → $hidden or makeHidden()
├── Add computed → $appends
└── Temporary change → makeHidden(), makeVisible()
```

## Basic Serialization

| Method | Returns |
|--------|---------|
| `$model->toArray()` | Array |
| `$model->toJson()` | JSON string |
| `$model->toJson(JSON_PRETTY_PRINT)` | Formatted JSON |
| `(string) $model` | JSON string |

## Hiding Attributes

| Property/Method | Scope |
|-----------------|-------|
| `protected $hidden = ['password']` | Always hidden |
| `$model->makeHidden('email')` | This instance |
| `$model->makeHidden(['email', 'phone'])` | Multiple |

## Showing Attributes

| Property/Method | Scope |
|-----------------|-------|
| `protected $visible = ['id', 'name']` | Whitelist (only these) |
| `$model->makeVisible('email')` | This instance |
| `$model->setVisible(['id', 'name'])` | Replace visible |

## Appending Attributes

| Property/Method | Purpose |
|-----------------|---------|
| `protected $appends = ['full_name']` | Always include |
| `$model->append('full_name')` | This instance |
| `$model->setAppends(['full_name'])` | Replace appends |

## Collection Serialization

| Method | Returns |
|--------|---------|
| `$users->toArray()` | Array of arrays |
| `$users->toJson()` | JSON array |
| `$users->makeHidden('email')` | Apply to all |
| `$users->makeVisible('email')` | Apply to all |

## Relationship Serialization

| Behavior | When |
|----------|------|
| Included | Relationship loaded |
| Excluded | Not loaded |
| Hidden | In `$hidden` array |

## Date Serialization

| Method | Purpose |
|--------|---------|
| `serializeDate(DateTimeInterface $date)` | Custom format |
| `protected $dateFormat = 'Y-m-d'` | All dates |

## Custom Serialization

| Method | Override |
|--------|----------|
| `toArray()` | Full control |
| `jsonSerialize()` | JsonSerializable |

## Conditional Serialization

| Pattern | Use |
|---------|-----|
| `when()` in Resource | API Resources |
| Dynamic `$hidden` | Model boot |
| `makeHidden()` chain | Before response |

## JSON Options

| Flag | Effect |
|------|--------|
| `JSON_PRETTY_PRINT` | Formatted |
| `JSON_UNESCAPED_UNICODE` | UTF-8 chars |
| `JSON_NUMERIC_CHECK` | Numbers as numbers |

## Common Patterns

| Pattern | Implementation |
|---------|---------------|
| Hide password | `$hidden = ['password', 'remember_token']` |
| Add full name | `$appends = ['full_name']` + accessor |
| API response | `return $user->makeHidden('email')` |
| Debug | `$model->toJson(JSON_PRETTY_PRINT)` |

## API Resources Alternative

| Feature | Serialization | API Resource |
|---------|---------------|--------------|
| Control | Property-based | Method-based |
| Conditional | Limited | Full |
| Transformation | Basic | Full |
| Pagination | Manual | Built-in |

## Best Practices

| DO | DON'T |
|----|-------|
| Hide sensitive by default | Expose passwords/tokens |
| Use API Resources for APIs | Complex toArray() overrides |
| Keep appends minimal | Expensive computed attributes |
| Test serialization output | Assume structure |

→ **For APIs**: See [laravel-api](../laravel-api) skill for Resources
