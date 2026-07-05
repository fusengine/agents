---
name: 09-create-pr
description: Create Pull Request with design documentation
prev_step: references/design/08-sniper-check.md
next_step: null
---

# 09 - Create PR (Design)

**Create PR with visual documentation.**

## When to Use

- After sniper validation (08-sniper-check)
- When design work is complete
- Ready for review

---

## PR Template

```markdown
## Summary
Brief description of design changes (1-2 sentences).

## Design Changes
- Added HeroSection component with glassmorphism
- Implemented staggered fade-up animations
- Used existing design tokens (colors, typography)

## Design Coherence
- [x] Matches existing color palette
- [x] Uses same typography (font-display, font-sans)
- [x] Follows spacing patterns
- [x] Animations match existing patterns

## Anti-AI Slop Checklist
- [x] No Inter/Roboto/Arial
- [x] No purple gradients
- [x] No border-left indicators
- [x] Hover states on all interactive elements

## Accessibility
- [x] WCAG 2.2 AA compliant
- [x] Keyboard navigable
- [x] Proper ARIA labels
- [x] prefers-reduced-motion respected

## Screenshots
| Before | After |
|--------|-------|
| N/A | ![screenshot](url) |

## Test Plan
- [ ] Visual review on desktop
- [ ] Visual review on mobile
- [ ] Keyboard navigation test
- [ ] Screen reader test
```

---

## Creating PR

```bash
# Push branch
git push -u origin design/UI-001-hero-section

# Create PR
gh pr create \
  --title "design(hero): add hero section with animations" \
  --base develop \
  --assignee @me \
  --body "$(cat <<'EOF'
## Summary
Added new HeroSection component with glassmorphism and staggered animations.

## Design Coherence
- Uses existing color tokens
- Matches typography scale
- Follows animation patterns

## Screenshots
[Add screenshots here]
EOF
)"
```

---

## Title Convention

```text
design(scope): description

Examples:
- design(hero): add hero section with animations
- design(cards): update card hover effects
- design(theme): implement dark mode
- design(a11y): improve focus states
```

---

## Screenshots Guide

### What to Include

```text
1. Full component view
2. Hover state
3. Mobile responsive view
4. Dark mode (if applicable)
5. Before/After comparison (for redesigns)
```

### Tools

```bash
# macOS screenshot
Cmd + Shift + 4

# Browser DevTools
- Responsive mode for mobile
- Emulate color scheme for dark mode
```

---

## Review Request

### Tag Reviewers

```text
- Design lead (for visual approval)
- Frontend dev (for code review)
- A11y specialist (if available)
```

---

## Validation Checklist

```text
[ ] Branch pushed
[ ] PR created with template
[ ] Screenshots attached
[ ] Design coherence documented
[ ] A11y checklist completed
[ ] Reviewers assigned
```

---

## Post-Merge

```bash
# Switch back to develop
git checkout develop && git pull

# Delete local branch
git branch -d design/UI-001-hero-section
```

---

**Design workflow complete!**
