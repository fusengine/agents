---
name: casts
description: Attribute casting - built-in and custom casts
when-to-use: Type conversion, value objects, encryption
keywords: casts, array, json, datetime, enum, encrypted, custom
---

# Attribute Casting

## Decision Tree

```
What type to cast?
├── Primitive → boolean, integer, float, string
├── Date/Time → datetime, date, timestamp
├── JSON/Array → array, json, object, collection
├── Enum → BackedEnum::class
├── Encrypted → encrypted, encrypted:array
├── Custom → Implement CastsAttributes
└── Value Object → Custom cast class
```

## Built-in Casts

| Cast | PHP Type |
|------|----------|
| `array` | array |
| `boolean` / `bool` | bool |
| `collection` | Collection |
| `date` | Carbon (date only) |
| `datetime` | Carbon |
| `decimal:2` | string (precision) |
| `double` / `float` / `real` | float |
| `encrypted` | string (decrypted) |
| `encrypted:array` | array (decrypted) |
| `hashed` | Hashed string |
| `integer` / `int` | int |
| `object` | stdClass |
| `string` | string |
| `timestamp` | int |

## Laravel 12 Cast Classes

| Class | Purpose |
|-------|---------|
| `AsArrayObject` | ArrayObject with changes |
| `AsCollection` | Laravel Collection |
| `AsEncryptedCollection` | Encrypted Collection |
| `AsEncryptedArrayObject` | Encrypted ArrayObject |
| `AsEnumCollection` | Collection of Enums |
| `AsStringable` | Stringable instance |

## Enum Casting

| Syntax | Type |
|--------|------|
| `Status::class` | BackedEnum |
| `AsEnumCollection::of(Status::class)` | Enum array |

## Date Casting

| Format | Usage |
|--------|-------|
| `datetime` | Full timestamp |
| `datetime:Y-m-d` | Custom format |
| `date` | Date only |
| `immutable_date` | CarbonImmutable |
| `immutable_datetime` | CarbonImmutable |

## JSON/Array Casting

| Cast | Behavior |
|------|----------|
| `array` | Native PHP array |
| `json` | Same as array |
| `object` | stdClass |
| `collection` | Collection instance |
| `AsArrayObject::class` | Tracks changes |
| `AsCollection::class` | Collection with tracking |

## Encrypted Casts

| Cast | Use For |
|------|---------|
| `encrypted` | Sensitive strings |
| `encrypted:array` | Sensitive arrays |
| `encrypted:collection` | Sensitive collections |
| `encrypted:object` | Sensitive objects |

## Custom Casts

| Interface | Purpose |
|-----------|---------|
| `CastsAttributes` | Two-way (get/set) |
| `CastsInboundAttributes` | Set only (hashing) |
| `SerializesCastableAttributes` | Custom serialization |

## Custom Cast Methods

| Method | Purpose |
|--------|---------|
| `get($model, $key, $value, $attributes)` | Database → PHP |
| `set($model, $key, $value, $attributes)` | PHP → Database |
| `serialize($model, $key, $value, $attributes)` | PHP → JSON |

## Value Object Casts

| Feature | Implementation |
|---------|---------------|
| Multiple columns | Return array from `set()` |
| Null handling | Check in `get()` |
| Dependency injection | Constructor parameters |

## Cast Parameters

| Syntax | Access |
|--------|--------|
| `Hash::class.':sha256'` | `__construct($algorithm)` |
| `Decimal::class.':2'` | Precision parameter |

→ **Complete examples**: See [ModelCasts.php.md](templates/ModelCasts.php.md)
