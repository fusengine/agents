---
name: database-factories
description: Model factories, states, sequences, relationships
file-type: markdown
---

# Model Factories

## Basic Usage

```php
$user = User::factory()->create();                              // Create & persist
$users = User::factory()->count(5)->create();                   // Create multiple
$user = User::factory()->make();                                // No persist
$user = User::factory()->create(['name' => 'John']);           // Override
$attrs = User::factory()->raw();                                // Get array
```

---

## Factory States

```php
// In UserFactory
public function admin(): static {
    return $this->state(fn () => ['role' => 'admin', 'is_admin' => true]);
}

public function unverified(): static {
    return $this->state(fn () => ['email_verified_at' => null]);
}

// Usage
$admin = User::factory()->admin()->create();
$unverified = User::factory()->unverified()->create();
$both = User::factory()->admin()->unverified()->create();
```

---

## Relationships

```php
// Has many
$user = User::factory()->has(Post::factory()->count(3))->create();
$user = User::factory()->hasPosts(3)->create();                 // Shorthand

// Belongs to
$post = Post::factory()->for(User::factory()->admin())->create();
$post = Post::factory()->forUser(['name' => 'John'])->create(); // Shorthand

// With states
$user = User::factory()->has(Post::factory()->published()->count(2))->create();
```

---

## Sequences

```php
// Cycle through values
$users = User::factory()->count(4)->sequence(
    ['status' => 'active'],
    ['status' => 'inactive'],
)->create(); // active, inactive, active, inactive

// Sequential with index
$users = User::factory()->count(3)->sequence(
    fn ($seq) => ['email' => "user{$seq->index}@example.com"]
)->create();
```

---

## Callbacks & Performance

```php
// In factory configure()
return $this->afterCreating(fn (User $u) => $u->profile()->create(['bio' => 'Default']));
return $this->afterMaking(fn (User $u) => $u->remember_token = Str::random(10));

// Recycle for performance (reuse same parent)
$user = User::factory()->create();
$posts = Post::factory()->count(10)->recycle($user)->create();
```

---

## Common States

| State | Purpose |
|-------|---------|
| `admin()` | Admin role |
| `unverified()` | No email verify |
| `suspended()` | Inactive user |
| `published()` | Published content |
| `draft()` | Unpublished content |

---

## Decision Tree

```
Factory usage?
├── Single record → create()
├── Multiple → count(n)->create()
├── No persist → make()
├── Custom attrs → state()
├── Has many → has() / hasPosts()
├── Belongs to → for() / forUser()
├── Performance → recycle()
└── Form data → raw()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Define meaningful states | Create unneeded records |
| Use relationships in factories | Use raw SQL in tests |
| Recycle for performance | Depend on auto-increment IDs |
