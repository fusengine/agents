## Frontend Tasks

### UI Workflow (MANDATORY: route through `fuse-design:design-expert`)
1. **`design-method` skill first** — 4-question brief, signature element, two-pass critique, anti-slop clusters, then routes to the target skill (web/webapp/ios/android)
2. **Direct HTML/CSS generation is the default and primary path** — same method as Anthropic's `frontend-design` skill (commit to a point of view, verify with tools not vibes)
3. **Gemini Design MCP, Magic/21st.dev, shadcn MCP are optional fallback tools, NEVER a requirement** — native direct generation is always the fallback if any is unavailable
4. **Mobile (iOS/Android)** — tokens + HTML device-framed mockup + handoff spec ONLY, NEVER SwiftUI/Compose code (implementation stays with `swift-expert` / the Android developer)

### Optional Tools (never required)

| Tool | Usage |
|------|-------|
| `create_frontend` / `modify_frontend` / `snippet_frontend` (Gemini) | Fast first draft or surgical redesign |
| `fuse-shadcn-ui:shadcn-ui-expert` | Component registry, installation, patterns (`nextjs-shadcn` / `react-shadcn`) when shadcn is actually used |

**FORBIDDEN:** raw JSX/Tailwind/SwiftUI/Compose styling that skips the design-expert brief + tokens + verification pass
**ALLOWED without design-expert:** text changes, JS/Swift logic, data wiring, state management
