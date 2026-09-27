---
name: releases
description: Laravel version support policy and upgrade guidance
when-to-use: Consult when choosing Laravel version, planning upgrades, or checking support status
keywords: version, release, support, upgrade, php, breaking changes, lts
priority: medium
related: lifecycle.md
---

# Laravel Releases

## Overview

Laravel follows semantic versioning with annual major releases. Choose versions based on support timeline and PHP requirements.

---

## Versioning Scheme

| Type | Frequency | Breaking Changes |
|------|-----------|------------------|
| **Major** (13.0) | Yearly (~Q1) | Yes |
| **Minor** (13.1) | Weekly | No |
| **Patch** (13.0.1) | As needed | No |

**Constraint**: Always use `^13.0` in `composer.json` (not `13.*`). Current stable: **13.33** (Sept 2026).

---

## Support Policy

| Duration | Type |
|----------|------|
| **18 months** | Bug fixes |
| **2 years** | Security fixes |

---

## Version Matrix (2025-2028)

| Version | PHP | Release | Bug Fixes | Security |
|---------|-----|---------|-----------|----------|
| **12** | 8.2 - 8.5 | Feb 24, 2025 | Aug 13, 2026 | Feb 24, 2027 |
| **13** | 8.3 - 8.5 | Mar 17, 2026 | Q3 2027 | Mar 17, 2028 |

**Recommendation**: Use Laravel 13 for new projects (current stable).

---

## Laravel 13 Highlights

| Feature | Description |
|---------|-------------|
| **Minimal breaking changes** | Upgrade in < 1 day |
| **PHP 8.3 minimum** | Supports PHP 8.3 - 8.5 |
| **Laravel AI SDK** | First-party `laravel/ai` (agents, tools, embeddings) |
| **JSON:API resources** | `JsonApiResource` base class |
| **Vector search** | pgvector query builder methods |
| **PHP attributes** | Eloquent, queue, controller, console, form request attributes |

### Deprecated

| Package | Status | Alternative |
|---------|--------|-------------|
| Laravel Breeze | No more updates | New starter kits |
| Laravel Jetstream | No more updates | New starter kits |

---

## Upgrade Decision Guide

```
Current version supported?
├── Yes → Need new features?
│   ├── Yes → Plan upgrade during maintenance window
│   └── No → Stay on current version
└── No (EOL) → Upgrade immediately (security risk)
```

---

## PHP Compatibility

| Laravel | Minimum PHP | Maximum PHP |
|---------|-------------|-------------|
| 10 | 8.1 | 8.3 |
| 11 | 8.2 | 8.4 |
| 12 | 8.2 | 8.5 |
| 13 | 8.3 | 8.5 |

**Tip**: Target PHP 8.5 (current stable) for best performance and features — some L13 features (e.g. `#[BindWhen]`) require it.

---

## Upgrade Checklist

- [ ] Check PHP version compatibility
- [ ] Review breaking changes in upgrade guide
- [ ] Update `composer.json` constraint
- [ ] Run `composer update`
- [ ] Run test suite
- [ ] Check deprecated features
- [ ] Update deprecated code

---

## Best Practices

### DO
- Upgrade within 6 months of new major release
- Test thoroughly in staging first
- Read the official upgrade guide
- Keep PHP version current

### DON'T
- Don't skip major versions (10 → 12)
- Don't upgrade without test coverage
- Don't ignore deprecation warnings
- Don't stay on EOL versions
