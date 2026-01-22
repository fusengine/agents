---
name: 03-plan-component
description: Plan component implementation with TodoWrite
prev_step: references/design/02-search-inspiration.md
next_step: references/design/04-code-component.md
---

# 03 - Plan Component (APEX Phase P)

**Plan implementation using TodoWrite before coding.**

## When to Use

- After finding inspiration (02-search-inspiration)
- Before writing ANY code
- For multi-file components

---

## TodoWrite Structure

### Example: Hero Section

```text
TodoWrite:
1. [ ] Create HeroSection component shell
2. [ ] Add typography (heading, subheading)
3. [ ] Implement background (gradient orbs)
4. [ ] Add CTA buttons
5. [ ] Implement Framer Motion animations
6. [ ] Add responsive styles
7. [ ] Validate accessibility
```

### Example: Card Component

```text
TodoWrite:
1. [ ] Create Card base component
2. [ ] Add CardHeader, CardContent, CardFooter
3. [ ] Implement hover animation
4. [ ] Add glassmorphism styles
5. [ ] Export from index
6. [ ] Add JSDoc documentation
```

---

## File Planning

### Estimate Line Counts

```text
Component plan:
- HeroSection.tsx: ~60 lines (under 100 ✓)
- HeroBackground.tsx: ~30 lines (if split needed)
- hero-animations.ts: ~20 lines (animation variants)
```

### Split Strategy

```text
If component > 90 lines:
1. Extract sub-components
2. Extract animation variants
3. Extract utility functions
4. Create types file if needed
```

---

## Design Specification

### Document Before Coding

```markdown
## Component: HeroSection

### Design Tokens (from Phase 01)
- Background: bg-gradient-to-b from-background to-muted
- Heading: font-display text-5xl font-bold
- Body: font-sans text-lg text-muted-foreground
- CTA Primary: bg-primary text-primary-foreground
- CTA Secondary: bg-secondary text-secondary-foreground

### Spacing
- Section padding: py-24
- Content gap: gap-6
- Button gap: gap-4

### Animation
- Stagger children: 0.1s delay
- Fade up: y: 20 -> 0, opacity: 0 -> 1
```

---

## Validation Checklist

```text
[ ] TodoWrite created
[ ] Tasks are atomic
[ ] File sizes estimated (< 100 lines each)
[ ] Design tokens documented
[ ] Animation plan defined
[ ] Split strategy ready if needed
```

---

## Next Phase

-> Proceed to `04-code-component.md`
