---
name: psr4-autoloading
description: PSR-4 autoloading — namespace-to-path mapping in composer.json and how it differs from PSR-0
when-to-use: Load when wiring composer autoload, mapping namespaces to directories, or migrating off PSR-0
keywords: PSR-4, autoload, autoload-dev, classmap, files, namespace, composer dump-autoload
priority: high
related: psr-catalog.md
---

# PSR-4 Autoloading

## Overview

PSR-4 maps a namespace prefix to a base directory. It is the recommended autoloading strategy — no autoloader regeneration is needed when you add classes. Source: getcomposer.org/doc/04-schema.md.

---

## PSR-4 vs PSR-0

| Aspect | PSR-4 (use this) | PSR-0 (deprecated) |
|--------|------------------|---------------------|
| Prefix in file path | **Not** included | Included |
| Underscores in class name | Ignored | Treated as directory separators |
| `target-dir` needed | Never | Sometimes |
| Status | Accepted | Deprecated |

With PSR-4, prefix `Foo\` → `src/` means `Foo\Bar\Baz` resolves to `src/Bar/Baz.php` (the `Foo\` prefix is **not** repeated in the path).

---

## Mapping Options in `autoload`

| Key | Purpose |
|-----|---------|
| `psr-4` | Namespace → directory (recommended) |
| `classmap` | Scan directories/files for classes (libs not following PSR-4) |
| `files` | Always-included files (procedural functions) |
| `exclude-from-classmap` | Skip paths (e.g. `/tests/`) from generated classmap |

---

## Core Pattern

```json
{
    "autoload": {
        "psr-4": { "Vendor\\Package\\": "src/" }
    },
    "autoload-dev": {
        "psr-4": { "Vendor\\Package\\Tests\\": "tests/" }
    }
}
```

- Production namespace → `src/` under `autoload`.
- Test namespace → `tests/` under `autoload-dev` (kept out of consumers' autoloader).

A prefix may map to **multiple** directories: `"Monolog\\": ["src/", "lib/"]`.
An empty prefix `"": "src/"` is a fallback (avoid in libraries).

→ See [composer-json.md](templates/composer-json.md) for the full file

---

## Function Autoloading

```json
{
    "autoload": {
        "psr-4": { "Vendor\\Package\\": "src/" },
        "files": ["src/functions.php"]
    }
}
```

Use `files` only for procedural helpers PHP cannot autoload.

---

## Regenerate After Structure Changes

```bash
composer dump-autoload           # rebuild the maps
composer dump-autoload -o        # optimized classmap for production
```

Only `classmap`/`files` need regeneration when files move; PSR-4 additions do not.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Repeating the namespace prefix in the path | PSR-4 omits the prefix |
| Test classes under `autoload` | Move to `autoload-dev` |
| Using PSR-0 / `target-dir` | Migrate to PSR-4 |
| Forgetting `dump-autoload` after adding a `files` entry | Run it |

---

## Related References

- [psr-catalog.md](psr-catalog.md) - PSR-0 deprecation status
