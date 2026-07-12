# Gemini Design MCP — Optional Path Quick Reference

**Direct HTML/CSS generation is the default and the primary path** (see
`skills/design-method/SKILL.md`). Gemini Design MCP is an optional tool of convenience —
useful for a fast first draft or a second opinion, never a requirement. Full workflow
detail lives in `skills/design-web/references/gemini/` — this file is a quick reference
only.

## Tools

| Tool | Usage |
|------|-------|
| `create_frontend` | Complete responsive views from scratch |
| `modify_frontend` | Surgical redesign (margins, colors, layout) |
| `snippet_frontend` | Isolated components to insert in existing files |

## Workflow (if choosing this path)

```
1. Check if design-system.md exists at project root.
   IF NOT EXISTS: run skills/design-system/SKILL.md first — do not call
   create_frontend without design-system.md.
2. Pass the ENTIRE design-system.md content in the designSystem parameter.
```

## Effective Prompts

```
❌ BAD: "Create a pricing page"
✅ GOOD: "Create a pricing page with 3 tiers (Basic $9, Pro $29, Enterprise),
          highlighted Pro tier with accent border, feature comparison table,
          monthly/yearly toggle, responsive grid"
```

## Failure Handling

If Gemini Design MCP is unavailable or the output is degraded, fall back to direct
HTML/CSS generation — this is a routing choice, not a blocked state.

## Verify Result

> Full bounded review procedure (per-section + fullPage, max 2 fix cycles): see
> `skills/design-review/SKILL.md`. Quick check regardless of generation path — always
> preview in BOTH light and dark mode via the `colorScheme` parameter, never a manual
> `.dark` class toggle:

```
sid = mcp__fuse-browser__browser_open()          # once
mcp__fuse-browser__browser_navigate(sid, "http://localhost:8899/page")
mcp__fuse-browser__browser_screenshot(sid, colorScheme="light")
mcp__fuse-browser__browser_screenshot(sid, colorScheme="dark")
```
