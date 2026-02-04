# APEX Workflow for Design Expert

## Workflow Steps

| Phase | Step | Action |
|-------|------|--------|
| **A** | 00-load-skills | Read required skills FIRST |
| **A** | 01-analyze-design | `explore-codebase` → design tokens + PROJECT STRUCTURE |
| **A** | 02-search-inspiration | 21st.dev + shadcn search |
| **P** | 03-plan-component | TodoWrite + file planning (<100 lines) |
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

## Step 08: Preview with Playwright

After generating UI, verify visually:

```
1. mcp__playwright__browser_navigate → http://localhost:3000
2. mcp__playwright__browser_snapshot → capture current state
3. mcp__playwright__browser_take_screenshot → save for PR
```
