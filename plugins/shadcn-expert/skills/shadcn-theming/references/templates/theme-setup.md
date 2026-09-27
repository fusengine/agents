---
name: theme-setup
description: Complete shadcn/ui theme with CSS variables, dark mode, and Tailwind v4 integration
keywords: theme, setup, css, oklch, dark-mode, tailwind
---

# Theme Setup

## Complete Light + Dark Theme

```css
/* app/globals.css */
@import "tailwindcss";
@import "shadcn/tailwind.css"; /* added by `shadcn init` (CLI 4.x); `shadcn eject` inlines it */

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(100% 0 0);
  --foreground: oklch(14.1% 0.005 285.82);
  --card: oklch(100% 0 0);
  --card-foreground: oklch(14.1% 0.005 285.82);
  --popover: oklch(100% 0 0);
  --popover-foreground: oklch(14.1% 0.005 285.82);
  --primary: oklch(20.5% 0.016 285.94);
  --primary-foreground: oklch(98.5% 0 0);
  --secondary: oklch(96.7% 0.001 286.38);
  --secondary-foreground: oklch(20.5% 0.016 285.94);
  --accent: oklch(96.7% 0.001 286.38);
  --accent-foreground: oklch(20.5% 0.016 285.94);
  --muted: oklch(96.7% 0.001 286.38);
  --muted-foreground: oklch(55.6% 0.01 285.94);
  --destructive: oklch(57.7% 0.245 27.33);
  --border: oklch(92.2% 0.004 286.32);
  --input: oklch(92.2% 0.004 286.32);
  --ring: oklch(87.1% 0.006 286.29);
  --radius: 0.625rem;
  --chart-1: oklch(64.6% 0.222 41.12);
  --chart-2: oklch(60% 0.19 160);
  --chart-3: oklch(55% 0.18 230);
  --chart-4: oklch(70% 0.15 300);
  --chart-5: oklch(75% 0.12 60);
  --sidebar: oklch(98.5% 0 0);
  --sidebar-foreground: oklch(14.1% 0.005 285.82);
  --sidebar-primary: oklch(20.5% 0.016 285.94);
  --sidebar-primary-foreground: oklch(98.5% 0 0);
  --sidebar-accent: oklch(96.7% 0.001 286.38);
  --sidebar-accent-foreground: oklch(20.5% 0.016 285.94);
  --sidebar-border: oklch(92.2% 0.004 286.32);
  --sidebar-ring: oklch(87.1% 0.006 286.29);
}

.dark {
  --background: oklch(14.1% 0.005 285.82);
  --foreground: oklch(98.5% 0 0);
  --card: oklch(14.1% 0.005 285.82);
  --card-foreground: oklch(98.5% 0 0);
  --popover: oklch(14.1% 0.005 285.82);
  --popover-foreground: oklch(98.5% 0 0);
  --primary: oklch(92.2% 0 0);
  --primary-foreground: oklch(20.5% 0.016 285.94);
  --secondary: oklch(26.9% 0.006 286.03);
  --secondary-foreground: oklch(98.5% 0 0);
  --accent: oklch(26.9% 0.006 286.03);
  --accent-foreground: oklch(98.5% 0 0);
  --muted: oklch(26.9% 0.006 286.03);
  --muted-foreground: oklch(71.1% 0.013 286.07);
  --destructive: oklch(57.7% 0.245 27.33);
  --border: oklch(26.9% 0.006 286.03);
  --input: oklch(26.9% 0.006 286.03);
  --ring: oklch(36.2% 0.014 285.88);
  --chart-1: oklch(48.8% 0.243 264.376);
  --chart-2: oklch(69.6% 0.17 162.48);
  --chart-3: oklch(76.9% 0.188 70.08);
  --chart-4: oklch(62.7% 0.265 303.9);
  --chart-5: oklch(64.5% 0.246 16.439);
  --sidebar: oklch(14.1% 0.005 285.82);
  --sidebar-foreground: oklch(98.5% 0 0);
  --sidebar-primary: oklch(48.8% 0.243 264.05);
  --sidebar-primary-foreground: oklch(98.5% 0 0);
  --sidebar-accent: oklch(26.9% 0.006 286.03);
  --sidebar-accent-foreground: oklch(98.5% 0 0);
  --sidebar-border: oklch(26.9% 0.006 286.03);
  --sidebar-ring: oklch(36.2% 0.014 285.88);
}
```

## Tailwind v4 @theme inline Bridge

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}
```

## Theme Switching (React)

```tsx
// components/theme-provider.tsx
"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
```
