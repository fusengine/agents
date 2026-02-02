---
name: database-basics
description: Database testing traits and seeders
file-type: markdown
---

# Database Testing Basics

## Traits

| Trait | Behavior |
|-------|----------|
| `RefreshDatabase` | Migrate + transaction per test |
| `DatabaseMigrations` | Migrate before each test |
| `DatabaseTransactions` | Wrap in transaction (no migrate) |
| `LazilyRefreshDatabase` | Migrate only if DB accessed |

---

## RefreshDatabase (Recommended)

```php
// tests/Pest.php
uses(RefreshDatabase::class)->in('Feature');

// Or in test file
uses(RefreshDatabase::class);

it('creates user', function () {
    User::factory()->create(['name' => 'John']);
    $this->assertDatabaseHas('users', ['name' => 'John']);
});
```

---

## Seeders

```php
$this->seed();                               // Default DatabaseSeeder
$this->seed(UserSeeder::class);              // Specific
$this->seed([UserSeeder::class, RoleSeeder::class]); // Multiple

// Class property
protected bool $seed = true;
protected string $seeder = CustomSeeder::class;
```

---

## Test Database Config

```xml
<!-- phpunit.xml -->
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

```php
// config/database.php
'testing' => ['driver' => 'sqlite', 'database' => ':memory:'],
```

---

## Multiple Connections

```php
$this->assertDatabaseHas('users', ['email' => 'test@example.com'], 'mysql');
```

---

## When to Use Each

| Trait | Use Case |
|-------|----------|
| `RefreshDatabase` | Most tests (recommended) |
| `DatabaseMigrations` | When transactions fail |
| `DatabaseTransactions` | Fast tests, stable schema |
| `LazilyRefreshDatabase` | Mixed DB/non-DB tests |

---

## Decision Tree

```
Database isolation?
├── Standard → RefreshDatabase
├── Need fresh migrate → DatabaseMigrations
├── Fast, no migrate → DatabaseTransactions
├── Conditional → LazilyRefreshDatabase
└── Seeders → $this->seed()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Use RefreshDatabase by default | Use production database |
| Use in-memory SQLite for speed | Create test dependencies |
| Keep seeders simple | Skip database isolation |
