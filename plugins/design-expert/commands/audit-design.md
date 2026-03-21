---
name: design:audit
description: "Audit existing HTML/CSS design quality. Checks WCAG contrast, font compliance, OKLCH tokens, state coverage, anti-AI-slop. No generation — validation only."
---

# /design:audit — Design Quality Audit (Phases 5→6)

Validate an existing design without generating new code.

## Usage

```
/design:audit ./pages/index.html
/design:audit ./site-1/
/design:audit
```

When no path is provided, audits all HTML files in the current directory.

## Workflow

1. **Identify target files**: If a path is provided, audit that file or directory. Otherwise, find all `.html` files in the current directory.

2. **Read design-system.md** if it exists at project root. This is the reference for token compliance. If missing, audit against general best practices only.

3. **Phase 5 — AUDIT**: For each HTML file, run these checks:

   a. **Fonts**: Grep for `font-family` declarations. Flag any Inter, Roboto, Arial, Open Sans, Lato, Poppins. Verify fonts match design-system.md if it exists.

   b. **Colors**: Grep for hex (`#fff`, `#000000`), `rgb()`, `hsl()` values. All colors should be `oklch()`. Flag non-OKLCH colors.

   c. **Contrast**: Check text/background color combinations. Verify >= 4.5:1 for text, >= 3:1 for UI elements (borders, icons, focus rings).

   d. **States**: Check for `:hover`, `:focus`, `:disabled`, `[aria-disabled]` styles. Flag missing interactive states.

   e. **Dark mode**: Check for `.dark` class, `[data-theme="dark"]`, or `prefers-color-scheme` media query. Flag if missing entirely.

   f. **Anti-AI-slop**: Check for border-top/left/bottom indicators (should use icon+bg), purple-pink gradients, emojis in UI text, generic placeholder text ("Lorem ipsum" in production).

   g. **Tokens**: If design-system.md exists, verify CSS custom properties match defined tokens. Flag orphaned or undefined variables.

4. **Phase 6 — REVIEW**: Serve files via `python3 -m http.server 8899`. Screenshot light mode, toggle `.dark` class, screenshot dark mode. Visual inspection for quality.

5. **Report**: Generate a structured audit report with severity levels:
   - **CRITICAL**: Must fix — contrast failures, missing dark mode, broken accessibility
   - **MAJOR**: Should fix — forbidden fonts, non-OKLCH colors, missing states
   - **MINOR**: Suggestions — token mismatches, minor inconsistencies
   - **PASS**: Checks that passed successfully

## Output Format

```
| Check     | Status   | Details                                |
|-----------|----------|----------------------------------------|
| Fonts     | FAIL     | Found Inter in header.css:12           |
| Colors    | WARN     | 3 hex values found, convert to oklch() |
| Contrast  | PASS     | All ratios >= 4.5:1                    |
| States    | WARN     | Missing :focus on .btn-secondary       |
| Dark mode | FAIL     | No dark mode implementation found      |
| AI-slop   | PASS     | No forbidden patterns detected         |
| Tokens    | PASS     | All variables match design-system.md   |
```

## FORBIDDEN

- Generating or modifying any code (this is audit only)
- Skipping any of the 7 checks in Phase 5
- Reporting PASS without actually verifying
- Skipping light+dark mode screenshots
- Inter, Roboto, Arial, Open Sans, Lato, Poppins marked as acceptable
- Hex, RGB, or HSL colors marked as acceptable
