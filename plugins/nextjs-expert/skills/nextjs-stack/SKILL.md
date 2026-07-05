---
name: nextjs-stack
description: Next.js 16+ complete stack with App Router, Prisma 7, Better Auth, shadcn/ui, TanStack Form, Zustand. Use as the master reference combining all framework skills. Do NOT use for: core framework API details — routing, caching, Server Components internals, proxy.ts (use nextjs-16 and its references).
versions:
  nextjs: 16
  react: 19
  prisma: 7
  better-auth: 1.2
  shadcn-ui: 3.8.0
  tailwindcss: 4
user-invocable: true
related-skills: nextjs-16, prisma-7, better-auth, nextjs-shadcn, nextjs-tanstack-form, nextjs-zustand, nextjs-i18n, solid-nextjs
---

# Next.js Complete Stack

Master skill combining all framework documentation for modern Next.js development.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze project structure and existing patterns
2. **fuse-ai-pilot:research-expert** - Verify latest docs for all stack technologies
3. **mcp__context7__query-docs** - Check integration compatibility

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Starting a new Next.js 16 project from scratch
- Need the complete recommended technology stack
- Building production applications with authentication
- Implementing forms, state management, and UI components
- Understanding how all parts fit together

### Technology Stack

| Layer | Technology | Skill Reference |
|-------|------------|-----------------|
| Framework | Next.js 16 (App Router) | `nextjs-16` |
| Database ORM | Prisma 7 | `prisma-7` |
| Authentication | Better Auth 1.2 | `better-auth` |
| UI Components | shadcn/ui 3.8.0 | `nextjs-shadcn` |
| Forms | TanStack Form | `nextjs-tanstack-form` |
| State | Zustand | `nextjs-zustand` |
| Styling | Tailwind CSS 4 | `tailwindcss` |
| i18n | next-intl 4.0 | `nextjs-i18n` |

---

## Forbidden Patterns

- **NextAuth.js** - Use Better Auth instead
- **Pages Router** - Use App Router for new projects
- **React Hook Form** - Use TanStack Form
- **Client Components by default** - Server Components first

---

## References

Detailed guidance lives in `references/` to keep this file scannable — load only what the task needs:

| File | Load when… |
|------|------------|
| [references/stack-decisions.md](references/stack-decisions.md) | Justifying a technology choice (Better Auth vs NextAuth, Prisma vs Drizzle, TanStack Form vs RHF, Zustand vs Redux, shadcn/ui vs MUI) |
| [references/solid-architecture.md](references/solid-architecture.md) | Setting up or reviewing the project's module/folder structure |
| [references/integration-points.md](references/integration-points.md) | Wiring two parts of the stack together (auth+DB, forms+UI, state+RSC, i18n+routing) |
| [references/quick-reference.md](references/quick-reference.md) | Looking up which sub-skill file covers a specific feature (App Router, Prisma schema, Better Auth OAuth, …) |
| [references/best-practices.md](references/best-practices.md) | Doing a final review pass before shipping |
| [references/getting-started.md](references/getting-started.md) | Bootstrapping a brand-new project step by step |

For framework-specific detail, go directly to the sub-skill: `nextjs-16`, `prisma-7`, `better-auth`, `nextjs-shadcn`, `nextjs-tanstack-form`, `nextjs-zustand`, `nextjs-i18n`, `solid-nextjs`.
