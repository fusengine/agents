# APEX Workflow for Design Expert

## Workflow Steps

| Phase | Step | Action |
|-------|------|--------|
| **A** | 00-load-skills | Read required skills FIRST |
| **A** | 01-analyze-design | `explore-codebase` → design tokens + PROJECT STRUCTURE |
| **A** | 02-search-inspiration | 21st.dev + shadcn search |
| **P** | 03-plan-component | TaskCreate + file planning (<100 lines) |
| **E** | 04-code-component | Write React/Next.js component via Gemini |
| **E** | 05-add-motion | Framer Motion patterns |
| **E** | 06-validate-a11y | WCAG 2.2 AA checklist |
| **E** | 07-review-design | Elicitation self-review |
| **E** | 08-preview-browser | Playwright screenshot to verify result |
| **X** | 09-sniper-check | **MANDATORY: Launch `sniper` agent** |
| **X** | 10-create-pr | PR with screenshots |

## Step 00: Load Skills (BEFORE any code)

```
Read skills/generating-components/SKILL.md   → component creation
Read skills/designing-systems/SKILL.md       → design tokens
Read skills/validating-accessibility/SKILL.md → WCAG validation
Read skills/adding-animations/SKILL.md       → Framer Motion
```

## Step 01: Analyze (MUST identify)

```
1. Project structure: modules/ vs src/components/
2. Interfaces location: modules/*/interfaces/ vs src/interfaces/
3. EXISTING file to modify (Header.tsx, NOT HeaderRedesigned.tsx)
4. Design tokens: colors, typography, spacing
```

## Step 08: Preview BOTH Modes with Playwright (MANDATORY)

After generating UI, verify BOTH light and dark modes:

### Light Mode
```
1. mcp__playwright__browser_navigate → localhost URL
2. mcp__playwright__browser_evaluate → document.documentElement.classList.remove('dark')
3. mcp__playwright__browser_take_screenshot → screenshot-light.png
```

### Dark Mode
```
4. mcp__playwright__browser_evaluate → document.documentElement.classList.add('dark')
5. mcp__playwright__browser_take_screenshot → screenshot-dark.png
```

### Verify
- [ ] Colors match design-system.md in BOTH modes
- [ ] Text contrast readable in BOTH modes (4.5:1)
- [ ] Glass effects visible in BOTH modes
- [ ] Gradient orbs visible in BOTH modes
- [ ] No white-on-white (light) or invisible elements (dark)
- [ ] Fonts loaded correctly (NOT system fallback)
