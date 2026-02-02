---
name: factories
description: Model factories for testing and seeding
when-to-use: Creating test data, database seeding
keywords: factory, state, sequence, create, make, has, for, recycle
---

# Model Factories

## Decision Tree

```
Creating test data?
├── Don't persist → make()
├── Persist to DB → create()
├── Multiple → count(n)
├── With relation → has(), for()
├── Variant → state()
└── Sequence → sequence()
```

## Factory Methods

| Method | Persists | Returns |
|--------|----------|---------|
| `make()` | No | Model(s) |
| `create()` | Yes | Model(s) |
| `make(['name' => 'Test'])` | No | With override |
| `create(['name' => 'Test'])` | Yes | With override |

## Multiple Records

| Method | Returns |
|--------|---------|
| `User::factory()->count(3)->make()` | Collection of 3 |
| `User::factory(3)->create()` | Shorthand |

## States

| Definition | Usage |
|------------|-------|
| `->state([...])` | Inline attributes |
| `->suspended()` | Named state method |
| `->unverified()` | Common built-in |

## Sequences

| Pattern | Cycles Through |
|---------|---------------|
| `sequence(['admin'], ['user'])` | Alternating values |
| `sequence(fn($seq) => [...])` | With index |

## Relationships

| Method | Creates |
|--------|---------|
| `has(Post::factory()->count(3))` | HasMany |
| `has(Post::factory(), 'blogPosts')` | Named relation |
| `for(User::factory())` | BelongsTo |
| `for($user)` | Existing model |
| `hasAttached(Role::factory())` | Many-to-Many |

## Relationship Shortcuts

| Magic Method | Equivalent |
|--------------|------------|
| `->hasPosts(3)` | `->has(Post::factory()->count(3))` |
| `->forUser()` | `->for(User::factory())` |

## Pivot Data

| Method | For |
|--------|-----|
| `hasAttached($role, ['active' => true])` | Pivot attributes |
| `hasAttached($roles, ['admin' => true])` | Multiple with same |

## Recycling Models

| Method | Purpose |
|--------|---------|
| `recycle($user)` | Reuse for BelongsTo |
| `recycle([$user, $team])` | Multiple models |

## Factory Callbacks

| Hook | When |
|------|------|
| `afterMaking(fn)` | After make() |
| `afterCreating(fn)` | After create() |

## Inline Closures

| In Definition | Purpose |
|---------------|---------|
| `'email' => fn() => fake()->email()` | Dynamic value |
| `'slug' => fn($attrs) => Str::slug($attrs['name'])` | Based on other |

## Faker Methods

| Method | Example |
|--------|---------|
| `fake()->name()` | John Doe |
| `fake()->email()` | john@example.com |
| `fake()->sentence()` | Lorem ipsum... |
| `fake()->numberBetween(1, 100)` | 42 |
| `fake()->dateTimeBetween('-1 year')` | Past date |
| `fake()->unique()->email()` | Unique email |

## Factory Definition

| Property | Purpose |
|----------|---------|
| `protected $model = User::class` | Target model |
| `definition()` | Default attributes |
| State methods | Named variants |

## Best Practices

| DO | DON'T |
|----|-------|
| Use states for variants | Duplicate factories |
| Use `recycle()` for consistency | Create orphan relations |
| Use `sequence()` for variety | Random booleans in loops |
| Test with factories | Hardcode test data |

→ **Complete examples**: See [Factory.php.md](templates/Factory.php.md)
