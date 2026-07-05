---
name: 07-review-design
description: Self-review design coherence with elicitation
prev_step: references/design/06-validate-a11y.md
next_step: references/design/08-sniper-check.md
---

# 07 - Review Design (Elicitation)

**Self-review using elicitation techniques before sniper validation.**

## When to Use

- After accessibility validation (06-validate-a11y)
- Before sniper code check
- For design coherence verification

---

## Elicitation Questions

### Design Coherence

```text
1. Does this component match the existing design system?
   - Colors: Same palette as Phase 01 analysis?
   - Typography: Same fonts and scale?
   - Spacing: Same gaps and padding patterns?

2. Is the visual hierarchy clear?
   - Primary action obvious?
   - Secondary elements appropriately subtle?

3. Does it feel like the same app?
   - Would a user notice inconsistency?
```

### Anti-AI Slop Check

```text
[ ] Typography: NOT Inter/Roboto/Arial
[ ] Colors: NO purple/pink gradients
[ ] Cards: NO cookie-cutter 3-column grids
[ ] Indicators: NO border-left colors
[ ] Backgrounds: NOT flat white/gray
[ ] Hover: ALL interactive elements have feedback
```

---

## Visual Comparison

### Side-by-Side Check

```text
1. Open existing component from codebase
2. Compare with new component
3. Check:
   - Same border-radius
   - Same shadow depth
   - Same hover behavior
   - Same spacing rhythm
```

### Screenshot Test

```text
1. Render new component
2. Place next to existing UI
3. Squint test: Does it belong?
```

---

## Design Token Audit

### Verify Token Usage

```tsx
// Check component uses tokens from Phase 01

// ✅ GOOD - Uses design tokens
className="bg-primary text-primary-foreground rounded-lg"

// ❌ BAD - Hardcoded values
className="bg-blue-600 text-white rounded-[10px]"
```

### Token Checklist

```text
[ ] Colors from CSS variables or Tailwind config
[ ] Fonts from font-display, font-sans, font-mono
[ ] Spacing from standard scale (4, 6, 8, 12, 16, 24)
[ ] Border-radius from standard (lg, xl, 2xl)
[ ] Shadows from standard (sm, md, lg)
```

---

## Motion Audit

### Animation Consistency

```text
[ ] Same duration as existing (0.2s - 0.3s)
[ ] Same easing as existing (ease-out)
[ ] Same hover lift as existing (y: -4)
[ ] Same stagger delay as existing (0.1s)
```

---

## Self-Correction

### If Inconsistencies Found

```text
1. Document the inconsistency
2. Identify correct token/pattern
3. Fix before proceeding to sniper
4. Re-run review checklist
```

---

## Validation Checklist

```text
[ ] Design coherence verified
[ ] Anti-AI slop check passed
[ ] Visual comparison done
[ ] All design tokens used correctly
[ ] Animation patterns match existing
[ ] Self-corrections applied
```

---

## Next Phase

-> Proceed to `08-sniper-check.md`
