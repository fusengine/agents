# Gemini Design MCP Rules

**NEVER write frontend/UI code yourself. ALWAYS use Gemini Design MCP.**

## Tools

| Tool | Usage |
|------|-------|
| `create_frontend` | Complete responsive views from scratch |
| `modify_frontend` | Surgical redesign (margins, colors, layout) |
| `snippet_frontend` | Isolated components to insert in existing files |

## Workflow (design-system.md)

> See `agents/design-expert.md` Phase 2 for the full mapping table (design-system.md → Gemini XML).

```
1. Check if design-system.md exists at project root

2. IF NOT EXISTS:
   Run identity-system skill first (Phase 0→1→2 from agent pipeline).
   NEVER call create_frontend without design-system.md.

3. IF EXISTS:
   Pass ENTIRE content in designSystem parameter
```

## FORBIDDEN without Gemini Design

- Creating React components with styling
- Writing CSS/Tailwind manually for UI
- Using existing styles as excuse to skip Gemini

## ALLOWED without Gemini

- Text/copy changes only
- JavaScript logic without UI changes
- Data wiring (useQuery, useMutation)

## Effective Prompts

```
❌ BAD: "Create a pricing page"
✅ GOOD: "Create a pricing page with 3 tiers (Basic $9, Pro $29, Enterprise),
          highlighted Pro tier with accent border, feature comparison table,
          monthly/yearly toggle, responsive grid"
```

## Verify Result with Playwright

> See `agents/design-expert.md` Phase 6 for full light+dark validation procedure.

After generating, always preview in BOTH light and dark mode (ZERO TOLERANCE):

```
mcp__playwright__browser_navigate("http://localhost:3000/page")
mcp__playwright__browser_take_screenshot()  # light mode
# Toggle dark mode (via class or media query override)
mcp__playwright__browser_take_screenshot()  # dark mode
```
