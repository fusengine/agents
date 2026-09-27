---
name: shadcn-detection
description: "Use when determining which component base (Base UI, Radix UI or React Aria) a shadcn/ui project uses, before any component work or migration."
versions:
  shadcn-ui: "4.x"
  radix-ui: "1.x"
  base-ui: "1.x"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
references: references/radix-patterns.md, references/baseui-patterns.md, references/detection-algorithm.md, references/templates/detection-script.md
related-skills: shadcn-components, shadcn-migration
---

<objective>
Detects which of the three shadcn/ui component bases a project uses: Base UI (`base`, default for new projects since July 2026), Radix (`radix`, fully supported) or React Aria (`aria`, added July 2026). Authoritative signal first (`shadcn info --json` -> `config.base`), then a 5-signal weighted scan: package.json dependencies, components.json's style prefix, source import patterns, data-attribute conventions (`data-state` vs `data-open` vs `data-entering`), and the lockfile-detected package manager.

Produces a Base UI / Radix / React Aria / Mixed (migration needed) / None (fresh setup) verdict that gates every downstream shadcn component or migration task.
</objective>

# shadcn Detection

## Agent Workflow (MANDATORY)

Before detection, spawn agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Scan project structure
2. **fuse-ai-pilot:research-expert** - Verify latest primitive patterns

After: Use results to configure component workflow.

---

## Overview

| Feature | Description |
|---------|-------------|
| **CLI probe (authoritative)** | `{runner} shadcn@latest info --json` -> `.config.base` = `base` \| `radix` \| `aria` (plus `.config.style`, `.components`, `.links`) |
| **Package scan** | Detect `@base-ui/react`, `radix-ui` / `@radix-ui/*`, `react-aria-components` |
| **Config check** | Analyze components.json style prefix (`base-*`, `radix-*`/`new-york`, `aria-*`) |
| **Import analysis** | Scan source for import patterns |
| **Attribute scan** | `data-state=` (Radix) vs `data-open` (Base UI) vs `data-entering`/`data-placement` (React Aria) |
| **Package manager** | Detect bun/npm/pnpm/yarn via lockfile |

| Base | Package | Style prefix | Composition | Docs |
|------|---------|--------------|-------------|------|
| Base UI (default) | `@base-ui/react` | `base-*` | `render` prop | `/docs/components/base/<name>` |
| Radix | `radix-ui` (legacy `@radix-ui/react-*`) | `radix-*`, legacy `new-york` | `asChild` | `/docs/components/radix/<name>` |
| React Aria | `react-aria-components` | `aria-*` | Trigger wrapper (`DialogTrigger > Button + Dialog`), `slot`, `onPress` | `/docs/components/aria/<name>` |

Known cross-base dependencies (NOT a mixed project): `radix-*` Combobox imports `@base-ui/react` (Radix has no Combobox); Questionnaire and MessageScroller import `@shadcn/react` on every base; every current component imports `cn` from the `cn` package.

---

## Critical Rules

1. **ALWAYS run detection** before any component work
2. **CHECK all 5 signals** for maximum accuracy
3. **HANDLE mixed state** as migration case, never ignore
4. **CACHE result** for session duration, no re-detection needed
5. **DETECT package manager** via lockfile priority order

---

## Architecture

```
project/
├── package.json            # Step 1: deps scan
├── components.json         # Step 2: style field
├── bun.lock|bun.lockb|pnpm-lock.yaml|yarn.lock|package-lock.json  # Step 5: PM
└── src/|components/|app/   # Step 3-4: imports + attrs
```

→ See [detection-script.md](references/templates/detection-script.md) for complete example

---

## 5-Step Detection Algorithm

Step 0: if `components.json` exists, `{runner} shadcn@latest info --json` gives the base directly; the weighted scan below confirms it and catches mixed projects.

| Step | Signal | Weight |
|------|--------|--------|
| 1 | `package.json` deps (`@base-ui/react`, `radix-ui` / `@radix-ui/*`, `react-aria-components`) | 40% |
| 2 | `components.json` style prefix (`base-*`, `radix-*`/`new-york`, `aria-*`) | 20% |
| 3 | Import patterns in source files | 25% |
| 4 | Data attributes (`data-state=` / `data-open` / `data-entering`) | 15% |
| 5 | Package manager (lockfile → `bunx`/`npx`/`pnpm dlx`/`yarn dlx`) | - |

---

## Decision Table

Each base gets its own score (0-100).

| Scores | Result | Action |
|--------|--------|--------|
| Only Base UI >50 | **Base UI** | Use Base UI patterns (`render`) |
| Only Radix >50 | **Radix** | Use Radix patterns (`asChild`) |
| Only React Aria >50 | **React Aria** | Use React Aria patterns (trigger wrapper, `onPress`) |
| Two or more >0 (after discounting the known cross-base deps above) | **Mixed** | Migration needed |
| All 0 | **None** | Fresh setup: `init` defaults to Base UI; pass `-b radix` or `-b aria` to choose |

---

## Best Practices

### DO
- Run detection BEFORE any component work
- Check all 5 signals for accuracy
- Handle "mixed" state as migration case

### DON'T
- Assume Radix (or Base UI, the new default) without checking
- Skip components.json analysis
- Ignore data-attribute signals
- Count `@base-ui/react` from a Radix-style Combobox as a mixed project

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Radix Patterns** | [radix-patterns.md](references/radix-patterns.md) | Identifying Radix UI signals |
| **Base UI Patterns** | [baseui-patterns.md](references/baseui-patterns.md) | Identifying Base UI signals |
| **Algorithm** | [detection-algorithm.md](references/detection-algorithm.md) | Understanding scoring logic, React Aria signals |

### Templates

| Template | When to Use |
|----------|-------------|
| [detection-script.md](references/templates/detection-script.md) | Running detection on a project |
