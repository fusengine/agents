---
name: factory-seeder-attributes
description: Factory and Seeder attributes shipped in Laravel 13
---

# Factory / Seeder Attributes (Laravel 13)

Namespace: `Illuminate\Database\Eloquent\Factories\Attributes\*` and `Illuminate\Database\Seeders\Attributes\*`

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

## Seeder discovery

```php
use Illuminate\Database\Seeders\Attributes\Seed;
use Illuminate\Database\Seeder;

#[Seed]
class ProductionSeeder extends Seeder
{
    public function run(): void { /* ... */ }
}
```

`#[Seed]` marks a seeder for auto-discovery by `db:seed` without needing to register in `DatabaseSeeder::run()`.

```php
use Illuminate\Database\Seeders\Attributes\Seeder as SeederAttribute;

#[SeederAttribute(environment: 'production')]
class CriticalDataSeeder extends Seeder {}
```

Optional `#[Seeder(environment: ...)]` restricts execution to a specific environment.

## Notes

- `#[Seed]` and `#[Seeder]` work together: `#[Seed]` enables discovery, `#[Seeder]` adds metadata
- Use the legacy `DatabaseSeeder` pattern when ordering matters across seeders
