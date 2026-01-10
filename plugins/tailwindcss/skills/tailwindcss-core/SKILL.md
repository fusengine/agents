---
name: tailwindcss-core
description: "Configuration et directives Tailwind CSS v4.1. @theme, @import, @source, @utility, @variant, @apply, @config. Mode CSS-first sans tailwind.config.js."
---

# Tailwind CSS Core v4.1

## Vue d'ensemble

Tailwind CSS v4.1 introduit une approche **CSS-first** qui élimine le besoin d'un fichier `tailwind.config.js` traditionnel. Toute la configuration se fait maintenant directement dans vos fichiers CSS via des directives spécialisées.

## Concepts clés

### 1. @import "tailwindcss"

Point d'entrée pour charger Tailwind CSS. À placer en début de votre fichier CSS principal.

```css
@import "tailwindcss";
```

Cette directive charge automatiquement:
- Les utilitaires de base
- Les variantes de réactivité
- Les couches (theme, base, components, utilities)

### 2. @theme

Directive pour définir ou personnaliser les valeurs de thème via des variables CSS (CSS custom properties).

```css
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #ef4444;
  --spacing-custom: 2.5rem;
  --radius-lg: 1rem;
}
```

Les variables sont accessibles dans les utilitaires générés:
- `--color-*` → classes `bg-primary`, `text-primary`, etc.
- `--spacing-*` → classes `p-custom`, `m-custom`, etc.
- `--radius-*` → classes `rounded-lg`, etc.

### 3. @source

Directive pour inclure des fichiers source supplémentaires avec glob patterns.

```css
@source "./routes/**/*.{ts,tsx}";
@source "./components/**/*.{tsx,jsx}";
@source "../packages/ui/src/**/*.{ts,tsx}";
```

Tailwind scannera ces fichiers pour générer les utilitaires utilisés dans votre projet.

### 4. @utility et @variant

Directives pour créer des utilitaires et variantes personnalisés.

```css
@utility truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@variant group-hover {
  .group:hover &
}
```

### 5. @apply

Directive pour appliquer des classes Tailwind dans vos règles CSS personnalisées.

```css
.btn {
  @apply px-4 py-2 rounded-lg font-semibold;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}
```

### 6. @config

Directive pour charger une configuration externe si nécessaire.

```css
@config "./tailwind.config.js";
```

(Optionnel en v4.1, utilisé principalement pour retrocompatibilité)

## Mode sombre

Configuration du mode sombre dans Tailwind v4.1:

```css
@import "tailwindcss";

/* Utiliser la préférence système */
@variant dark (&:is(.dark *));
```

Ou via une classe manuelle:

```css
@variant dark (&.dark);
```

## Points d'arrêt réactifs

Les breakpoints sont définis via `@theme`:

```css
@theme {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

Les variantes réactives s'utilisent avec les utilitaires:

```html
<div class="text-sm md:text-base lg:text-lg"></div>
```

## Hiérarchie des couches

```css
@layer theme, base, components, utilities;

@import "tailwindcss";

/* Vos personnalisations */
@layer components {
  .btn { @apply px-4 py-2 rounded; }
}

@layer utilities {
  .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
}
```

## Intégration avec plugins

Charger des plugins Tailwind:

```css
@import "tailwindcss";
@plugin "flowbite/plugin";
@source "../node_modules/flowbite";
```

## Ordre de spécificité

En CSS-first, l'ordre d'import et de déclaration détermine la spécificité:

1. `@import "tailwindcss"` - Utilitaires de base
2. `@theme { ... }` - Variables de thème
3. `@layer components { ... }` - Composants personnalisés
4. `@layer utilities { ... }` - Utilitaires personnalisés

## Avantages du mode CSS-first

- Pas de fichier config JavaScript complexe
- Type-safe via les variables CSS
- Configuration déclarative et lisible
- Meilleure intégration avec les preprocesseurs CSS
- Maintenance simplifiée pour les projets larges

## Références détaillées

Consultez les fichiers spécifiques pour:
- `theme.md` - Configuration complète des variables de thème
- `directives.md` - Syntaxe et exemples de toutes les directives
- `config.md` - Configuration avancée et cas d'usage
