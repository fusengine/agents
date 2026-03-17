---
name: astro-actions
description: Expert Astro Server Actions — defineAction, astro:actions, Zod validation, ActionError, HTML form actions, accept form, progressive enhancement, redirect patterns. Use when handling form submissions, mutations, or any server-side logic with type safety.
versions:
  astro: 6
  zod: 4
user-invocable: true
references: references/overview.md, references/defining-actions.md, references/error-handling.md, references/forms.md, references/progressive-enhancement.md, references/templates/contact-form.md, references/templates/json-action.md
related-skills: astro-6, astro-content, astro-islands
---

# Astro Actions Expert

Type-safe server functions with automatic validation, standardized errors, and progressive enhancement.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Check existing actions in `src/actions/`
2. **fuse-ai-pilot:research-expert** - Verify latest Actions docs via Context7/Exa
3. **mcp__context7__query-docs** - Get defineAction and ActionError examples

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Handling form submissions with server-side validation
- Creating type-safe backend mutations without API boilerplate
- Building progressive enhancement (works without JS)
- Replacing API endpoints for client-server communication

### Why Astro Actions

| Feature | Benefit |
|---------|---------|
| `defineAction()` | Type-safe server function definition |
| Zod validation | Automatic JSON and FormData parsing |
| `ActionError` | Standardized error codes and messages |
| `accept: 'form'` | Direct HTML form submission support |
| Progressive enhancement | Works without JavaScript enabled |
| `astro:actions` | Client import for type-safe calls |

---

## Core Concepts

### Action Structure

All actions live in `src/actions/index.ts` and export a `server` object:

```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  myAction: defineAction({ /* ... */ })
}
```

### Accept Modes

| Mode | Description |
|------|-------------|
| `accept: 'json'` (default) | Parses JSON request body |
| `accept: 'form'` | Parses HTML FormData directly |

### Error Codes

Standard HTTP-aligned codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`, `INTERNAL_SERVER_ERROR`, `CONFLICT`, `TOO_MANY_REQUESTS`.

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Concepts & architecture | [overview.md](references/overview.md) |
| defineAction patterns | [defining-actions.md](references/defining-actions.md) |
| ActionError handling | [error-handling.md](references/error-handling.md) |
| HTML form integration | [forms.md](references/forms.md) |
| Progressive enhancement | [progressive-enhancement.md](references/progressive-enhancement.md) |
| Contact form template | [templates/contact-form.md](references/templates/contact-form.md) |
| JSON action template | [templates/json-action.md](references/templates/json-action.md) |

---

## Best Practices

1. **Always define `input` schema** — Never skip Zod validation
2. **Use `ActionError` for known errors** — Standardized codes for client handling
3. **`accept: 'form'` for HTML forms** — Native form submission support
4. **Progressive enhancement** — Form works without JS, enhanced with it
5. **Check `ctx.cookies` for auth** — Throw `UNAUTHORIZED` when not logged in
