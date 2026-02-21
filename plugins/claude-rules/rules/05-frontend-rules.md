---
description: "Step 5/6 - ALWAYS use fuse-design:design-expert for UI. Gemini Design MCP: create_frontend, modify_frontend, snippet_frontend. FORBIDDEN: manual CSS/Tailwind, React components without design tool."
next_step: "06-tooling-rules"
---

## Frontend Tasks (MANDATORY)

**ALWAYS use `fuse-design:design-expert`** -> calls Gemini Design MCP automatically.
NEVER write UI code manually.

| Tool | Usage |
|------|-------|
| `create_frontend` | Complete responsive views from scratch |
| `modify_frontend` | Surgical redesign (margins, colors, layout) |
| `snippet_frontend` | Isolated components (modals, charts, tables) |
| `generate_vibes` | Generate design system options |

### Decision flow:
1. UI task detected -> spawn `fuse-design:design-expert`
2. Design expert selects Gemini Design tool based on scope
3. Generated code uses shadcn/ui + Tailwind CSS
4. Expert validates accessibility + responsive behavior

**FORBIDDEN without Gemini Design:**
- Creating React/SwiftUI components with styling
- Writing CSS/Tailwind manually for UI layouts
- Building forms, modals, tables without design tool

**ALLOWED without Gemini:**
- Text/copy changes only
- JavaScript/Swift logic without UI changes
- Data wiring (useQuery, useMutation, @Observable)
- State management updates (Zustand, Context)

**Next -> Step 6: Tooling** (`06-tooling-rules.md`)
