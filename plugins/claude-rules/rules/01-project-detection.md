## Project Detection -> Domain Agent

Scan: plugin agents (paths injected at SessionStart — never hardcode marketplace paths) + `~/.claude/agents/*.md`

| Project Indicator | Agent |
|-------------------|-------|
| `next.config.*`, `app/layout.tsx` | `fuse-nextjs:nextjs-expert` |
| `astro.config.*`, `src/pages/*.astro` | `fuse-astro:astro-expert` |
| `composer.json` + `artisan` | `fuse-laravel:laravel-expert` |
| `composer.json` WITHOUT artisan file | `fuse-php:php-expert` |
| `@tanstack/react-start` in package.json, `tanstackStart()` in vite.config.* | `fuse-tanstack-start:tanstack-start-expert` |
| `package.json` + React | `fuse-react:react-expert` |
| `tsconfig.json` with NO framework config (no next/astro/vite-react/tanstackStart) | `fuse-typescript:typescript-expert` |
| `Package.swift`, `*.xcodeproj` | `fuse-swift-apple-expert:swift-expert` |
| `Cargo.toml` | `fuse-rust:rust-expert` |
| `go.mod` | `fuse-go:go-expert` |
| `tailwind.config.*` | `fuse-tailwindcss:tailwindcss-expert` |
| `components.json`, `@radix-ui/*` | `fuse-shadcn-ui:shadcn-ui-expert` |
| Custom `~/.claude/agents/*.md` | Use matching custom agent |
| **No match** | `general-purpose` |

Priority: Custom > Framework (Next.js > Astro > Laravel > TanStack Start > React) > Language (TypeScript, PHP, Swift, Rust, Go) > UI library > `general-purpose`
**FORBIDDEN:** `general-purpose` when domain agent exists.
