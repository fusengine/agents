---
name: pest-arch
description: Pest architectural testing with arch()
file-type: markdown
---

# Pest Architecture Testing

## Basic arch() Tests

```php
// tests/Arch.php
arch('controllers use base controller')
    ->expect('App\Http\Controllers')
    ->toExtend('App\Http\Controllers\Controller');

arch('jobs implement ShouldQueue')
    ->expect('App\Jobs')
    ->toImplement('Illuminate\Contracts\Queue\ShouldQueue');

arch('requests extend FormRequest')
    ->expect('App\Http\Requests')
    ->toExtend('Illuminate\Foundation\Http\FormRequest');
```

---

## Dependency Rules

```php
arch('controllers should not use models directly')
    ->expect('App\Http\Controllers')
    ->not->toUse('App\Models');

arch('services use repositories')
    ->expect('App\Services')
    ->toOnlyUse(['App\Repositories', 'App\Contracts', 'Illuminate\Support']);
```

---

## Debugging & Env Rules

```php
arch('no debugging statements')
    ->expect(['dd', 'dump', 'ray', 'var_dump'])
    ->not->toBeUsed();

arch('env only in config')
    ->expect('env')
    ->not->toBeUsedIn('App');
```

---

## Trait & Structure Checks

```php
arch('models use soft deletes')
    ->expect('App\Models')
    ->ignoring('App\Models\Log')
    ->toUseTrait('Illuminate\Database\Eloquent\SoftDeletes');

arch('controllers are final')
    ->expect('App\Http\Controllers')
    ->toBeFinal();

arch('DTOs are readonly')
    ->expect('App\Data')
    ->toBeReadonly();

arch('strict types everywhere')
    ->expect('App')
    ->toUseStrictTypes();
```

---

## Naming Conventions

```php
arch('controllers have Controller suffix')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller');

arch('interfaces have Interface suffix')
    ->expect('App\Contracts')
    ->toHaveSuffix('Interface');
```

---

## Laravel Presets

```php
arch()->preset()->laravel();
arch()->preset()->security();
arch()->preset()->laravel()->ignoring('App\Legacy');
```

---

## Common Rules

| Rule | Purpose |
|------|---------|
| `toExtend()` | Verify inheritance |
| `toImplement()` | Check interface |
| `toUseTrait()` | Require trait |
| `not->toUse()` | Forbid dependency |
| `toBeFinal()` | Enforce final |
| `toUseStrictTypes()` | Require strict |

---

## Decision Tree

```
Architecture rule?
├── Inheritance → toExtend()
├── Interface → toImplement()
├── Dependencies → toUse() / not->toUse()
├── Naming → toHaveSuffix()
├── Structure → toBeFinal() / toBeReadonly()
└── Laravel rules → preset()->laravel()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Create tests/Arch.php for all rules | Over-constrain dependencies |
| Use presets as baseline | Forget to run arch tests in CI |
| Ignore legacy code explicitly | Skip arch tests |
