---
name: 01-analyze-code
description: Understand Laravel codebase before making changes
prev_step: references/laravel/00-init-branch.md
next_step: references/laravel/02-features-plan.md
---

# 01 - Analyze Code (Laravel)

**Understand Laravel codebase before making changes (APEX Phase A).**

## When to Use

- After creating feature branch
- Before writing ANY code
- When unfamiliar with affected areas

---

## Dual-Agent Analysis

### Launch in Parallel (ONE message)

```text
Agent 1: explore-codebase
-> Map app/ structure
-> Identify patterns (Services, Repositories)
-> Find existing Models, Controllers

Agent 2: research-expert
-> Verify Laravel 12 documentation
-> Confirm Eloquent methods/patterns
-> Check package compatibility
```

---

## Laravel Project Discovery

### Directory Structure

```text
app/
├── Http/Controllers/     # Thin controllers
├── Models/               # Eloquent models
├── Services/             # Business logic
├── Repositories/         # Data access layer
├── Contracts/            # Interfaces ONLY
├── Actions/              # Single-purpose classes
├── DTOs/                 # Data transfer objects
├── Enums/                # PHP 8.1+ enums
└── Policies/             # Authorization
```

### Key Files to Analyze

```text
routes/
├── web.php               # Web routes
├── api.php               # API routes
└── console.php           # CLI commands

config/                   # Configuration files
database/migrations/      # Database structure
tests/                    # Pest/PHPUnit tests
```

---

## Artisan Exploration Commands

### List Routes

```bash
php artisan route:list
php artisan route:list --name=user
php artisan route:list --path=api
```

### Model Information

```bash
php artisan model:show User
php artisan model:show Post --database
```

### Application Info

```bash
php artisan about
php artisan config:show database
```

---

## Tinker for Exploration

### Quick Model Inspection

```php
php artisan tinker

// Check model attributes
User::first()->toArray();

// Explore relationships
User::with('posts')->first();

// Test query scopes
Post::published()->count();
```

---

## Key Questions

```text
[ ] What Services exist? (app/Services/)
[ ] What patterns are used? (Repository, Action?)
[ ] What base classes exist?
[ ] Are DTOs used?
[ ] How is validation handled?
[ ] What events/listeners exist?
[ ] What jobs/queues are configured?
```

---

## research-expert Focus

### Documentation Verification

```text
1. Laravel 12.x docs (laravel.com/docs/12.x)
   -> Eloquent methods
   -> New features
   -> Deprecations

2. Package docs
   -> Sanctum/Passport
   -> Livewire 3
   -> Pest PHP

3. PHP 8.5 features
   -> Pipe operator
   -> Clone with
   -> New attributes
```

---

## Output Requirements

### From explore-codebase

```markdown
## Laravel Codebase Analysis

### Architecture Pattern
- [Repository/Service/Action pattern used]

### Existing Services
- UserService, OrderService, etc.

### Models & Relationships
- User hasMany Posts
- Post belongsTo User

### Change Locations
- Files to modify
- Files to create
```

### From research-expert

```markdown
## Research Findings

### Laravel 12 Specifics
- [relevant new features]
- [deprecated methods to avoid]

### Best Practices
- [patterns from docs]
- [anti-patterns]
```

---

## Anti-Patterns

```text
Skip analysis and start coding
Assume Eloquent syntax without docs
Ignore existing Service pattern
Create duplicate Helpers
Use outdated Laravel 10 patterns
```

---

## Validation Checklist

```text
[ ] explore-codebase completed
[ ] research-expert completed
[ ] Existing patterns documented
[ ] Eloquent APIs verified
[ ] Laravel 12 features checked
[ ] Routes understood
```

---

## Next Phase

Proceed to `02-features-plan.md`
