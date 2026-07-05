---
name: composer-ci
description: composer scripts plus a GitHub Actions quality pipeline
keywords: composer, scripts, ci, github-actions, pipeline, template
---

# Composer Scripts + CI Template

Wires the three tools into one command locally and one gated pipeline in CI.

## composer.json scripts

```json
{
  "scripts": {
    "cs:check": "php-cs-fixer check --diff",
    "cs:fix": "php-cs-fixer fix",
    "stan": "phpstan analyse",
    "rector:check": "rector process --dry-run",
    "rector:fix": "rector process",
    "test": "phpunit",
    "qa": [
      "@cs:check",
      "@stan",
      "@test"
    ]
  }
}
```

`composer qa` runs the full gate locally in the same order as CI.

## GitHub Actions pipeline

```yaml
# .github/workflows/qa.yml
name: QA

on:
  push:
    branches: [main]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      # Order matters: cheap style check fails fast, then analysis, then tests
      - name: Coding standard
        run: composer cs:check

      - name: Static analysis
        run: composer stan

      - name: Rector (drift guard)
        run: composer rector:check

      - name: Tests
        run: composer test
```

## Why this order

| Step | Rationale |
|------|-----------|
| `cs:check` | Cheapest; a stray space shouldn't wait behind a full test run |
| `stan` | Catches type bugs before executing anything |
| `rector:check` | `--dry-run` guards against un-applied refactors (non-blocking option: `continue-on-error`) |
| `test` | Slowest; runs last on already-valid code |

## Notes

- CI uses `check` / `--dry-run` (read-only). Developers run `cs:fix` / `rector:fix` locally.
- Match `php-version` to the minimum PHP in `composer.json`.
- Add `--error-format=github` to PHPStan for inline PR annotations.
