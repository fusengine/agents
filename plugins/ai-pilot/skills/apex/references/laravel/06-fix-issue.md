---
name: 06-fix-issue
description: Systematic approach to fixing Laravel issues
prev_step: references/laravel/05-review.md
next_step: references/laravel/07-add-test.md
---

# 06 - Fix Issue (Laravel)

**Systematic approach to fixing Laravel issues.**

## When to Use

- When fixing reported bugs
- When addressing security issues
- When resolving failing tests

---

## Issue Analysis Workflow

### Step 1: Reproduce

```bash
# Clear all caches first
php artisan optimize:clear

# Check logs
tail -f storage/logs/laravel.log

# Reproduce in Tinker
php artisan tinker
```

### Step 2: Identify Root Cause

```text
1. Read error message carefully
2. Check stack trace
3. Find affected file/line
4. Understand context
```

### Step 3: Research

```text
1. Check Laravel docs
2. Search for similar issues
3. Review related code
4. Understand expected behavior
```

---

## Common Issue Types

### Database Issues

```php
// Error: SQLSTATE unique constraint
// Fix: Check for duplicates
$exists = User::where('email', $email)->exists();
if ($exists) {
    throw new DuplicateException('Email already exists');
}

// Error: Foreign key constraint
// Fix: Check relation exists
$user = User::findOrFail($userId);
```

### Validation Issues

```php
// Error: Validation fails unexpectedly
// Debug: Check rules
dd($request->rules());

// Fix: Update FormRequest
public function rules(): array
{
    return [
        'email' => ['required', 'email', Rule::unique('users')->ignore($this->user)],
    ];
}
```

### N+1 Query Issues

```php
// Detect with Laravel Debugbar or Telescope
// Fix: Add eager loading
// Before
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // N+1!
}

// After
$posts = Post::with('user')->get();
```

---

## Debugging Tools

### Laravel Telescope

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### Laravel Debugbar

```bash
composer require barryvdh/laravel-debugbar --dev
```

### Logging

```php
use Illuminate\Support\Facades\Log;

Log::debug('Processing user', ['id' => $user->id]);
Log::error('Failed to process', ['error' => $e->getMessage()]);
```

---

## Fix Implementation

### Step 1: Create Test First (TDD)

```php
it('should not allow duplicate emails', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);

    $this->postJson('/api/users', [
        'email' => 'test@example.com',
        'name' => 'Test',
    ])->assertUnprocessable()
      ->assertJsonValidationErrors(['email']);
});
```

### Step 2: Implement Fix

```php
// Apply minimal change to fix issue
// Keep fix focused and atomic
```

### Step 3: Verify Fix

```bash
# Run specific test
./vendor/bin/pest --filter="duplicate emails"

# Run related tests
./vendor/bin/pest tests/Feature/UserTest.php
```

---

## Security Fixes

### SQL Injection

```php
// Vulnerable
User::whereRaw("name = '$name'")->get();

// Fixed
User::where('name', $name)->get();
```

### XSS Prevention

```blade
{{-- Vulnerable --}}
{!! $userInput !!}

{{-- Fixed --}}
{{ $userInput }}
```

### Mass Assignment

```php
// Vulnerable
User::create($request->all());

// Fixed
User::create($request->validated());
```

---

## Fix Documentation

### Commit Message Format

```text
fix(auth): prevent duplicate email registration

- Add unique validation rule
- Return proper error message
- Add test coverage

Fixes #123
```

### Changelog Entry

```markdown
### Fixed
- Duplicate email registration now returns 422 (#123)
```

---

## Post-Fix Validation

### Run Quality Tools

```bash
./vendor/bin/pint
./vendor/bin/phpstan analyse
./vendor/bin/pest
```

### Regression Check

```bash
# Run full test suite
php artisan test

# Check related functionality
./vendor/bin/pest --group=users
```

---

## Fix Checklist

```text
[ ] Issue reproduced locally
[ ] Root cause identified
[ ] Test written for fix
[ ] Fix implemented (minimal change)
[ ] Fix verified with test
[ ] No regressions introduced
[ ] Quality tools pass
[ ] Commit message descriptive
```

---

## Common Laravel Fixes

| Issue | Solution |
| --- | --- |
| 500 on production | Check .env, run config:cache |
| CSRF token mismatch | Verify @csrf in forms |
| Route not found | Check route:list, clear route cache |
| Model not found | Use findOrFail, handle exception |
| Auth middleware fails | Check guards, verify token |

---

## Next Phase

Proceed to `04-validation.md` (validate fix)
Then `09-create-pr.md` (if approved)
