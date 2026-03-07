---
name: design-audit
description: Use when auditing an existing project's design quality. Covers visual consistency, accessibility compliance, anti-AI-slop detection, and design system adherence.
versions:
  tailwindcss: "4.1"
  shadcn-ui: "2.x"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Task
references: references/audit-checklist.md, references/consistency-checks.md, references/anti-ai-slop-audit.md
related-skills: identity-system, validating-accessibility, palette-generator
---

# Design Audit

## Agent Workflow (MANDATORY)

Before ANY audit, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Scan all CSS, Tailwind classes, design tokens
2. **fuse-ai-pilot:research-expert** - Verify latest WCAG and design standards
3. **design-expert:identity-system** - Compare against design-system.md

After audit, generate a report with findings and recommendations.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Audit Checklist** | Systematic review of typography, colors, spacing, motion |
| **Consistency Checks** | Cross-component visual consistency validation |
| **Anti-AI-Slop** | Detection flags for generic AI-generated designs |

---

## Critical Rules

1. **Read design-system.md first** - Audit against the defined identity
2. **Check every page** - Not just individual components
3. **Test responsive** - Audit at mobile, tablet, and desktop
4. **Test dark mode** - Verify both themes
5. **Quantify findings** - Use specific values, not vague descriptions

---

## Audit Process

```
1. Load design-system.md -> establish baseline
2. Scan all CSS/Tailwind for token usage -> identify hard-coded values
3. Run consistency checks -> compare similar components
4. Run anti-AI-slop audit -> detect generic patterns
5. Test accessibility -> contrast, focus, touch targets
6. Generate report -> categorized findings with severity
```

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Checklist** | [audit-checklist.md](references/audit-checklist.md) | Full audit procedure |
| **Consistency** | [consistency-checks.md](references/consistency-checks.md) | Cross-component checks |
| **Anti-AI-Slop** | [anti-ai-slop-audit.md](references/anti-ai-slop-audit.md) | Detecting generic design |

---

## Quick Reference

### Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| Critical | Accessibility failure, broken layout | Fix immediately |
| Major | Inconsistency, wrong tokens, AI slop | Fix in current sprint |
| Minor | Cosmetic, nice-to-have improvements | Backlog |

### Report Format

```markdown
## Design Audit Report

### Summary
- Critical: X issues
- Major: X issues
- Minor: X issues

### Findings

#### [Critical] Contrast ratio failure
- **Location**: components/Button.tsx
- **Issue**: Text contrast 2.8:1 (needs 4.5:1)
- **Fix**: Change foreground to oklch(15% 0.01 0)
```

---

## Validation Checklist

- [ ] design-system.md exists and is followed
- [ ] No hard-coded hex/HSL colors in components
- [ ] Font families match design system specification
- [ ] Spacing uses consistent base unit multiples
- [ ] Border radius is consistent across similar components
- [ ] WCAG AA contrast ratios pass everywhere
- [ ] Focus indicators present on all interactive elements
- [ ] Dark mode tokens are properly defined
- [ ] Anti-AI-slop checks pass

---

## Best Practices

### DO
- Audit against design-system.md, not personal preference
- Use Grep to find hard-coded values systematically
- Test at all responsive breakpoints
- Provide specific fix recommendations
- Quantify issues with exact values

### DON'T
- Make subjective judgments without design-system.md baseline
- Skip mobile or dark mode testing
- Report issues without fix suggestions
- Audit components in isolation (check full pages)
- Ignore anti-AI-slop checks
