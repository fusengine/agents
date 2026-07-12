---
name: php-ecosystem-reference
description: "Orientation map of the PHP framework ecosystem — NOT deep expertise. Use to know WHICH tool fits and WHERE to route: standalone Symfony components (Console, Process, HttpFoundation, EventDispatcher, Validator, Serializer) usable via Composer outside any framework, API Platform 4.3 (API-first on Symfony), and the Slim micro-framework. Do NOT use for implementation — Laravel routes to laravel-expert; deep full-stack Symfony has no dedicated expert (flag to the user)."
versions:
  api-platform: "4.3"
  slim: "4.15"
user-invocable: true
references: references/symfony-components.md, references/api-platform.md, references/slim-framework.md, references/boundaries.md
related-skills: php-http-psr, solid-php
---

# PHP Ecosystem Reference (Orientation)

## Scope (read this first)

This skill is a **routing / orientation map**, NOT an implementation expert. It answers
"which tool fits this problem, and where do I go next?" It does **not** carry deep,
version-specific how-to knowledge for Symfony full-stack, API Platform, or Slim.

For actual implementation:
- **Laravel** → route to the `laravel-expert` agent (out of scope here).
- **Framework-agnostic HTTP (PSR-7/15/17/18)** → use [[php-http-psr]].
- **Deep Symfony full-stack** → there is **no dedicated expert agent**; flag this to the user (see [boundaries.md](references/boundaries.md)).

## Agent Workflow (MANDATORY)

Before relying on any detail here, use `TeamCreate` to spawn 2 agents:

1. **fuse-ai-pilot:research-expert** - Verify current versions/APIs on symfony.com, api-platform.com, slimframework.com
2. **fuse-ai-pilot:explore-codebase** - Detect which of these are already in composer.json

This skill orients; the research agent supplies verified specifics before any code.

---

## Overview

| Area | What it is | Reference |
|------|-----------|-----------|
| **Symfony Components** | Decoupled PHP libraries, each installable standalone via Composer — no full framework needed | [symfony-components.md](references/symfony-components.md) |
| **API Platform 4.3** | API-first framework built on Symfony (REST, GraphQL, OpenAPI from resource classes) | [api-platform.md](references/api-platform.md) |
| **Slim 4.15** | PSR-7/PSR-15 micro-framework for small APIs and services | [slim-framework.md](references/slim-framework.md) |
| **Boundaries** | Where this skill stops and who to route to | [boundaries.md](references/boundaries.md) |

---

## Critical Rules

1. **Orientation only** - Never present ecosystem details as authoritative; the research agent verifies before code.
2. **Standalone ≠ framework** - Symfony components run WITHOUT the Symfony framework; `composer require symfony/console` is enough.
3. **HttpFoundation is not PSR-7** - Symfony's HTTP model differs from PSR-7; bridge via `symfony/psr-http-message-bridge` ([[php-http-psr]]).
4. **Laravel is out of scope** - Any Laravel task routes to `laravel-expert`.
5. **No deep Symfony expert exists** - For full-stack Symfony depth, tell the user explicitly rather than improvising.

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Symfony Components** | [symfony-components.md](references/symfony-components.md) | Picking a standalone library (CLI, process, events, validation…) |
| **API Platform** | [api-platform.md](references/api-platform.md) | Building an API-first app on Symfony |
| **Slim** | [slim-framework.md](references/slim-framework.md) | Small PSR-based micro-service or API |
| **Boundaries** | [boundaries.md](references/boundaries.md) | Deciding whether to route elsewhere |

---

## Quick Reference

### Install a standalone Symfony component

```bash
composer require symfony/console       # CLI apps
composer require symfony/process       # run sub-processes
composer require symfony/event-dispatcher
composer require symfony/validator
composer require symfony/serializer
```

### Decision shortcut

| Need | Route to |
|------|----------|
| Full Laravel app | `laravel-expert` agent |
| Framework-agnostic HTTP messages/middleware | [[php-http-psr]] |
| One utility (CLI, events, validation) without a framework | Symfony component, see [symfony-components.md](references/symfony-components.md) |
| API-first product on Symfony | API Platform, see [api-platform.md](references/api-platform.md) |
| Tiny PSR-7 API/service | Slim, see [slim-framework.md](references/slim-framework.md) |
| Deep Symfony full-stack MVC | No expert — flag to user ([boundaries.md](references/boundaries.md)) |

---

## Best Practices

### DO
- Use this map to choose a direction, then hand off to the research agent for specifics
- Prefer a single standalone component over a full framework for a narrow need
- State clearly when a task falls outside any available expert

### DON'T
- Present version-specific API details from here as verified — they are orientation
- Attempt deep Laravel or deep Symfony full-stack work under this skill
- Assume Symfony HttpFoundation and PSR-7 are interchangeable
