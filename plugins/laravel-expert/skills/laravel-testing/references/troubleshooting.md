---
name: troubleshooting
description: Common testing errors and solutions
file-type: markdown
---

# Testing Troubleshooting

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Table not found | Missing migration | Use `RefreshDatabase` |
| Test pollution | Shared state | Isolate tests |
| Slow tests | Real DB | Use `:memory:` SQLite |
| Mock not working | Not injected | Use `$this->mock()` |
| Time issues | Unfrozen time | Use `travelBack()` |
| Unauthenticated | No user context | Use `actingAs()` |
| JSON mismatch | Extra fields | Use `etc()` or partial |

---

## Quick Fixes

```php
// Table doesn't exist → Add RefreshDatabase
uses(RefreshDatabase::class);

// Mock ignored → Use $this->mock()
$this->mock(Service::class, fn ($m) => $m->shouldReceive('send')->once());

// Auth error → Use actingAs
$this->actingAs(User::factory()->create())->get('/dashboard');

// JSON partial match → Use etc()
$this->getJson('/api/user')->assertJson(fn ($j) => $j->where('name', 'John')->etc());

// Time issues → Freeze time
$this->freezeTime();
expect($user->created_at->toDateTimeString())->toBe(now()->toDateTimeString());
```

---

## Test Isolation

```php
// BAD: Tests depend on each other
test('creates user', function () { User::create(['email' => 'test@example.com']); });
test('finds user', function () { User::where('email', 'test@example.com')->first(); }); // Fails alone!

// GOOD: Independent tests
test('finds user', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    expect(User::where('email', $user->email)->first()->id)->toBe($user->id);
});
```

---

## Debugging

```php
$this->get('/')->dump();                    // Dump response
$this->get('/')->dd();                      // Dump and die
$this->get('/')->dumpSession();             // Dump session
$this->get('/')->dumpHeaders();             // Dump headers
$this->withoutExceptionHandling()->get('/'); // Show exceptions
```

---

## Performance

```bash
./vendor/bin/pest --profile              # Profile slow tests
./vendor/bin/pest --parallel             # Run parallel
DB_CONNECTION=sqlite DB_DATABASE=:memory: pest  # In-memory DB
```

---

## Decision Tree

```
Test failing?
├── Table missing → RefreshDatabase
├── Mock ignored → $this->mock()
├── Auth error → actingAs()
├── JSON mismatch → etc() / partial
├── Time issues → freezeTime()
├── Slow → :memory: + --parallel
└── Debug → dd() / withoutExceptionHandling
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Use RefreshDatabase | Create test dependencies |
| Freeze time for timestamps | Use real external services |
| Debug with withoutExceptionHandling | Ignore slow test warnings |
| Run tests in parallel | Skip isolation |
