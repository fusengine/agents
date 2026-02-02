---
name: console-tests
description: Testing Artisan commands
file-type: markdown
---

# Console Testing

## Basic Command Test

```php
$this->artisan('inspire')->assertSuccessful();
$this->artisan('inspire')->assertExitCode(0);
$this->artisan('invalid')->assertFailed();
```

---

## Exit Code Assertions

| Assertion | Code |
|-----------|------|
| `assertSuccessful()` | 0 |
| `assertFailed()` | ≠ 0 |
| `assertExitCode($n)` | Specific |
| `assertNotExitCode($n)` | Not specific |

---

## Output Assertions

```php
$this->artisan('greet', ['name' => 'Taylor'])
    ->expectsOutput('Hello, Taylor!')
    ->expectsOutputToContain('Taylor')
    ->doesntExpectOutput('Error')
    ->assertSuccessful();
```

---

## Interactive Commands

```php
$this->artisan('make:user')
    ->expectsQuestion('What is the name?', 'John')
    ->expectsQuestion('What is the email?', 'john@example.com')
    ->expectsConfirmation('Are you sure?', 'yes')
    ->expectsChoice('Select role', 'admin', ['admin', 'user'])
    ->expectsOutput('User created!')
    ->assertSuccessful();
```

---

## Table Output

```php
$this->artisan('users:list')
    ->expectsTable(['ID', 'Name'], [[1, 'John'], [2, 'Jane']])
    ->assertSuccessful();
```

---

## With Arguments & Options

```php
$this->artisan('user:show', ['user' => 1])->assertSuccessful();
$this->artisan('migrate', ['--seed' => true])->assertSuccessful();
$this->artisan('email:send', ['user' => 1, '--queue' => true, '--delay' => 60]);
```

---

## Testing Scheduled Commands

```php
it('schedules daily backup', function () {
    $events = collect(app(Schedule::class)->events())
        ->filter(fn ($e) => str_contains($e->command, 'backup:run'));
    expect($events)->toHaveCount(1);
    expect($events->first()->expression)->toBe('0 0 * * *');
});
```

---

## Decision Tree

```
Console test?
├── Simple run → assertSuccessful()
├── Check output → expectsOutput()
├── Interactive → expectsQuestion()
├── Confirm → expectsConfirmation()
├── Choice → expectsChoice()
├── With args → artisan('cmd', ['arg' => 'val'])
└── Schedule → Check Schedule events
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Test success and failure paths | Skip testing user prompts |
| Test interactive flows | Forget output assertions |
| Use meaningful exit codes | Test framework commands |
