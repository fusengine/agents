# fuse-nextjs

Expert Next.js 16 development with App Router, Server Components, Prisma 7, Better Auth, TanStack Form, Zustand, and shadcn/ui.

## Agent

- **nextjs-expert** - Expert Next.js developer

## Skills

| Skill | Description |
|-------|-------------|
| solid-nextjs | SOLID principles for Next.js with modular architecture |
| nextjs-16 | App Router, Server Components, Server Actions, Caching |
| prisma-7 | Prisma ORM with Rust-free client, TypedSQL |
| better-auth | Authentication with sessions, OAuth, plugins |
| nextjs-tanstack-form | TanStack Form with Server Actions integration |
| nextjs-zustand | Zustand for Client Components with hydration |
| nextjs-shadcn | shadcn/ui with Field components |

## Architecture

```
app/
├── (auth)/
├── (dashboard)/
├── api/
└── layout.tsx
modules/
├── cores/
│   ├── shadcn/components/ui/
│   ├── lib/
│   ├── hooks/
│   └── stores/
└── [feature]/
    ├── components/
    └── src/
        ├── interfaces/
        ├── services/
        ├── hooks/
        └── stores/
```

## Installation

```bash
/plugin install fuse-nextjs
```

## Usage

The agent activates when working with Next.js projects (`next.config.*`, `app/layout.tsx`).
