---
name: checklist
description: Step-by-step upgrade checklist with validation gates
when-to-use: Track upgrade progress and ensure no step is skipped
keywords: checklist, validation, steps, gates
---

# Upgrade Checklist (L12 → L13)

Use this as a copy-paste TODO in your branch description or PR.

## Phase 1: Pre-upgrade (30 min)

- [ ] Create feature branch: `git checkout -b feat/laravel-13-upgrade`
- [ ] Backup database (or snapshot staging)
- [ ] Run full test suite on L12 — record passing count as baseline
- [ ] Audit current PHP version: `php -v` ≥ 8.3 required
- [ ] List third-party packages: `composer show --direct`
- [ ] Verify each package has L13-compatible version available

## Phase 2: Composer bump (5 min)

- [ ] `composer require laravel/framework:^13.0 laravel/tinker:^3.0 --no-update`
- [ ] `composer require --dev phpunit/phpunit:^12.0 pestphp/pest:^4.0 --no-update`
- [ ] `composer require laravel/serializable-closure:^2.0 --no-update`
- [ ] If Beanstalkd: `composer require pda/pheanstalk:^8.0 --no-update`
- [ ] `composer update --with-all-dependencies`
- [ ] Verify: `php artisan about` shows Laravel 13.x

## Phase 3: Breaking changes (1-3 h)

- [ ] **Middleware rename**: `validateCsrfTokens` → `validateOrigin` in `bootstrap/app.php`
- [ ] **Cache prefix preservation**: set `CACHE_PREFIX`, `REDIS_PREFIX`, `SESSION_COOKIE` in `.env`
- [ ] **Serializable classes config**: review `config/cache.php` → `serializable_classes`
- [ ] **Eloquent boot**: ensure no `new Model()` calls in service provider `register()`
- [ ] **PHPUnit 12 mocks**: refactor removed mock methods (check test errors)
- [ ] **Pest 4 config**: `vendor/bin/pest --init` if needed
- [ ] **QueueBusy event**: update listeners if used
- [ ] **Dispatcher contract**: add `dispatchAfterResponse()` if custom implementation
- [ ] **Str factories**: review tests with global Str overrides
- [ ] **Symfony 7.4/8.0**: check direct Symfony component usage
- [ ] Run tests: `vendor/bin/pest` — all green

## Phase 4: Attributes migration (optional, 2-4 h)

- [ ] Pick 1 Eloquent model — convert `$fillable`, `$hidden`, `$casts` to attributes
- [ ] Run model-specific tests
- [ ] Commit per-class migration
- [ ] Repeat for Queue jobs
- [ ] Repeat for Console commands, Form Requests, Resources
- [ ] Update team coding standards doc to use attributes for new code

## Phase 5: Validation (30 min)

- [ ] Full test suite green: `vendor/bin/pest`
- [ ] Type check: `vendor/bin/phpstan analyse` (if used)
- [ ] Linter: `vendor/bin/pint` (Laravel Pint)
- [ ] Sniper agent: `fuse-ai-pilot:sniper` on modified files
- [ ] Migration dry-run: `php artisan migrate --pretend`
- [ ] Manual smoke test: critical flows in staging
- [ ] Performance check: queue throughput, cache hit rate, response times

## Phase 6: Deploy

- [ ] Open PR with `gh pr create`
- [ ] CI green (all checks)
- [ ] Code review approved
- [ ] Merge with `gh pr merge --merge --delete-branch`
- [ ] Tag release: `git tag v<your-version>`
- [ ] Deploy to staging — observe 24h
- [ ] Deploy to production
- [ ] Monitor error rates for 48h post-deploy

## Rollback Plan

If issues post-deploy:
1. Revert merge commit on main
2. Re-deploy previous version
3. Restore database backup if migrations applied
4. Document incident, file follow-up ticket
