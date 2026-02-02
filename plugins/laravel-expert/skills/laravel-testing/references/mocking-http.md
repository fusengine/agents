---
name: mocking-http
description: HTTP client mocking and time travel
file-type: markdown
---

# HTTP & Time Mocking

## Http::fake()

```php
use Illuminate\Support\Facades\Http;

Http::fake([
    'api.example.com/*' => Http::response(['data' => 'mocked'], 200),
    'github.com/*' => Http::response(['name' => 'repo'], 200),
    '*' => Http::response(['error' => 'Not found'], 404), // Fallback
]);

$response = Http::get('https://api.example.com/users');
expect($response->json('data'))->toBe('mocked');
```

---

## Response Types

```php
Http::fake([
    '*' => Http::response(['success' => true], 200),           // Success
    '*' => Http::response(['error' => 'Not found'], 404),       // Error
    '*' => Http::response('', 204),                             // Empty
    '*' => Http::sequence()->push(['try' => 1], 500)->push(['try' => 2], 200), // Sequence
]);
```

---

## Prevent Stray Requests

```php
Http::fake(['known-api.com/*' => Http::response(['ok' => true])]);
Http::preventStrayRequests(); // Fails if any other URL is called

Http::get('https://known-api.com/test');  // OK
Http::get('https://unknown.com/test');    // Exception!
```

---

## Assert HTTP Calls

```php
Http::fake();
Http::post('https://api.example.com/users', ['name' => 'John']);

Http::assertSent(fn ($r) => $r->url() === 'https://api.example.com/users' && $r['name'] === 'John');
Http::assertSentCount(1);
Http::assertNotSent(fn ($r) => $r->url() === 'https://other.com');
```

---

## Time Travel

```php
// Travel forward/backward
$this->travel(7)->days();
$this->travel(-5)->days();
$this->travelTo(now()->subDays(10));
$this->travelTo(Carbon::parse('2024-01-01'));

// Freeze time
$this->freezeTime();
$user = User::factory()->create();
expect($user->created_at->toDateTimeString())->toBe(now()->toDateTimeString());

// Reset
$this->travelBack();
```

---

## Time Units

| Method | Example |
|--------|---------|
| `milliseconds()` | `$this->travel(5)->milliseconds()` |
| `seconds()` | `$this->travel(5)->seconds()` |
| `minutes()` | `$this->travel(5)->minutes()` |
| `hours()` | `$this->travel(5)->hours()` |
| `days()` | `$this->travel(5)->days()` |
| `weeks()` | `$this->travel(2)->weeks()` |
| `months()` | `$this->travel(3)->months()` |
| `years()` | `$this->travel(1)->years()` |

---

## Decision Tree

```
External mocking?
├── HTTP API → Http::fake()
├── Prevent leaks → Http::preventStrayRequests()
├── Verify calls → Http::assertSent()
├── Time-based → travel() / travelTo()
├── Freeze time → freezeTime()
└── Cache → Cache::shouldReceive()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Always fake external HTTP | Call real external APIs |
| Use preventStrayRequests() in CI | Forget to reset time |
| Reset time with travelBack() | Leave time frozen |
