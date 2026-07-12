---
name: 00-init-branch
description: Create feature branch for design work
prev_step: null
next_step: references/design/01-analyze-design.md
---

# 00 - Init Branch (Design)

**Create a properly named branch before starting design work.**

## Branch Naming

```bash
# Feature design
git checkout -b design/TICKET-123-hero-section

# Redesign
git checkout -b design/TICKET-456-redesign-dashboard

# Component
git checkout -b design/TICKET-789-new-button-variants
```

## Naming Convention

```text
design/[TICKET]-[short-description]

Examples:
- design/UI-001-landing-page
- design/UI-002-dark-mode
- design/FEAT-123-pricing-cards
```

## Pre-flight Checklist

```text
[ ] On latest develop/main
[ ] Branch created with design/ prefix
[ ] Ticket/task ID included
[ ] Description is clear and short
```

## Commands

```bash
# Ensure latest
git checkout develop && git pull

# Create branch
git checkout -b design/UI-001-hero-section

# Verify
git branch --show-current
```

---

## Next Phase

-> Proceed to `01-analyze-design.md`
