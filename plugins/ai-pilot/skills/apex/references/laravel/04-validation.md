---
name: 04-validation
description: Verify code quality with Larastan, Pint, Pest
prev_step: references/laravel/03.5-elicit.md
next_step: references/laravel/05-review.md
---

# 04 - Validation (Laravel)

**Verify code quality with Larastan, Pint, Pest (APEX Phase X).**

## When to Use

- After execution phase complete
- Before any code review
- After ANY code modification

---

## Quality Tools Stack

### Required Tools

```bash
# Install quality tools
composer require --dev larastan/larastan
composer require --dev laravel/pint
composer require --dev pestphp/pest pestphp/pest-plugin-laravel
```

---

## Larastan (Static Analysis)

### Configuration (phpstan.neon)

```neon
includes:
    - vendor/larastan/larastan/extension.neon

parameters:
    paths:
        - app/
    level: 8
    treatPhpDocTypesAsCertain: true
    reportMaybes: true
```

### Run Analysis

```bash
./vendor/bin/phpstan analyse

# With memory limit
./vendor/bin/phpstan analyse --memory-limit=2G

# Specific path
./vendor/bin/phpstan analyse app/Services/
```

### Levels Guide

| Level | Checks |
| --- | --- |
| 0-4 | Basic type checks |
| 5-6 | Generic types, return types |
| 7 | Union types, partial checks |
| 8 | Strict null checks |
| 9 | Maximum strictness |

### Common Fixes

```php
// Error: Cannot call method on null
// Fix: Add null check
if ($user !== null) {
    $user->notify();
}

// Error: Return type mismatch
// Fix: Add proper return type
public function find(int $id): ?User
{
    return User::find($id);
}
```

---

## Pint (Code Style)

### Check Without Fixing

```bash
./vendor/bin/pint --test
```

### Fix Code Style

```bash
./vendor/bin/pint

# Specific directory
./vendor/bin/pint app/Services/

# Parallel mode (faster)
./vendor/bin/pint --parallel
```

### Configuration (pint.json)

```json
{
    "preset": "laravel",
    "rules": {
        "declare_strict_types": true,
        "final_class": true,
        "void_return": true
    }
}
```

---

## Pest (Testing)

### Run All Tests

```bash
php artisan test

# Or directly with Pest
./vendor/bin/pest
```

### Run Specific Tests

```bash
# By file
./vendor/bin/pest tests/Feature/PostControllerTest.php

# By name
./vendor/bin/pest --filter="create post"

# By group
./vendor/bin/pest --group=api
```

### Architecture Tests

```php
arch('app')
    ->expect('App\Services')
    ->toHaveSuffix('Service')
    ->toBeClasses();

arch('controllers')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller')
    ->toExtend('App\Http\Controllers\Controller');
```

---

## Combined Validation Script

### composer.json scripts

```json
{
    "scripts": {
        "lint": "./vendor/bin/pint --test",
        "analyse": "./vendor/bin/phpstan analyse",
        "test": "./vendor/bin/pest",
        "quality": [
            "@lint",
            "@analyse",
            "@test"
        ]
    }
}
```

### Run All Checks

```bash
composer quality
```

---

## File Structure Validation

### Check File Lines

```bash
# Find files > 100 lines
find app -name "*.php" -exec wc -l {} + | awk '$1 > 100'
```

### Verify Structure

```text
[ ] All files < 100 lines
[ ] Interfaces in Contracts/
[ ] Services in Services/
[ ] DTOs in DTOs/
[ ] No business logic in Controllers
```

---

## Common Issues & Fixes

### Type Errors

```php
// Error: Argument of type string|null
// Fix: Add null coalescing
$name = $request->input('name') ?? '';
```

### Missing Return Types

```php
// Before
public function find($id)

// After
public function find(int $id): ?User
```

### Unused Imports

```php
// Pint will auto-remove
// Or configure in pint.json
```

---

## Validation Report Template

```markdown
## Validation Results

### Larastan (Level 8)
- Status: PASS
- Errors: 0

### Pint
- Status: PASS
- Files checked: 45
- Files fixed: 0

### Pest
- Status: PASS
- Tests: 78
- Assertions: 234
- Time: 2.3s

### File Checks
- Files > 100 lines: 0
- Missing strict_types: 0
```

---

## Validation Checklist

```text
[ ] Larastan level 8+ passed
[ ] Pint --test passed
[ ] All Pest tests passed
[ ] All files < 100 lines
[ ] No type errors
[ ] No code style issues
```

---

## Next Phase

Proceed to `05-review.md` (self-review)
Or `07-add-test.md` (if tests needed first)
