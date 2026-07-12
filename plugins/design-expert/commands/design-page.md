---
name: design-page
description: "New page or screen in an existing project. Skips design-system creation — reuses the existing design-system.md tokens."
---

# /design:page — New Page (PAGE scope)

Add a new page/screen to a project that already has a `design-system.md`.

**Complete documentation**: `skills/design-method/SKILL.md` (routing table), `skills/design-web/SKILL.md` or `skills/design-webapp/SKILL.md` (generation).

## Usage

```
/design:page about page
/design:page contact form with map
/design:page team members grid
/design:page settings screen for the dashboard
```

## Prerequisites
`design-system.md` must exist at project root. If missing, use `/design` instead (FULL scope).

## Workflow

1. Read the existing `design-system.md` completely — tokens, typography, spacing, motion profile.
2. Route per `design-method`: `skills/design-web/SKILL.md` (marketing page — browse 2 inspiration sites) or `skills/design-webapp/SKILL.md` (app screen — pick the matching page/interaction pattern, no browsing).
3. Read `skills/design-motion/SKILL.md` — same gate as `/design`.
4. Read `skills/design-review/SKILL.md` — same deterministic checks + bounded visual loop, plus a consistency check against the rest of the project's pages.

## Forbidden
Creating a new `design-system.md` (must reuse the existing one). Everything forbidden in `/design` also applies here.
