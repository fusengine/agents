---
name: pest-basics
description: Pest 3 syntax - it(), test(), describe(), expect()
file-type: markdown
---

# Pest Basics

## Test Syntax

| Function | Style | Use Case |
|----------|-------|----------|
| `it()` | BDD | Behavior description |
| `test()` | Classic | General tests |
| `describe()` | Group | Related tests |

---

## Basic Tests

```php
it('has a homepage', function () {
    $this->get('/')->assertOk();
});

test('homepage returns 200', function () {
    $this->get('/')->assertOk();
});
```

---

## Grouping with describe()

```php
describe('User Registration', function () {
    it('shows form', fn () => $this->get('/register')->assertOk());
    it('validates fields', fn () => $this->post('/register', [])->assertSessionHasErrors(['email']));
    it('creates user', fn () => $this->post('/register', $data)->assertRedirect('/dashboard'));
});
```

---

## Expectations (expect())

```php
expect($result)->toBe(3)->toBeInt()->toBeGreaterThan(0);

expect($user)
    ->toBeInstanceOf(User::class)
    ->name->toBe('John')
    ->email->toContain('@');
```

---

## Common Expectations

| Expectation | Description |
|-------------|-------------|
| `toBe($val)` | Strict equality |
| `toEqual($val)` | Loose equality |
| `toBeTrue()` / `toBeFalse()` | Boolean |
| `toBeNull()` | Is null |
| `toBeEmpty()` | Is empty |
| `toContain($val)` | Contains value |
| `toHaveCount($n)` | Has count |
| `toThrow()` | Throws exception |
| `toBeInstanceOf()` | Instance check |

---

## Test Modifiers

```php
it('needs work')->skip();
it('requires API')->skip('Missing credentials');
it('todo')->todo();
it('focused')->only();
it('flaky')->repeat(3);
```

---

## Higher Order Tests

```php
it('has name')->expect(fn() => User::factory()->create()->name)->toBeString();
test('response')->get('/')->assertOk();
```

---

## Decision Tree

```
Which syntax?
├── Behavior → it('does something')
├── General → test('something works')
├── Group → describe('Feature')
├── Skip → ->skip() or ->todo()
└── Debug → ->only()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Use descriptive test names | Mix it() and test() inconsistently |
| Group with describe() | Leave ->only() in commits |
| Use expect() for readability | Write vague test names |
