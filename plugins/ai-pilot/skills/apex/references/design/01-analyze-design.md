---
name: 01-analyze-design
description: Analyze existing design system before making changes
prev_step: references/design/00-init-branch.md
next_step: references/design/02-search-inspiration.md
---

# 01 - Analyze Design (APEX Phase A)

**Understand existing design system before ANY design work. NEVER SKIP.**

## When to Use

- Before creating ANY new component
- Before redesigning existing UI
- Before adding new pages/sections

---

## Dual-Agent Analysis

### Launch in Parallel (ONE message)

```text
Agent 1: explore-codebase
Prompt: "Analyze UI design system: component structure, existing
UI patterns, Tailwind classes commonly used, animation patterns."

Agent 2: research-expert (if needed)
Prompt: "Research [specific pattern] best practices for React/Next.js"
```

---

## explore-codebase Focus

### Design System Discovery

```bash
# Find UI components
glob "src/components/**/*.tsx" "app/**/*.tsx"

# Find design tokens
read tailwind.config.* globals.css app/globals.css

# Find color usage
grep "bg-" "text-" "border-" --include="*.tsx"

# Find typography
grep "font-" "text-" --include="*.tsx"

# Find animations
grep "motion" "animate-" "transition" --include="*.tsx"
```

### Key Questions

```text
[ ] What colors are used? (CSS variables, Tailwind palette)
[ ] What fonts are loaded? (Google Fonts, local fonts)
[ ] What spacing scale? (gaps, paddings, margins)
[ ] What component patterns exist? (cards, buttons, inputs)
[ ] What animation library? (Framer Motion, CSS)
[ ] What icon library? (Lucide, Heroicons)
```

---

## Output Requirements

### Design Tokens Report

```markdown
## Existing Design System

### Colors
- Primary: var(--primary) / bg-primary
- Secondary: var(--secondary)
- Accent: var(--accent) / emerald-500

### Typography
- Headings: font-display (Clash Display)
- Body: font-sans (Inter)
- Code: font-mono (JetBrains Mono)

### Spacing
- Section gap: gap-16 / py-24
- Card padding: p-6
- Component gap: gap-4

### Components Patterns
- Cards: rounded-2xl, bg-white/5, backdrop-blur
- Buttons: rounded-lg, font-medium
- Inputs: rounded-md, border-input

### Animations
- Library: Framer Motion
- Page load: staggerChildren: 0.1
- Hover: whileHover={{ y: -4 }}
```

---

## Validation Checklist

```text
[ ] explore-codebase completed
[ ] Color palette documented
[ ] Typography identified
[ ] Spacing patterns noted
[ ] Component patterns listed
[ ] Animation patterns found
```

---

## Next Phase

-> Proceed to `02-search-inspiration.md`
