---
name: boundaries
description: Routing boundaries — what this skill covers, what routes elsewhere, what has no expert
source: our-decision (Fusengine routing policy)
keywords: boundaries, routing, laravel-expert, symfony, scope, handoff
---

# Ecosystem Boundaries & Routing

Load when deciding whether a PHP task belongs here or must be handed off.

## What php-ecosystem-reference covers

Orientation across the framework-agnostic PHP ecosystem: **which** tool fits and **where** to go
next. It does NOT implement — it routes. Depth always comes from the research agent plus the
matching expert.

## Routing table

| Task | Route to | Notes |
|------|----------|-------|
| Laravel app (Eloquent, Artisan, Blade, Livewire, Sanctum…) | **`laravel-expert` agent** | Fully out of scope here; Laravel has its own dedicated expert. |
| Framework-agnostic HTTP (PSR-7/15/17/18) | **[[php-http-psr]]** | Messages, middleware pipelines, factories, clients. |
| One standalone Symfony component | [symfony-components.md](symfony-components.md) → research agent | Console, Process, Validator, etc. — no framework needed. |
| API-first product on Symfony | [api-platform.md](api-platform.md) → research agent | API Platform 4.3. |
| Small PSR-based micro-service | [slim-framework.md](slim-framework.md) → research agent | Slim 4.15+. |
| SOLID / file-size / interface rules for PHP | **[[solid-php]]** | Architecture enforcement. |

## The gap: no deep Symfony full-stack expert

There is **no dedicated agent** for deep Symfony **framework** (full-stack MVC) work — bundles,
service container / DI configuration, Doctrine ORM integration, security firewalls/voters, Twig,
Messenger, Symfony forms, or version-specific framework upgrades.

**When a task needs that depth, do NOT improvise.** State plainly to the user that:

1. This skill is orientation-level for Symfony, not an implementation expert.
2. No dedicated Symfony full-stack expert agent exists in the current setup.
3. The options are: (a) proceed with the research agent verifying every API against
   symfony.com/doc before writing code, or (b) create a dedicated `symfony-expert` agent first.

Flagging the gap is the correct behavior — silently producing unverified Symfony framework code is not.

## Laravel is a hard boundary

Never attempt Laravel implementation under this skill. Detect Laravel (`artisan` file,
`laravel/framework` in composer.json) and route to `laravel-expert`.
