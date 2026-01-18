# Design Expert Plugin

Expert UI/UX design pour React/Next.js avec Tailwind CSS, shadcn/ui et 21st.dev.

**ZERO TOLERANCE pour l'esthétique "AI slop" générique.**

## Agent principal

- **design-expert** - Orchestrateur design avec 4 skills et système anti-AI slop

## Framework 4 Piliers

### 1. Typography

Fonts FORBIDDEN: Inter, Roboto, Arial, Open Sans, system fonts

Fonts APPROVED: Clash Display, Playfair Display, JetBrains Mono, Bricolage Grotesque, Satoshi, Syne

### 2. Colors

- CSS Variables obligatoires
- NO purple gradients
- Sharp accents, IDE-inspired themes

### 3. Motion

- Orchestrated page load (stagger)
- Hover states sur TOUS les éléments interactifs
- NO animations random (bounce, pulse)

### 4. Backgrounds

- Layered gradients, glassmorphism, gradient orbs
- NO solid white/gray (sauf brutalist)

## Theme Presets

- **Brutalist** - Monochrome, sharp edges, 900 weight
- **Solarpunk** - Greens, golds, organic shapes
- **Editorial** - Serif headlines, generous whitespace
- **Cyberpunk** - Neon on dark, monospace, glitch
- **Luxury** - Gold accents, serif, refined animations

## Skills inclus

### Génération de composants

- **generating-components** - Création via shadcn/ui et 21st.dev
  - Step 0: READ typography.md + color-system.md (ANTI-AI SLOP)
  - Step 1-2: Search 21st.dev + shadcn/ui
  - Step 5: READ theme-presets.md - Choose theme
  - Validation anti-AI slop checklist

### Système de design

- **designing-systems** - Tokens, couleurs, typographie
  - OKLCH color space (P3 gamut)
  - Modular scale typography (1.25)
  - Spacing 4px grid

### Accessibilité

- **validating-accessibility** - WCAG 2.2 Level AA
  - Contraste 4.5:1 (text), 3:1 (UI)
  - Navigation clavier
  - Support ARIA
  - Reduced motion

### Animations

- **adding-animations** - Framer Motion et CSS
  - Micro-interactions (<100ms feedback)
  - Variants et orchestration
  - Exit animations

## Références Anti-AI Slop

- `references/typography.md` - Fonts FORBIDDEN/APPROVED
- `references/color-system.md` - CSS variables, palettes
- `references/motion-patterns.md` - Animations, hover states
- `references/theme-presets.md` - Brutalist, Solarpunk, Editorial, Cyberpunk, Luxury

## Commande

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
2. **Discover** - Inspiration via 21st.dev et shadcn
3. **Design** - Choose theme, declare fonts/colors
4. **Build** - Génération composant
5. **Animate** - Micro-interactions (Framer Motion)
6. **Validate** - Accessibilité + Anti-AI slop checklist

## Anti-AI Slop Checklist

- [ ] Typography: Distinctive font (NOT Inter/Roboto)
- [ ] Colors: CSS variables, NO purple gradients
- [ ] Motion: Orchestrated OR intentional absence
- [ ] Hover states: ALL interactive elements
- [ ] Border-left: NO colored left borders
- [ ] Accessibility: Semantic HTML + ARIA + WCAG AA
