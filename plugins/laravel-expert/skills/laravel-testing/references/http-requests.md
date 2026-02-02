---
name: http-requests
description: HTTP request methods and options
file-type: markdown
---

# HTTP Requests

## Request Methods

```php
$this->get('/users');
$this->post('/users', ['name' => 'John']);
$this->put('/users/1', ['name' => 'Jane']);
$this->patch('/users/1', ['name' => 'Jane']);
$this->delete('/users/1');

// JSON variants
$this->getJson('/api/users');
$this->postJson('/api/users', ['name' => 'John']);
$this->putJson('/api/users/1', ['name' => 'Jane']);
$this->deleteJson('/api/users/1');
```

---

## Headers & Cookies

```php
$this->withHeaders(['X-Custom' => 'value', 'Accept-Language' => 'en'])->get('/');
$this->withHeader('X-Token', 'secret')->get('/');

$this->withCookies(['session' => 'abc123'])->get('/dashboard');
$this->withCookie('token', 'value')->get('/');
```

---

## Session

```php
$this->withSession(['cart' => ['item1', 'item2'], 'user_id' => 1])->get('/checkout');
```

---

## Request Options

```php
$this->followingRedirects()->post('/login', $creds);          // Follow redirects
$this->withoutMiddleware()->get('/protected');                 // Skip all middleware
$this->withoutMiddleware(ThrottleRequests::class)->get('/');   // Skip specific
$this->withMiddleware(EnsureEmailVerified::class)->get('/');   // Force specific
```

---

## Exception Handling

```php
$this->withoutExceptionHandling()->get('/broken');  // Show full exception
$this->withExceptionHandling()->get('/broken');     // Re-enable
```

---

## File Uploads

```php
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

Storage::fake('avatars');
$file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

$this->post('/avatar', ['avatar' => $file])->assertOk();
Storage::disk('avatars')->assertExists('avatars/avatar.jpg');
```

---

## Quick Reference

| Method | Purpose |
|--------|---------|
| `get()`, `post()` | HTML form requests |
| `getJson()`, `postJson()` | API requests |
| `withHeaders()` | Add headers |
| `withCookies()` | Add cookies |
| `withSession()` | Set session |
| `withoutMiddleware()` | Skip middleware |

---

## Decision Tree

```
Request type?
├── HTML form → post(), get()
├── API → postJson(), getJson()
├── Auth required → actingAs() first
├── Custom headers → withHeaders()
├── File upload → UploadedFile::fake()
└── Debug → withoutExceptionHandling()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Use `*Json()` methods for APIs | Call real external services |
| Fake storage for uploads | Forget to re-enable middleware |
| Disable exception handling for debug | Leave withoutMiddleware in prod tests |
