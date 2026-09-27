---
name: factory-seeder-attributes
description: Factory and Seeder attributes shipped in Laravel 13
---

# Factory / Seeder Attributes (Laravel 13)

Namespace: `Illuminate\Database\Eloquent\Factories\Attributes\*` (factories) and `Illuminate\Foundation\Testing\Attributes\*` (`Seed`, `Seeder` — test classes)

## Factory model binding

```php
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;

#[UseModel(User::class)]
class UserFactory extends Factory
{
    public function definition(): array
    {
        return ['name' => fake()->name(), 'email' => fake()->unique()->safeEmail()];
    }
}
```

Replaces `protected $model = User::class;`. Useful when the factory's class name does not follow the `{Model}Factory` convention.

## Seeding in tests

`#[Seed]` and `#[Seeder]` go on **test classes** that use `RefreshDatabase` — they replace `protected $seed = true;` / `protected $seeder = ...;`. They do not mark seeder classes for discovery.

```php
use Illuminate\Foundation\Testing\Attributes\Seed;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

#[Seed] // run DatabaseSeeder before each test
class OrderTest extends TestCase
{
    use RefreshDatabase;
}
```

```php
use Database\Seeders\OrderStatusSeeder;
use Illuminate\Foundation\Testing\Attributes\Seeder;

#[Seeder(OrderStatusSeeder::class)] // run a specific seeder
class OrderStatusTest extends TestCase
{
    use RefreshDatabase;
}
```

## Notes

- Seeder classes themselves have no attribute: register them in `DatabaseSeeder::run()` via `$this->call([...])`
- Related testing attribute: `#[UnitTest]` on a test method skips booting the application
