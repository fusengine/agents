---
name: api-platform
description: API Platform 5.0 orientation — API-first framework on Symfony
source: https://api-platform.com/docs/ (redirects to /docs/symfony/, version selector "5.0 (current)") + github.com/api-platform/core/releases (v5.0.0 2026-09-17) — verified 2026-09-27
keywords: api-platform, api-first, symfony, rest, graphql, openapi, llms.txt
---

# API Platform 5.0 (Orientation)

Load when a project is API-first and built on Symfony. This is orientation — have the research
agent confirm current APIs on api-platform.com/docs before implementing.

## What it is

API Platform is an **API-first framework built on top of Symfony**. You declare API **resources**
(typically PHP classes with attributes) and the framework generates REST endpoints, a GraphQL
schema, OpenAPI/Swagger documentation, and Hydra/JSON-LD output — driven from the resource metadata
rather than hand-written controllers.

Current documented version: **5.0** (docs version selector; `api-platform/core` v5.0.1 on
Packagist, PHP `>=8.2`). 5.0 requires Symfony `^7.4 || ^8.0` (drops 6.4 and 7.0–7.3), removes
the APIs deprecated in 4.x and replaces the legacy PropertyInfo `Type` system with
`symfony/type-info` — upgrading from 4.x goes through the docs' Upgrade Guide. The 4.4 line
still receives releases for projects that cannot move yet.

## When to reach for it

| Fits | Poor fit |
|------|----------|
| API-first product where the API is the core deliverable | Simple site with a couple of JSON endpoints (Slim is lighter) |
| You want REST + GraphQL + OpenAPI generated together | You need full control over every controller by hand |
| Already on Symfony | Laravel project → use `laravel-expert` (Laravel has its own API tooling) |

## LLM-friendly docs

API Platform publishes a machine-readable documentation index for AI agents at
**https://api-platform.com/docs/llms.txt**. Point the research agent there for a
current, structured entry into the docs.

## Ecosystem placement

API Platform sits **on Symfony** and reuses Symfony components (Serializer, Validator, Routing,
HttpKernel — see [symfony-components.md](symfony-components.md)). It also interoperates with the PSR
HTTP standards; for framework-agnostic message/middleware work see [[php-http-psr]].

## Boundary

This skill does not carry API Platform implementation depth (resource configuration, custom
providers/processors, security voters, GraphQL resolvers). Route those specifics through the
research agent and flag that no dedicated API Platform expert agent exists — see
[boundaries.md](boundaries.md).
