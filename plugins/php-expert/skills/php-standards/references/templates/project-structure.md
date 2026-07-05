---
name: project-structure
description: Standard directory layout for a framework-agnostic PHP package
keywords: template, project structure, src, tests, bin, PSR-4 layout
---

# Standard PHP Package Structure

The conventional layout for a Composer/PSR-4 library. Framework-agnostic.

---

## Layout

```
my-package/
├── composer.json           # PSR-4 autoload + scripts (root config)
├── composer.lock           # committed for apps, gitignored for libs
├── .php-cs-fixer.dist.php   # PER-CS 3.0 ruleset
├── phpunit.xml.dist        # test config
├── phpstan.neon.dist       # static analysis config
├── .gitignore              # /vendor, /.php-cs-fixer.cache, ...
├── README.md
├── LICENSE
├── bin/                    # CLI entry points (declared in composer "bin")
│   └── console
├── src/                    # Vendor\Package\  → PSR-4 root (autoload)
│   ├── Contract/           # interfaces
│   ├── Service/
│   └── ValueObject/
└── tests/                  # Vendor\Package\Tests\ → PSR-4 (autoload-dev)
    ├── Unit/
    └── Integration/
```

---

## Rules

| Directory | Namespace | Autoload key |
|-----------|-----------|--------------|
| `src/` | `Vendor\Package\` | `autoload.psr-4` |
| `tests/` | `Vendor\Package\Tests\` | `autoload-dev.psr-4` |
| `bin/` | — (scripts) | `bin` |

- One class per file; filename matches class name (PSR-4).
- Interfaces separated (e.g. `src/Contract/`) — supports dependency inversion.
- Never map `tests/` under `autoload` — keep test classes out of consumers' autoloader.

---

## Minimal .gitignore

```gitignore
/vendor/
/.php-cs-fixer.cache
/.phpunit.result.cache
composer.lock
```

Remove the `composer.lock` line for **applications** (apps commit the lock; libraries do not).

---

## phpunit.xml.dist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="integration">
            <directory>tests/Integration</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>
</phpunit>
```

→ See [composer-json.md](composer-json.md) for the matching autoload + scripts
