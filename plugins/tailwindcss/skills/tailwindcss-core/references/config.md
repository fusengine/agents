---
name: config
description: Advanced configuration for Tailwind CSS v4.1
---

# Configuration avancée Tailwind CSS v4.1

## Architecture de configuration CSS-first

La configuration Tailwind v4.1 repose sur un seul fichier CSS (`input.css`) sans avoir besoin d'un fichier config JavaScript.

### Structure basique

```
project/
├── src/
│   ├── styles/
│   │   └── input.css          # Configuration principale
│   ├── components/            # Scannés automatiquement
│   ├── pages/
│   └── index.tsx
├── package.json
└── postcss.config.js          # Point d'entrée PostCSS
```

### PostCSS config

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
  },
}
```

---

## Configuration complète - Exemple projet

```css
/* src/styles/input.css */

/* ========================
   1. IMPORT PRINCIPAL
   ======================== */
@import "tailwindcss";

/* ========================
   2. DÉCLARATION DES COUCHES
   ======================== */
@layer theme, base, components, utilities;

/* ========================
   3. THEME - Variables CSS
   ======================== */
@theme {
  /* Initialisation */
  --*: initial;

  /* COULEURS - Palette complète */
  --color-white: #ffffff;
  --color-black: #000000;

  /* Palette grise */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Couleurs sémantiques */
  --color-primary: oklch(0.65 0.2 240);
  --color-primary-light: oklch(0.85 0.15 240);
  --color-primary-dark: oklch(0.45 0.25 240);

  --color-secondary: oklch(0.72 0.18 30);
  --color-success: oklch(0.68 0.18 142);
  --color-warning: oklch(0.76 0.2 56);
  --color-error: oklch(0.65 0.22 28);

  /* TYPOGRAPHIE */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: 'Merriweather', Georgia, serif;
  --font-mono: 'Menlo', 'Monaco', 'Courier New', monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ESPACES (Échelle 4px) */
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;
  --spacing-full: 100%;
  --spacing-screen: 100vw;

  /* ARRONDIS */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* OMBRES */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
                 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
               0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);

  /* DURATIONS */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;

  /* EASING */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* BREAKPOINTS */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* Z-INDEX */
  --z-index-0: 0;
  --z-index-10: 10;
  --z-index-20: 20;
  --z-index-30: 30;
  --z-index-40: 40;
  --z-index-50: 50;
  --z-index-auto: auto;
}

/* ========================
   4. SOURCES À SCANNER
   ======================== */
@source "./src/**/*.{ts,tsx}";
@source "./src/**/*.{jsx,js}";

/* ========================
   5. COUCHE BASE
   ======================== */
@layer base {
  /* Reset */
  * {
    @apply m-0 p-0 box-border;
  }

  html {
    @apply text-base;
  }

  body {
    @apply font-sans text-gray-900 bg-white antialiased;
    line-height: var(--line-height-normal);
  }

  /* Headings */
  h1 {
    @apply text-5xl font-bold leading-tight;
  }

  h2 {
    @apply text-4xl font-bold leading-snug;
  }

  h3 {
    @apply text-3xl font-semibold leading-snug;
  }

  h4 {
    @apply text-2xl font-semibold;
  }

  h5 {
    @apply text-xl font-semibold;
  }

  h6 {
    @apply text-lg font-semibold;
  }

  /* Paragraphes */
  p {
    @apply leading-relaxed;
  }

  /* Listes */
  ul, ol {
    @apply pl-6;
  }

  li {
    @apply mb-2;
  }

  /* Liens */
  a {
    @apply text-primary underline hover:text-primary-dark transition-colors;
  }

  /* Inputs */
  input, textarea, select {
    @apply font-sans;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"],
  textarea {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-primary
           transition-all;
  }

  button {
    @apply cursor-pointer font-medium transition-colors;
  }
}

/* ========================
   6. COUCHE COMPONENTS
   ======================== */
@layer components {
  /* Boutons */
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded-lg
           font-semibold transition-all duration-200;
  }

  .btn-primary {
    @apply bg-primary text-white hover:bg-primary-dark active:scale-95;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  }

  .btn-outline {
    @apply border-2 border-primary text-primary hover:bg-primary hover:text-white;
  }

  .btn-sm {
    @apply px-3 py-1 text-sm;
  }

  .btn-lg {
    @apply px-6 py-3 text-lg;
  }

  .btn:disabled {
    @apply opacity-50 cursor-not-allowed;
  }

  /* Cartes */
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .card-header {
    @apply pb-4 border-b border-gray-200 mb-4;
  }

  .card-footer {
    @apply pt-4 border-t border-gray-200 mt-4;
  }

  /* Conteneurs */
  .container {
    @apply w-full mx-auto px-4;
  }

  .container {
    max-width: var(--breakpoint-xl);
  }

  /* Grilles */
  .grid-cols-responsive {
    @apply grid gap-4;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (min-width: 1280px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  /* Badge */
  .badge {
    @apply inline-block px-3 py-1 rounded-full text-sm font-medium;
  }

  .badge-primary {
    @apply bg-primary/10 text-primary;
  }

  .badge-success {
    @apply bg-success/10 text-success;
  }

  .badge-error {
    @apply bg-error/10 text-error;
  }
}

/* ========================
   7. COUCHE UTILITIES
   ======================== */
@layer utilities {
  /* Flexbox */
  .flex-center {
    @apply flex items-center justify-center;
  }

  .flex-between {
    @apply flex items-center justify-between;
  }

  /* Texte */
  .text-shadow-sm {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .text-shadow-md {
    text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .text-shadow-lg {
    text-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  /* Truncate/Clamp */
  .line-clamp-1 {
    @apply overflow-hidden text-ellipsis whitespace-nowrap;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    @apply overflow-hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    @apply overflow-hidden;
  }

  /* Gradients */
  .grad-primary {
    @apply bg-gradient-to-r from-primary to-primary-dark;
  }

  /* Transitions */
  .transition-smooth {
    @apply transition-all duration-300 ease-in-out;
  }

  /* Accessibilité */
  .sr-only {
    @apply absolute w-px h-px p-0 -m-px
           overflow-hidden clip-path-inset whitespace-nowrap
           border-0;
  }

  /* Focus visible */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
  }
}

/* ========================
   8. VARIANTES PERSONNALISÉES
   ======================== */

/* Mode sombre */
@variant dark {
  @media (prefers-color-scheme: dark) {
    &
  }
}

/* Groupe hover */
@variant group-hover {
  .group:hover &
}

/* Groupe focus */
@variant group-focus {
  .group:focus-within &
}

/* Attributs data */
@variant data-active {
  &[data-active="true"]
}

@variant data-disabled {
  &[data-disabled="true"]
}

/* ========================
   9. DARK MODE OVERRIDES
   ======================== */
@supports (color-scheme: dark) {
  @media (prefers-color-scheme: dark) {
    @layer base {
      body {
        @apply bg-gray-900 text-gray-50;
      }

      a {
        @apply text-primary-light;
      }
    }

    @layer components {
      .card {
        @apply bg-gray-800 shadow-lg;
      }

      .card-header {
        @apply border-gray-700;
      }

      .card-footer {
        @apply border-gray-700;
      }
    }
  }
}

/* ========================
   10. PLUGINS EXTERNES
   ======================== */

/* Optionnel: charger un plugin Tailwind */
/* @plugin "flowbite/plugin"; */
/* @source "./node_modules/flowbite"; */
```

---

## Configuration par cas d'usage

### Application React/Next.js

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-sans: 'Inter', sans-serif;
}

@source "./src/app/**/*.{ts,tsx}";
@source "./src/components/**/*.{ts,tsx}";
@source "./src/pages/**/*.{ts,tsx}";

@layer components {
  .btn { @apply px-4 py-2 rounded-lg font-semibold; }
}
```

### Avec Vite + Vue

```css
/* src/style.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
}

@source "./src/**/*.{vue,ts,js}";
```

### Avec Astro

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.65 0.2 240);
}

@source "../components/**/*.{astro,tsx}";
@source "../pages/**/*.{astro,md}";
```

---

## Optimisations de performance

### Pré-charger les variables

```css
@theme {
  /* Grouper les valeurs fréquemment utilisées */
  --color-primary: #3b82f6;
  --color-white: #ffffff;
  --spacing-4: 1rem;
}
```

### Limiter les sources

```css
/* ✅ Bon */
@source "./src/components/**/*.tsx";

/* ❌ À éviter */
@source "./**/*.{*}";  /* Trop large */
```

### Utiliser des layer judicieusement

```css
/* Réduire la spécificité */
@layer utilities {
  .my-util { /* ... */ }
}

/* Au lieu de */
.my-util { /* ... */ }  /* Plus spécifique */
```

---

## Dépannage

### Les classes n'apparaissent pas

1. Vérifier que `@source` inclut les fichiers
2. Vérifier les extensions de fichier (`.tsx` vs `.ts`)
3. Redémarrer le serveur de développement

### Conflits de variables

```css
/* Vérifier les noms uniques */
@theme {
  --color-primary: #3b82f6;  /* ✅ Unique */
  --color: #000;             /* ❌ Trop générique */
}
```

### Ordre de chargement important

```css
/* ✅ Bon ordre */
@import "tailwindcss";        /* 1. Import */
@theme { /* ... */ }           /* 2. Thème */
@source "./components/**"; /* 3. Sources */
@layer components { /* ... */ } /* 4. Couches */

/* ❌ Mauvais ordre */
@source "./components/**";
@import "tailwindcss";
```

---

## Références

- [Tailwind CSS v4.1 Configuration](https://tailwindcss.com/docs/configuration)
- [PostCSS Configuration](https://postcss.org/docs/postcss-load-config)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
