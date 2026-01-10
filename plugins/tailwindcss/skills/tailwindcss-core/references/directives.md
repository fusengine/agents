# Directives Tailwind CSS v4.1

## @import "tailwindcss"

**Objectif**: Charger Tailwind CSS et tous ses utilitaires.

```css
/* input.css */
@import "tailwindcss";
```

À placer en **début** de votre fichier CSS principal.

**Résultat**: Génère automatiquement:
- Couches (theme, base, components, utilities)
- Utilitaires de base
- Variantes réactives (sm, md, lg, etc.)
- Variantes d'état (hover, focus, active, etc.)

---

## @theme

**Objectif**: Définir ou personnaliser les valeurs de thème.

### Syntaxe basique

```css
@theme {
  --color-primary: #3b82f6;
  --spacing-large: 3rem;
  --radius-md: 0.5rem;
}
```

### Avec variables CSS existantes

```css
@layer base {
  :root {
    --hue: 220;
    --saturation: 90%;
  }
}

@theme {
  --color-primary: hsl(var(--hue), var(--saturation), 50%);
}
```

### Réinitialisation du thème

```css
@theme {
  --*: initial;  /* Réinitialise tout */
  --color-*: initial;  /* Réinitialise toutes les couleurs */

  /* Puis redéfinit les valeurs personnalisées */
  --color-primary: #3b82f6;
}
```

### Valeurs multiples avec variables CSS

```css
@theme {
  --shadow-custom:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);

  --font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

---

## @source

**Objectif**: Inclure des fichiers source supplémentaires pour la génération d'utilitaires.

### Syntaxe de base

```css
@source "./components/**/*.{tsx,jsx}";
@source "./pages/**/*.{ts,tsx}";
```

### Avec chemins relatifs

```css
/* Fichier: src/styles/input.css */
@source "../components/**/*.tsx";
@source "../pages/**/*.tsx";
@source "../hooks/**/*.ts";
```

### Avec chemins absolus

```css
@source "./src/components/**/*.{ts,tsx}";
@source "./node_modules/@company/ui/**/*.{js,jsx}";
```

### Patterns Glob avancés

```css
/* Extensions multiples */
@source "./**/*.{html,js,ts,jsx,tsx,svelte,vue}";

/* Exclusions */
@source "./components/**/*.{tsx,!spec.tsx}";

/* Profondeur variable */
@source "./src/**/*.tsx";  /* Toute profondeur */
@source "./src/*.tsx";     /* Niveau racine seulement */
@source "./src/*/index.tsx"; /* Sous-dossiers directs */
```

### Avec les plugins

```css
@source "./node_modules/flowbite";
@source "./node_modules/@headlessui";
@source "./node_modules/@radix-ui";
```

---

## @utility

**Objectif**: Créer des classes utilitaires personnalisées.

### Syntaxe simple

```css
@utility truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Utilisation:
```html
<p class="truncate">Texte très long qui sera tronqué</p>
```

### Avec variantes

```css
@utility card {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
```

### Utilitaires multiples

```css
@utility flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@utility text-shadow-lg {
  text-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

---

## @variant

**Objectif**: Créer des variantes personnalisées (sélecteurs généralisés).

### Variante de classe

```css
@variant group-hover {
  .group:hover &
}

@variant group-focus {
  .group:focus-within &
}
```

Utilisation:
```html
<div class="group">
  <p class="text-gray-900 group-hover:text-blue-500">Texte</p>
</div>
```

### Variante d'attribut

```css
@variant data-active {
  &[data-active="true"]
}

@variant aria-disabled {
  &[aria-disabled="true"]
}
```

Utilisation:
```html
<button data-active="true" class="bg-white data-active:bg-blue-500">
  Bouton
</button>
```

### Variante de pseudo-classe

```css
@variant open {
  &[open]
}

@variant valid {
  &:valid
}

@variant required {
  &:required
}
```

### Mode sombre

```css
@variant dark {
  @media (prefers-color-scheme: dark) {
    &
  }
}

/* Ou avec classe manuelle */
@variant dark {
  .dark &
}
```

---

## @apply

**Objectif**: Appliquer des classes Tailwind dans des règles CSS personnalisées.

### Syntaxe simple

```css
.btn {
  @apply px-4 py-2 rounded-lg font-semibold;
}
```

### Avec variantes

```css
.btn-primary {
  @apply bg-blue-500 text-white;

  /* Variantes appliquées */
  &:hover {
    @apply bg-blue-600;
  }

  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}
```

### Combinaison avec CSS personnalisé

```css
.btn {
  @apply px-4 py-2 rounded-lg;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  @apply bg-blue-500 text-white;

  &:hover {
    @apply bg-blue-600;
  }
}
```

### Avec média queries

```css
.responsive-grid {
  @apply grid gap-4;

  @media (min-width: 768px) {
    @apply grid-cols-2;
  }

  @media (min-width: 1024px) {
    @apply grid-cols-3;
  }
}
```

### Utilisation en @layer

```css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .card-header {
    @apply pb-4 border-b border-gray-200;
  }

  .card-body {
    @apply pt-4;
  }
}
```

---

## @layer

**Objectif**: Organiser les styles par couches (cascade et spécificité).

### Couches standard

```css
@layer theme, base, components, utilities;

@import "tailwindcss";

@layer base {
  body {
    @apply font-sans antialiased;
  }

  h1 {
    @apply text-4xl font-bold;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold;
  }
}

@layer utilities {
  .text-shadow-lg {
    text-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
}
```

### Ordre d'affichage

1. **theme** - Valeurs de thème (variables CSS)
2. **base** - Réinitialisation et styles de base
3. **components** - Composants réutilisables
4. **utilities** - Utilitaires (spécificité la plus élevée)

---

## @config

**Objectif**: Charger une configuration JavaScript (compatibilité v3).

```css
@config "./tailwind.config.js";
```

**Note**: En Tailwind CSS v4.1, c'est généralement optionnel si vous utilisez `@theme`.

---

## @custom-variant (Obsolète)

Remplacé par `@variant` en v4.1:

```css
/* Ancienne syntaxe (v3) */
@custom-variant dark (&:is(.dark *));

/* Nouvelle syntaxe (v4.1) */
@variant dark {
  &:is(.dark *)
}
```

---

## Ordre de chargement

```css
/* 1. Import principal */
@import "tailwindcss";

/* 2. Définir le thème */
@theme {
  --color-primary: #3b82f6;
}

/* 3. Déclarer les couches */
@layer base { /* ... */ }
@layer components { /* ... */ }
@layer utilities { /* ... */ }

/* 4. Inclure les sources */
@source "./components/**/*.tsx";
```

---

## Exemples complets

### Application React

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #ef4444;
  --spacing-custom: 2.5rem;
}

@source "./src/**/*.{ts,tsx}";

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold transition-colors;
  }

  .btn-primary {
    @apply bg-primary text-white hover:bg-primary/90;
  }
}

@variant dark {
  @media (prefers-color-scheme: dark) {
    &
  }
}
```

### Avec plugins Tailwind

```css
@import "tailwindcss";
@plugin "flowbite/plugin";

@source "./src/**/*.{ts,tsx}";
@source "./node_modules/flowbite";

@theme {
  --color-primary: oklch(0.65 0.2 240);
}

@layer components {
  .flowbite-card {
    @apply bg-white rounded-lg shadow-lg;
  }
}
```

---

## Références

- [Tailwind CSS v4.1 Functions & Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Custom Properties Documentation](https://tailwindcss.com/docs/theme)
