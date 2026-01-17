# Design Expert Plugin

Expert UI/UX design pour React/Next.js avec Tailwind CSS, shadcn/ui et 21st.dev.

## Agent principal

- **design-expert** - Orchestrateur design avec 4 skills spécialisés

## Skills inclus

### Génération de composants

- **generating-components** - Création via shadcn/ui et 21st.dev
  - Recherche d'inspiration (21st_magic_component_inspiration)
  - Génération de code (21st_magic_component_builder)
  - Installation shadcn (get_add_command_for_items)

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

## Commande

```bash
/design hero section with gradient
/design pricing cards
/design contact form
```

## Technologies

- React/Next.js
- Tailwind CSS v4
- shadcn/ui
- 21st.dev
- Framer Motion
- OKLCH colors

## Workflow

1. **Discover** - Inspiration via 21st.dev et shadcn
2. **Design** - Alignement système de design
3. **Build** - Génération composant
4. **Animate** - Micro-interactions
5. **Validate** - Accessibilité WCAG 2.2
