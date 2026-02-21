---
description: "APEX workflow shadcn/ui expert - 8 phases mandatory: load skills, detect primitive (Radix UI vs Base UI), analyze components, plan tasks (<100 lines), consult MCP (shadcn + Context7), implement with correct API, self-review via elicitation, sniper validation. NEVER skip detection. NEVER mix Radix/Base UI."
next_step: "shadcn-rules"
---

# APEX Workflow for shadcn/ui Expert

## Workflow Steps

| Phase | Step | Action |
|-------|------|--------|
| **A** | 00-load-skills | Read required shadcn skills FIRST |
| **A** | 01-detect-primitive | Run detection (Radix vs Base UI) |
| **A** | 02-analyze-components | `explore-codebase` → component inventory |
| **P** | 03-plan-changes | TaskCreate + file planning (<100 lines) |
| **E** | 04-consult-mcp | ALWAYS query shadcn MCP + Context7 |
| **E** | 05-implement | Apply changes based on detected primitive |
| **E** | 06-validate-patterns | Verify correct API for detected primitive |
| **L** | 07-self-review | Elicitation self-review |
| **X** | 08-sniper-check | **MANDATORY: Launch `sniper` agent** |

## Step 00: Load Skills (BEFORE any code)

```
Read skills/shadcn-detection/SKILL.md     → primitive detection
Read skills/shadcn-components/SKILL.md    → component patterns
Read skills/shadcn-registries/SKILL.md    → registry config
Read skills/shadcn-theming/SKILL.md       → design tokens
Read skills/shadcn-migration/SKILL.md     → migration guide
```

## Step 01: Detect Primitive (MANDATORY)

```
1. Run detect-primitive-lib.sh or manual detection
2. Result: Radix / Base UI / Mixed / None
3. If Mixed → consult shadcn-migration skill
4. If None → recommend fresh setup
```

## Step 02: Analyze (MUST identify)

```
1. Existing components using shadcn/ui
2. Import patterns and naming conventions
3. CSS selectors using data attributes
4. components.json configuration
```

## Step 04: Consult MCP (MANDATORY)

```
mcp__shadcn__search_items_in_registries → find components
mcp__shadcn__view_items_in_registries   → view source code
mcp__shadcn__get_add_command_for_items  → get CLI command
mcp__context7__query-docs               → latest documentation
```
