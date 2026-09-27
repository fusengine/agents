---
name: shadcn-migration
description: "Use when migrating a shadcn/ui project between Radix UI and Base UI primitives, or validating a migration's API transformations."
versions:
  shadcn-ui: "4.x"
  radix-ui: "1.x"
  base-ui: "1.x"
user-invocable: true
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task
references: references/radix-to-baseui.md, references/baseui-to-radix.md, references/templates/migration-dialog.md
related-skills: shadcn-detection, shadcn-components
---

<objective>
A step-by-step migration guide between Radix UI and Base UI primitives for shadcn/ui (React Aria, the third base, has no documented migration path), plus the CLI migrations (`migrate radix|cn|rtl|icons|base-color`): pre-migration checklist (detection, backup branch, component inventory), migration order (leaf components first — Tooltip/Switch/Checkbox, then Accordion/Tabs, then Dialog/Select/Popover/Menu), the API transformation table (`asChild`→`render`, `DialogContent`→`Dialog.Popup`, `data-state`→`data-[open]`, etc.), and a post-migration validation checklist.
</objective>

# shadcn Migration

## Agent Workflow (MANDATORY)

Before migration, spawn agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Inventory all affected components
2. **fuse-ai-pilot:research-expert** - Verify migration patterns via Context7

After: Run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Radix -> Base UI** | Optional: Base UI is the default for new projects since July 2026; Radix is NOT deprecated |
| **Base UI -> Radix** | Migrate to the Radix base (still fully supported) |
| **React Aria** | Third base (`aria-*`, July 2026); no documented migration path to or from it; "existing projects stay on their current base" |
| **API mapping** | Complete transformation table |
| **Validation** | Post-migration checklist |

### Official migration tooling

| Need | Command / tool | Source |
|------|----------------|--------|
| Radix -> Base UI, per component | `npx skills add shadcn/ui`, then ask the agent "migrate accordion to base-ui" (progressive, one commit per component, report in `.migration/<component>.md`) | changelog 2026-07-base-ui-default |
| `@radix-ui/react-*` -> unified `radix-ui` | `{runner} shadcn@latest migrate radix [path]` | /docs/cli#migrate-radix |
| `clsx` + `tailwind-merge` -> `cn` package | `{runner} shadcn@latest migrate cn [path]` (merge engine targets Tailwind v4 like `tailwind-merge` v3; on Tailwind v3 keep `tailwind-merge` v2, a `clsx`-only migration is safe; no `components.json` needed) | /docs/cli#migrate-cn |
| Physical -> logical classes (RTL) | `{runner} shadcn@latest migrate rtl [path]` | /docs/cli#migrate-rtl |
| Icon library swap | `{runner} shadcn@latest migrate icons --from lucide --to phosphor` | /docs/cli#migrate-icons |
| Base color swap | `{runner} shadcn@latest migrate base-color --to zinc` | /docs/cli#migrate-base-color |
| Keep Radix in non-interactive CI init | `{runner} shadcn@latest init -b radix` (default base is now `base`) | changelog 2026-07-base-ui-default |

`{runner} shadcn@latest migrate --list` prints the available migrations (CLI 4.21.0: cn, icons, base-color, radix, rtl).

## Critical Rules

1. **ALWAYS run detection** before starting migration
2. **ALWAYS create backup** branch before migration
3. **MIGRATE one component** type at a time
4. **UPDATE CSS selectors** along with JSX changes
5. **RUN tests** after each component migration

## Architecture

```
Migration order (leaf components first):
1. Tooltip, Switch, Checkbox (simple)
2. Accordion, Tabs (medium)
3. Dialog, Select, Popover, Menu (complex)
```

-> See [migration-dialog.md](references/templates/migration-dialog.md) for complete example

---

## Pre-Migration Checklist

```
[ ] Run shadcn-detection to confirm current primitive
[ ] Create backup branch (git checkout -b pre-migration)
[ ] Inventory all affected files (Grep for imports)
[ ] Review component-specific API changes
[ ] Plan migration order (leaf components first)
```

---

## Migration Workflow

```
1. DETECT  -> Run shadcn-detection skill
2. BACKUP  -> Create git branch
3. INVENTORY -> List all affected components
4. TRANSFORM -> Apply API changes per component
5. VALIDATE -> Run tests + sniper check
```

---

## Key API Changes

| Aspect | Radix | Base UI |
|--------|-------|---------|
| Composition | `asChild` | `render` prop |
| Dialog content (primitive) | `Dialog.Content` | `Dialog.Popup` (shadcn wrapper keeps `DialogContent`) |
| Dialog overlay (primitive) | `Dialog.Overlay` | `Dialog.Backdrop` (wrapper keeps `DialogOverlay`) |
| Positioning | Built-in | Separate `Positioner` |
| Accordion body (primitive) | `Accordion.Content` | `Accordion.Panel` (wrapper keeps `AccordionContent`) |
| Accordion single/multi | `type="single" collapsible` / `type="multiple"` | `defaultValue={[...]}` / `multiple` |
| Raw data attrs | `data-state="open"` | `data-open` (Tailwind `data-open:` variant matches both) |
| Package | `radix-ui` (or legacy `@radix-ui/react-*`) | Single `@base-ui/react` |
| components.json style | `radix-*` (legacy `new-york`) | `base-*` |

---

## Best Practices

### DO
- Migrate one component type at a time
- Run tests after each component migration
- Update CSS selectors along with JSX
- Remove unused Radix packages after migration

### DON'T
- Migrate all components at once
- Skip detection step
- Leave mixed APIs in production
- Forget to update data-attribute CSS selectors

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Radix -> Base UI** | [radix-to-baseui.md](references/radix-to-baseui.md) | Migrating from Radix |
| **Base UI -> Radix** | [baseui-to-radix.md](references/baseui-to-radix.md) | Migrating to Radix |

### Templates

| Template | When to Use |
|----------|-------------|
| [migration-dialog.md](references/templates/migration-dialog.md) | Complete migration example |
