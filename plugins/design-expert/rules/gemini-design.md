# Gemini Design MCP Rules

**NEVER write frontend/UI code yourself. ALWAYS use Gemini Design MCP.**

## Tools

| Tool | Usage |
|------|-------|
| `create_frontend` | Complete responsive views from scratch |
| `modify_frontend` | Surgical redesign (margins, colors, layout) |
| `snippet_frontend` | Isolated components to insert in existing files |

## Workflow (New Project)

```
1. Check if design-system.md exists at project root

2. IF NOT EXISTS:
   a. Ask user for scale: refined | balanced | zoomed
   b. Generate 5 vibes (call create_frontend 5 times)
   c. User picks a vibe
   d. Save chosen code to design-system.md

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

After generating, always preview:

```
mcp__playwright__browser_navigate("http://localhost:3000/page")
mcp__playwright__browser_take_screenshot()
```
