---
name: phpstan-neon
description: Complete phpstan.neon for a strict framework-agnostic project
keywords: phpstan, neon, baseline, strict-rules, bleeding-edge, template
---

# phpstan.neon Template

Complete configuration for a modern strict project. Drop at repo root.

## Config file

```yaml
# phpstan.neon  (repo root)
includes:
    # Uncomment once installed via composer require --dev phpstan/phpstan-strict-rules
    # - vendor/phpstan/phpstan-strict-rules/rules.neon
    # Generated debt file; keep only while burning it down
    - phpstan-baseline.neon

parameters:
    level: 9                      # greenfield: 9-10; legacy: highest passing level
    phpVersion: 80400             # analyse assuming PHP 8.4 semantics

    paths:
        - src
        - tests

    # Extra strictness not covered by any level
    checkUninitializedProperties: true
    checkBenevolentUnionTypes: true

    # Bleeding Edge: preview next-major analysis in the current stable release
    featureToggles:
        bleedingEdge: true

    ignoreErrors:
        # Prefer fixing over ignoring; scope every ignore narrowly.
        # - '#Access to an undefined property App\\Legacy#'
```

## Baseline workflow

```bash
# 1. Install
composer require --dev phpstan/phpstan phpstan/phpstan-strict-rules

# 2. Record current errors so a high level runs green
vendor/bin/phpstan analyse --generate-baseline

# 3. Run normally; baseline-listed errors are suppressed
vendor/bin/phpstan analyse

# 4. Over time: delete entries as you fix them, regenerate when it shrinks
```

## Notes

- `level: 9` is our greenfield default; `10` (PHPStan 2.0) also flags implicit `mixed`.
- Set `phpVersion` to the minimum PHP you support so analysis matches runtime.
- Remove the `phpstan-baseline.neon` include once the baseline reaches zero.
- Install framework extensions (e.g. `phpstan/phpstan-doctrine`) and add their
  `.neon` files to `includes` for accurate third-party types.
