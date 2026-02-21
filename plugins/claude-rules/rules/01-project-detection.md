---
description: "Step 1/6 - Scan marketplace plugins and custom agents, match project config files (next.config, composer.json, Package.swift, etc.) to domain expert agent. FORBIDDEN: general-purpose when domain agent exists."
next_step: "02-apex-workflow"
---

## Project Detection -> Domain Agent (MANDATORY BEFORE ANY Task/TeamCreate)

**STEP 0: Discover available agents THEN match to project.**

### 1. Scan available agents (Glob these paths):
- Marketplace: `~/.claude/plugins/marketplaces/fusengine-plugins/plugins/*/`
- Custom agents: `~/.claude/agents/*.md`

### 2. Match project config files to a discovered agent:

| Project Indicator | Agent to use (if found in scan) |
|-------------------|--------------------------------|
| `next.config.*`, `app/layout.tsx` | `fuse-nextjs:nextjs-expert` |
| `composer.json` + `artisan` | `fuse-laravel:laravel-expert` |
| `package.json` + React (jsx/tsx) | `fuse-react:react-expert` |
| `Package.swift`, `*.xcodeproj` | `fuse-swift-apple-expert:swift-expert` |
| `tailwind.config.*` | `fuse-tailwindcss:tailwindcss-expert` |
| `components.json`, `@radix-ui/*`, `@base-ui/react` | `fuse-shadcn-ui:shadcn-ui-expert` |
| Custom `~/.claude/agents/*.md` | Use matching custom agent |
| **No match** | `general-purpose` |

### 3. Priority order (if multiple match):
1. Custom agent (most specific)
2. Framework agent (Next.js > React, Laravel > PHP)
3. UI library agent (shadcn, Tailwind)
4. `general-purpose` (last resort)

**FORBIDDEN:** Using `subagent_type: "general-purpose"` when a domain agent was found.
**FORBIDDEN:** Skipping agent discovery and defaulting to `general-purpose`.

**Next -> Step 2: APEX Workflow** (`02-apex-workflow.md`)
