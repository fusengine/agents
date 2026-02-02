---
name: http-auth
description: Authentication testing - actingAs, guards, Sanctum
file-type: markdown
---

# Authentication Testing

## actingAs

```php
$user = User::factory()->create();
$this->actingAs($user)->get('/dashboard')->assertOk();

// With guard
$this->actingAs($admin, 'admin')->get('/admin');
$this->actingAs($user, 'api')->getJson('/api/profile');
```

---

## Auth Assertions

```php
$this->post('/login', $credentials);
$this->assertAuthenticated();
$this->assertAuthenticatedAs($user);

$this->assertGuest();
$this->assertGuest('admin'); // Specific guard
```

---

## Login/Logout

```php
it('user can login', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $this->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect('/dashboard');

    $this->assertAuthenticatedAs($user);
});

it('user can logout', function () {
    $this->actingAs(User::factory()->create())
        ->post('/logout')
        ->assertRedirect('/');
    $this->assertGuest();
});
```

---

## Sanctum API Tokens

```php
use Laravel\Sanctum\Sanctum;

Sanctum::actingAs($user, ['read', 'write']);
$this->getJson('/api/posts')->assertOk();

// Specific abilities
Sanctum::actingAs($user, ['posts:read']);
Sanctum::actingAs($user, ['*']); // All abilities
```

---

## Protected Routes

```php
it('guest cannot access dashboard', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

it('unverified user cannot access', function () {
    $user = User::factory()->unverified()->create();
    $this->actingAs($user)->get('/verified-only')->assertRedirect('/email/verify');
});
```

---

## Role-Based Testing

```php
it('admin can access admin panel', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->get('/admin')
        ->assertOk();
});

it('regular user cannot access admin', function () {
    $this->actingAs(User::factory()->create())
        ->get('/admin')
        ->assertForbidden();
});
```

---

## Decision Tree

```
Auth testing?
├── Simple auth → actingAs($user)
├── API auth → Sanctum::actingAs()
├── Multiple guards → actingAs($user, 'guard')
├── Check logged in → assertAuthenticated()
├── Check guest → assertGuest()
└── Token abilities → Sanctum with abilities array
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Use factories for test users | Hardcode passwords in tests |
| Test both authenticated and guest | Skip testing unauthorized access |
| Test role/permission boundaries | Forget to test ability-based access |
