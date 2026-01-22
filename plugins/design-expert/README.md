# Design Expert Plugin

Expert UI/UX design for React/Next.js with Tailwind CSS, shadcn/ui and 21st.dev.

**ZERO TOLERANCE for generic "AI slop" aesthetics.**

## Main Agent

- **design-expert** - Design orchestrator with 4 skills and anti-AI slop system

## 4-Pillar Framework

### 1. Typography

Fonts FORBIDDEN: Inter, Roboto, Arial, Open Sans, system fonts

Fonts APPROVED: Clash Display, Playfair Display, JetBrains Mono, Bricolage Grotesque, Satoshi, Syne

### 2. Colors

- CSS Variables mandatory
- NO purple gradients
- Sharp accents, IDE-inspired themes

### 3. Motion

- Orchestrated page load (stagger)
- Hover states on ALL interactive elements
- NO random animations (bounce, pulse)

### 4. Backgrounds

- Layered gradients, glassmorphism, gradient orbs
- NO solid white/gray (except brutalist)

## Theme Presets

- **Brutalist** - Monochrome, sharp edges, 900 weight
- **Solarpunk** - Greens, golds, organic shapes
- **Editorial** - Serif headlines, generous whitespace
- **Cyberpunk** - Neon on dark, monospace, glitch
- **Luxury** - Gold accents, serif, refined animations

## Included Skills

### Component Generation

- **generating-components** - Creation via shadcn/ui and 21st.dev
  - Step 0: READ typography.md + color-system.md (ANTI-AI SLOP)
  - Step 1-2: Search 21st.dev + shadcn/ui
  - Step 5: READ theme-presets.md - Choose theme
  - Validation anti-AI slop checklist

### Design System

- **designing-systems** - Tokens, colors, typography
  - OKLCH color space (P3 gamut)
  - Modular scale typography (1.25)
  - Spacing 4px grid

### Accessibility

- **validating-accessibility** - WCAG 2.2 Level AA
  - Contrast 4.5:1 (text), 3:1 (UI)
  - Keyboard navigation
  - ARIA support
  - Reduced motion

### Animations

- **adding-animations** - Framer Motion and CSS
  - Micro-interactions (<100ms feedback)
  - Variants and orchestration
  - Exit animations

## Anti-AI Slop References

- `references/typography.md` - Fonts FORBIDDEN/APPROVED
- `references/color-system.md` - CSS variables, palettes
- `references/motion-patterns.md` - Animations, hover states
- `references/theme-presets.md` - Brutalist, Solarpunk, Editorial, Cyberpunk, Luxury

## Command

```bash
/design hero section brutalist
/design pricing cards solarpunk
/design contact form editorial
```

## Technologies

- React/Next.js
- Tailwind CSS v4
- shadcn/ui
- 21st.dev
- Framer Motion
- OKLCH colors

## Workflow

1. **Read** - Typography + Color references (ANTI-AI SLOP)
2. **Discover** - Inspiration via 21st.dev and shadcn
3. **Design** - Choose theme, declare fonts/colors
4. **Build** - Component generation
5. **Animate** - Micro-interactions (Framer Motion)
6. **Validate** - Accessibility + Anti-AI slop checklist

## Anti-AI Slop Checklist

- [ ] Typography: Distinctive font (NOT Inter/Roboto)
- [ ] Colors: CSS variables, NO purple gradients
- [ ] Motion: Orchestrated OR intentional absence
- [ ] Hover states: ALL interactive elements
- [ ] Border-left: NO colored left borders
- [ ] Accessibility: Semantic HTML + ARIA + WCAG AA
