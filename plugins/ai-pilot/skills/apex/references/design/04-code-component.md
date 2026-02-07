---
name: 04-code-component
description: Implement component following design specifications
prev_step: references/design/03-plan-component.md
next_step: references/design/05-add-motion.md
---

# 04 - Code Component (APEX Phase E)

**Implement component following plan and design specs.**

## When to Use

- After planning (03-plan-component)
- Following TaskCreate tasks
- Referencing design tokens from Phase 01

---

## Component Structure

### Standard Template

```tsx
/**
 * HeroSection - Landing page hero with animated content
 * @description Main hero section with gradient background and CTAs
 */
export function HeroSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <HeroBackground />
      <div className="container relative z-10">
        <HeroContent />
      </div>
    </section>
  )
}
```

### With Props

```tsx
interface CardProps {
  /** Card title */
  title: string
  /** Card description */
  description: string
  /** Optional icon */
  icon?: React.ReactNode
}

/**
 * Card - Glassmorphic card component
 */
export function Card({ title, description, icon }: CardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}
```

---

## Styling Rules

### Use Design Tokens

```tsx
// ✅ GOOD - Uses existing tokens
className="bg-primary text-primary-foreground"
className="font-display text-4xl"

// ❌ BAD - Hardcoded values
className="bg-blue-500 text-white"
className="font-bold text-[40px]"
```

### Forbidden Patterns

```tsx
// ❌ NEVER - AI Slop
className="border-l-4 border-purple-500"  // border-left indicator
className="bg-gradient-to-r from-purple-500 to-pink-500"  // purple gradient

// ✅ INSTEAD
className="bg-emerald-500/10 rounded-xl"  // with icon
className="bg-gradient-to-b from-primary/20 to-transparent"
```

---

## File Organization

### Component Files

```text
components/
├── hero/
│   ├── HeroSection.tsx      # Main component (<100 lines)
│   ├── HeroBackground.tsx   # Background effects
│   ├── HeroContent.tsx      # Text + CTAs
│   └── index.ts             # Exports
```

### Export Pattern

```tsx
// index.ts
export { HeroSection } from './HeroSection'
export { HeroBackground } from './HeroBackground'
```

---

## Validation Checklist

```text
[ ] Component follows plan
[ ] Uses design tokens from Phase 01
[ ] No hardcoded colors/fonts
[ ] No AI slop patterns
[ ] Files under 100 lines
[ ] JSDoc on exports
[ ] Proper TypeScript types
```

---

## Next Phase

-> Proceed to `05-add-motion.md`
