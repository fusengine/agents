---
name: session
description: Laravel HTTP Session - session management and storage
when-to-use: Consult when working with session data, flash messages, drivers
keywords: laravel, session, flash, cookie, redis, database, storage
priority: medium
related: authentication.md
---

# HTTP Session

## What is Session?

Sessions store user data across HTTP requests. Since HTTP is stateless, sessions provide continuity - remembering who's logged in, shopping cart contents, etc.

Laravel abstracts session management with multiple storage backends.

---

## Session Drivers

| Driver | Storage | Best For |
|--------|---------|----------|
| `database` | SQL table | Default, reliable |
| `redis` | Redis server | High performance |
| `file` | Local files | Simple apps |
| `cookie` | Browser | Stateless apps |
| `array` | Memory | Testing only |

Configure in `config/session.php` or `.env`:
```env
SESSION_DRIVER=database
```

---

## Reading Session Data

```php
// Get value (returns null if missing)
$value = $request->session()->get('key');

// Get with default
$value = $request->session()->get('key', 'default');

// Via helper
$value = session('key', 'default');

// Check existence
if ($request->session()->has('key')) { }    // Exists and not null
if ($request->session()->exists('key')) { } // Exists (even if null)
```

---

## Writing Session Data

```php
// Store value
$request->session()->put('key', 'value');
session(['key' => 'value']);

// Push to array
$request->session()->push('cart.items', $product);

// Increment/decrement
$request->session()->increment('views');
$request->session()->decrement('credits', 5);
```

---

## Flash Data

Data that exists only for the next request - perfect for status messages:

```php
// Flash for next request
$request->session()->flash('status', 'Profile updated!');

// Keep flash for another request
$request->session()->reflash();
$request->session()->keep(['status']);

// Flash for current request only
$request->session()->now('status', 'Saving...');
```

---

## Deleting Data

```php
// Remove single key
$request->session()->forget('key');

// Remove multiple
$request->session()->forget(['key1', 'key2']);

// Get and remove
$value = $request->session()->pull('key');

// Clear everything
$request->session()->flush();
```

---

## Session Security

### Regenerate ID
Prevents session fixation attacks:
```php
$request->session()->regenerate();  // After login
```

### Invalidate
Clear data and regenerate:
```php
$request->session()->invalidate();  // After logout
```

---

## Session Blocking

Prevent concurrent request issues:

```php
Route::post('/process', ...)->block($lockSeconds = 10, $waitSeconds = 10);
```

First request locks session; others wait.

---

## Configuration Tips

| Setting | Recommendation |
|---------|---------------|
| `lifetime` | 120 min (default) |
| `expire_on_close` | true for sensitive apps |
| `encrypt` | true (default) |
| `same_site` | 'lax' or 'strict' |
