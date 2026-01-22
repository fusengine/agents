---
name: 00-init-branch
description: Create feature branch with Laravel project setup
prev_step: null
next_step: references/laravel/01-analyze-code.md
---

# 00 - Init Branch (Laravel)

**Create feature branch with Laravel project setup.**

## When to Use

- Starting ANY new Laravel feature, fix, or task
- Before making any code changes
- After receiving a task/issue assignment

---

## Branch Naming Convention

### Format

```text
<type>/<issue-id>-<short-description>
```

### Types for Laravel

| Type | Use Case | Example |
| --- | --- | --- |
| `feature/` | New functionality | `feature/123-user-api` |
| `fix/` | Bug fixes | `fix/456-auth-middleware` |
| `hotfix/` | Urgent production fix | `hotfix/789-sql-injection` |
| `refactor/` | Code improvement | `refactor/321-service-layer` |
| `migration/` | Database changes | `migration/654-add-orders` |

---

## Workflow

### Step 1: Sync with Remote

```bash
git fetch origin
git checkout main
git pull origin main
```

### Step 2: Create Branch

```bash
git checkout -b feature/ISSUE-123-short-description
```

### Step 3: Install Dependencies

```bash
composer install
npm install
```

### Step 4: Environment Check

```bash
cp .env.example .env  # If new setup
php artisan key:generate
php artisan config:clear
```

---

## Laravel Setup Commands

### Database Reset (Development)

```bash
php artisan migrate:fresh --seed
```

### IDE Helper (if installed)

```bash
php artisan ide-helper:generate
php artisan ide-helper:models --nowrite
php artisan ide-helper:meta
```

### Cache Clear

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## Recommended Strategy: GitHub Flow

### Why GitHub Flow for Laravel

```text
Simple and effective for most Laravel projects:
1. main is always deployable
2. Feature branches for all work
3. Pull requests for review
4. Deploy after merge to main
```

### When to Use GitFlow

```text
Use GitFlow when:
- Multiple versions in production
- Strict release cycles
- Enterprise with scheduled releases
```

---

## Best Practices (2025)

### Short-Lived Branches

```text
Merge within 1-3 days
Small, focused changes
One feature per branch
Long-lived branches = merge hell
```

### Sync Frequently

```bash
git fetch origin main
git rebase origin/main
```

---

## Validation Checklist

```text
[ ] Branch created from latest main
[ ] Branch name follows convention
[ ] composer install successful
[ ] npm install successful
[ ] .env configured
[ ] Database migrated
[ ] Application runs locally
```

---

## Next Phase

Proceed to `01-analyze-code.md`
