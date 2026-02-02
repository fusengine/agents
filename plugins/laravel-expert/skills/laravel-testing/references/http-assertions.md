---
name: http-assertions
description: HTTP response assertions - status, headers, views, redirects
file-type: markdown
---

# HTTP Assertions

## Status Codes

| Assertion | Code | Assertion | Code |
|-----------|------|-----------|------|
| `assertOk()` | 200 | `assertUnauthorized()` | 401 |
| `assertCreated()` | 201 | `assertForbidden()` | 403 |
| `assertNoContent()` | 204 | `assertNotFound()` | 404 |
| `assertFound()` | 302 | `assertUnprocessable()` | 422 |

```php
$this->get('/')->assertOk();
$this->post('/users', $data)->assertCreated();
$this->get('/protected')->assertUnauthorized();
$this->get('/')->assertStatus(200)->assertSuccessful(); // 2xx
```

---

## Redirects

```php
$this->post('/login', $creds)->assertRedirect('/dashboard');
$this->post('/login', $creds)->assertRedirectToRoute('dashboard');
$this->post('/oauth')->assertRedirectContains('oauth.example.com');
```

---

## Content Assertions

```php
$this->get('/')
    ->assertSee('Welcome')
    ->assertDontSee('Error')
    ->assertSeeText('Hello')        // Without HTML
    ->assertSeeInOrder(['First', 'Second']);
```

---

## View Assertions

```php
$this->get('/')
    ->assertViewIs('home')
    ->assertViewHas('users')
    ->assertViewHas('title', 'Welcome')
    ->assertViewHas('count', fn ($v) => $v > 0)
    ->assertViewMissing('admin');

$view = $this->get('/')->viewData('users');
```

---

## Header & Cookie Assertions

```php
$this->get('/api/users')
    ->assertHeader('Content-Type', 'application/json')
    ->assertHeaderMissing('X-Debug');

$this->get('/')
    ->assertCookie('session')
    ->assertCookie('theme', 'dark')
    ->assertCookieMissing('deleted');
```

---

## Session Assertions

```php
$this->post('/settings', $data)
    ->assertSessionHas('success')
    ->assertSessionHas('user_id', 1)
    ->assertSessionHasAll(['success', 'user_id'])
    ->assertSessionMissing('error');

// Validation errors
$this->post('/users', [])
    ->assertSessionHasErrors(['email', 'name'])
    ->assertSessionHasErrors(['email' => 'required']);

$this->post('/users', $valid)->assertSessionHasNoErrors();
```

---

## Download & Streaming

```php
$this->get('/download/report')->assertDownload('report.pdf');
$this->get('/stream')->assertStreamedContent('expected');
```

---

## Decision Tree

```
Assertion type?
├── Status → assertOk(), assertStatus()
├── Redirect → assertRedirect()
├── Content → assertSee()
├── View → assertViewIs(), assertViewHas()
├── Headers → assertHeader()
├── Cookies → assertCookie()
├── Session → assertSessionHas()
└── Errors → assertSessionHasErrors()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Assert status before content | Only test happy path |
| Use specific status assertions | Forget redirect destinations |
| Test validation errors | Skip error assertions |
