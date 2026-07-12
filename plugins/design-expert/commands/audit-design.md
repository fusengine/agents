---
name: design-audit
description: "Audit an existing HTML/CSS design. Deterministic checks only (contrast, fonts, colors, states, dark mode) plus a visual pass. No generation."
---

# /design:audit — Design Quality Audit

Validate an existing design without generating new code.

**Complete documentation**: `skills/design-review/SKILL.md`.

## Usage

```
/design:audit ./pages/index.html
/design:audit ./site-1/
/design:audit
```

When no path is provided, audits all HTML files in the current directory.

## Workflow

1. Identify target files (path argument, or all `.html` in the current directory).
2. Read `design-system.md` if it exists — the reference for token compliance. If missing, audit against `skills/design-system/references/typography-pairs.md` (forbidden fonts) and `contrast-ratios.md` (contrast) only.
3. Run `skills/design-review/SKILL.md` Part 1 (deterministic checks): contrast, forbidden fonts, color format, em-dash, token adherence, anti-AI-slop, mechanical pre-flight, WCAG, consistency.
4. Run Part 2 (bounded visual review): serve, screenshot light+dark, cross-viewport, motion verdict if any animation exists.
5. Report with severity levels: **CRITICAL** (contrast, missing dark mode, broken accessibility), **MAJOR** (forbidden fonts, non-OKLCH colors, missing states), **MINOR** (token mismatches), **PASS**.

## Output Format

```
| Check     | Status   | Details                                |
|-----------|----------|----------------------------------------|
| Fonts     | FAIL     | Found Inter in header.css:12           |
| Colors    | WARN     | 3 hex values found, convert to oklch() |
| Contrast  | PASS     | All ratios >= 4.5:1                    |
| States    | WARN     | Missing :focus on .btn-secondary       |
| Dark mode | FAIL     | No dark mode implementation found      |
```

## Forbidden
Generating or modifying code (audit only, unless the user explicitly asks for fixes afterward). Skipping any deterministic check. Reporting PASS without actually verifying. Skipping the light+dark screenshot pass.
