# 08 - Check Test (Laravel)

**Run and verify all tests pass.**

## When to Use

- After writing new tests
- Before creating PR
- As part of CI/CD pipeline

---

## Test Commands

### Basic Test Run

```bash
# Using Artisan
php artisan test

# Using Pest directly
./vendor/bin/pest

# Verbose output
./vendor/bin/pest -v
```

### Targeted Testing

```bash
# Specific file
./vendor/bin/pest tests/Feature/PostControllerTest.php

# Filter by name
./vendor/bin/pest --filter="creates a post"

# Filter by group
./vendor/bin/pest --group=api

# Specific directory
./vendor/bin/pest tests/Feature/
```

---

## Coverage Reports

### Generate Coverage

```bash
# Basic coverage report
./vendor/bin/pest --coverage

# With minimum threshold
./vendor/bin/pest --coverage --min=80

# HTML report
./vendor/bin/pest --coverage-html=coverage/
```

### Coverage Targets

| Metric | Target |
| --- | --- |
| Statements | > 80% |
| Branches | > 75% |
| Functions | > 80% |
| Lines | > 80% |

---

## Parallel Testing

### Run Tests in Parallel

```bash
# Pest parallel
./vendor/bin/pest --parallel

# Artisan parallel
php artisan test --parallel

# With processes count
./vendor/bin/pest --parallel --processes=4
```

### Parallel Requirements

```text
- Database must support parallel connections
- Tests must be isolated (no shared state)
- Use RefreshDatabase trait
```

---

## Debugging Failed Tests

### Verbose Output

```bash
./vendor/bin/pest -v --fail-fast
```

### Re-run Failed Tests

```bash
./vendor/bin/pest --retry
```

### Debug Specific Test

```php
it('creates a post', function () {
    // Add debugging
    ray($response->json()); // If using Ray
    dd($response->json());  // Dump and die

    // Continue assertions...
});
```

---

## Database Testing

### Refresh Database

```php
uses(RefreshDatabase::class);

it('creates user in database', function () {
    $user = User::factory()->create();

    $this->assertDatabaseHas('users', ['id' => $user->id]);
});
```

### Database Transactions

```php
uses(DatabaseTransactions::class);

// Each test runs in transaction
// Automatically rolled back
```

### Seeders in Tests

```php
it('uses seeded data', function () {
    $this->seed(UserSeeder::class);

    expect(User::count())->toBe(10);
});
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.5'
          coverage: xdebug

      - name: Install Dependencies
        run: composer install --no-progress --prefer-dist

      - name: Run Tests
        run: ./vendor/bin/pest --coverage --min=80
```

### Composer Script

```json
{
    "scripts": {
        "test": "./vendor/bin/pest",
        "test:coverage": "./vendor/bin/pest --coverage --min=80",
        "test:parallel": "./vendor/bin/pest --parallel"
    }
}
```

---

## Test Output Interpretation

### Passing Tests

```text
PASS  Tests\Feature\PostControllerTest
   it lists all posts                    0.05s
   it creates a post when authenticated  0.08s
   it returns 401 for unauthenticated    0.02s

Tests:    3 passed
Duration: 0.15s
```

### Failing Tests

```text
FAIL  Tests\Feature\PostControllerTest
   it creates a post when authenticated

Expected status code 201 but received 422.
Failed asserting that 422 is identical to 201.

at tests/Feature/PostControllerTest.php:25
```

### Coverage Report

```text
Code Coverage Report:
  Classes: 85.00% (17/20)
  Methods: 82.35% (14/17)
  Lines:   87.50% (35/40)

App\Services\PostService .............. 100.00%
App\Http\Controllers\PostController ... 75.00%
```

---

## Common Issues

### Slow Tests

```bash
# Find slow tests
./vendor/bin/pest --profile

# Solutions:
# - Mock external services
# - Use factories efficiently
# - Run in parallel
```

### Flaky Tests

```text
Causes:
- Shared state between tests
- Time-dependent logic
- External service dependencies

Solutions:
- Use RefreshDatabase
- Freeze time with Carbon
- Mock external services
```

### Memory Issues

```bash
# Increase memory
php -d memory_limit=512M vendor/bin/pest
```

---

## Pre-PR Checklist

```text
[ ] All tests pass locally
[ ] Coverage meets threshold (>80%)
[ ] No flaky tests
[ ] Tests run in reasonable time
[ ] New code has tests
[ ] Edge cases covered
```

---

## Test Report Template

```markdown
## Test Results

### Summary
- Total Tests: 78
- Passed: 78
- Failed: 0
- Duration: 4.2s

### Coverage
- Lines: 85%
- Functions: 82%
- Classes: 88%

### New Tests Added
- PostControllerTest: 5 tests
- PostServiceTest: 3 tests

### Performance
- Slowest test: 0.8s (acceptable)
- No timeouts
```

---

## Next Phase

Proceed to `09-create-pr.md`
