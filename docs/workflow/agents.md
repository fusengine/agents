# Agents

18 specialized agents across all plugins.

## Core Agents (fuse-ai-pilot)

| Agent | Description |
|-------|-------------|
| `sniper` | 7-phase code validation, DRY detection, zero linter errors |
| `sniper-faster` | Quick validation, minimal output |
| `explore-codebase` | Architecture discovery, patterns |
| `research-expert` | Documentation with Context7/Exa |
| `websearch` | Quick web research |
| `seo-expert` | SEO/SEA/GEO optimization |

## Framework Experts

| Agent | Plugin | Description |
|-------|--------|-------------|
| `nextjs-expert` | fuse-nextjs | Next.js 16+, App Router, Prisma 7 |
| `laravel-expert` | fuse-laravel | Laravel 12+, Livewire, Eloquent |
| `react-expert` | fuse-react | React 19, hooks, TanStack |
| `swift-expert` | fuse-swift-apple-expert | Swift/SwiftUI, all Apple platforms |
| `tailwindcss-expert` | fuse-tailwindcss | Tailwind CSS v4.1 |
| `design-expert` | fuse-design | UI/UX, shadcn/ui, 21st.dev |
| `shadcn-ui-expert` | fuse-shadcn-ui | shadcn/ui, Radix/Base UI detection |
| `prompt-engineer` | fuse-prompt-engineer | Prompt creation & optimization |
| `security-expert` | fuse-security | OWASP Top 10, CVE research, dependency audit |

## Monitoring Agents

| Agent | Plugin | Description |
|-------|--------|-------------|
| `changelog-watcher` | fuse-changelog | Claude Code update tracking, breaking changes, community pulse |

## Utility Agents

| Agent | Plugin | Description |
|-------|--------|-------------|
| `commit-detector` | fuse-commit-pro | Detect optimal commit type |
| `solid-orchestrator` | fuse-solid | SOLID validation across languages |

## Agent Teams

Agents can work in parallel via `TeamCreate` with separate context windows. The lead delegates tasks with exclusive file ownership per teammate.

See [Agent Teams](agent-teams.md) for delegation rules, anti-patterns, and examples.

## Usage

Agents are launched automatically based on project detection, or manually:

```
User: "Use nextjs-expert to fix the routing"
```

Or via Task tool:
```typescript
Task({
  subagent_type: "fuse-nextjs:nextjs-expert",
  prompt: "Fix the routing issue"
})
```
