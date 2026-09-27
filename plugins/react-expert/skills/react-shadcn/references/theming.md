---
name: theming
description: CSS variables-based theming system with dark mode support and custom palettes
when-to-use: Design system setup, custom color palettes, dark mode implementation, brand consistency
keywords: theme, CSS variables, dark mode, color palette, custom theme, design system
priority: low
requires: installation.md
related: installation.md
---

# Theming (Vite)

Sources: https://ui.shadcn.com/docs/theming, https://ui.shadcn.com/docs/dark-mode/vite,
https://ui.shadcn.com/docs/components-json, https://ui.shadcn.com/docs/cli#eject.

shadcn/ui themes with semantic CSS variables in **OKLCH**, mapped to Tailwind v4 utilities with
`@theme inline`. There is no `tailwind.config.*`, no `hsl(var(--x))` wrapper and no
`tailwindcss-animate` plugin — those are Tailwind v3-era patterns.

Build a theme visually on https://ui.shadcn.com/create, then apply it with
`bunx --bun shadcn@latest init --preset <CODE>` (new) or `shadcn apply <CODE>` (existing;
`--only theme` or `--only font` to apply part of it).

## Default Theme (`neutral`) — `src/index.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

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

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

Notes:
- `@import "shadcn/tailwind.css"` supplies the `data-open:` / `data-closed:` custom variants
  (matching both Radix `data-state="open"` and Base UI `data-open`) and the accordion keyframes.
- There is no `--destructive-foreground` token in the current theme.
- `tailwind.baseColor` values: `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist`, `taupe`.
  Switch later with `bunx --bun shadcn@latest migrate base-color --to zinc`.

## Token Convention

Surface/foreground pairs: `primary` pairs with `primary-foreground`, etc.

| Token | Controls |
|-------|----------|
| `background` / `foreground` | App background and default text |
| `card` / `card-foreground` | Elevated surfaces (`Card`, panels) |
| `popover` / `popover-foreground` | Floating surfaces (`Popover`, menus, overlays) |
| `primary` / `primary-foreground` | High-emphasis actions (default `Button`) |
| `secondary` / `secondary-foreground` | Lower-emphasis filled actions |
| `muted` / `muted-foreground` | Subtle surfaces, descriptions, placeholders |
| `accent` / `accent-foreground` | Hover/focus/active surfaces (ghost buttons, menu highlight) |
| `destructive` | Destructive actions and invalid states |
| `border`, `input`, `ring` | Borders, form-control borders, focus rings |
| `chart-1` … `chart-5` | Chart palette |
| `sidebar*` | Sidebar surface, primary, accent, border, ring |
| `radius` | Base of the radius scale (`radius-sm` … `radius-4xl` derived in `@theme inline`) |

## Adding a Token

Define it in `:root` and `.dark`, then expose it with `@theme inline`:

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

```tsx
<div className="bg-warning text-warning-foreground" />
```

## Dark Mode (Vite)

Vite apps use a small context provider (no `next-themes`). It toggles `light`/`dark` on
`<html>`, which drives `@custom-variant dark (&:is(.dark *))`.

```tsx
// src/modules/cores/shadcn/components/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
})

/**
 * Persists the theme in localStorage and applies the matching class on <html>.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (next: Theme) => {
      localStorage.setItem(storageKey, next)
      setTheme(next)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * Reads the current theme and setter. Must be used inside ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
```

Wrap the app in `src/main.tsx` (see [configuration.md](configuration.md#dark-mode-vite)).

### Mode Toggle — Base UI project (`render`)

```tsx
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/modules/cores/shadcn/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/cores/shadcn/components/ui/dropdown-menu"
import { useTheme } from "@/modules/cores/shadcn/components/theme-provider"

/** Dropdown switching between light, dark and system themes. */
export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <SunIcon className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Mode Toggle — Radix project (`asChild`)

Identical except the trigger:

```tsx
<DropdownMenuTrigger asChild>
  <Button variant="outline" size="icon">
    {/* same icons + sr-only label */}
  </Button>
</DropdownMenuTrigger>
```

## Without CSS Variables

`init --no-css-variables` sets `tailwind.cssVariables: false` and generates inline utilities
(`bg-zinc-950 dark:bg-white`). Installation-time choice: switching means deleting and
re-installing components.

## Best Practices

1. **OKLCH only** — the CLI, presets and `migrate base-color` all emit OKLCH.
2. **Tokens, not raw colors** — components use `bg-primary`, never hex values.
3. **Every new token in `:root`, `.dark` and `@theme inline`** — otherwise no utility is generated.
4. **Change `--radius`, not per-component radii** — the whole `radius-*` scale derives from it.
5. **Keep `shadcn/tailwind.css` imported** unless you deliberately `shadcn eject`.
