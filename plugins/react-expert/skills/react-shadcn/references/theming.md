---
name: theming
description: CSS variables-based theming system with dark mode support and custom palettes
when-to-use: Design system setup, custom color palettes, dark mode implementation, brand consistency
keywords: theme, CSS variables, dark mode, color palette, custom theme, design system
priority: low
requires: installation.md
related: installation.md
---

# Theming

Shadcn uses CSS variables for theming, allowing easy customization and dark mode support.

## CSS Variables Approach

Shadcn components use CSS custom properties (variables) defined in your stylesheet:

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Light mode variables */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.6%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 9.0%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.6%;
    --radius: 0.5rem;
  }

  /* Dark mode variables */
  .dark {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.6%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.6%;
    --popover-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 98%;
    --accent-foreground: 0 0% 9.0%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 9.0%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}
```

## Dark Mode Setup

### React Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // other config...
}

export default nextConfig
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'], // or 'media'
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'calc(var(--radius) + 0.5rem)',
        md: 'calc(var(--radius) + 0.25rem)',
        sm: 'calc(var(--radius) - 0.125rem)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
```

## Dark Mode Provider

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'My App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Theme Toggle Component

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          checked={theme === 'light'}
          onCheckedChange={() => setTheme('light')}
        >
          Light
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === 'dark'}
          onCheckedChange={() => setTheme('dark')}
        >
          Dark
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === 'system'}
          onCheckedChange={() => setTheme('system')}
        >
          System
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Custom Color Palette

### Creating a Custom Theme

```css
/* app/globals.css - Custom Blue Theme */

@layer base {
  :root {
    /* Primary brand colors */
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;

    /* Accent colors */
    --accent: 166 76% 40%;
    --accent-foreground: 210 40% 98%;

    /* Background & foreground */
    --background: 0 0% 100%;
    --foreground: 221 83% 11%;

    /* Card colors */
    --card: 0 0% 100%;
    --card-foreground: 221 83% 11%;

    /* Semantic colors */
    --destructive: 0 84.2% 60.2%;
    --success: 142 76% 36%;
    --warning: 38 92% 50%;
    --info: 221 83% 53%;

    /* Neutral grays */
    --muted: 221 12% 92%;
    --muted-foreground: 221 9% 38%;
    --border: 221 12% 88%;
    --input: 221 12% 88%;
    --ring: 221 83% 53%;
  }

  .dark {
    --primary: 221 83% 64%;
    --primary-foreground: 221 83% 11%;

    --accent: 166 100% 50%;
    --accent-foreground: 221 83% 11%;

    --background: 221 25% 10%;
    --foreground: 0 0% 98%;

    --card: 221 24% 15%;
    --card-foreground: 0 0% 98%;

    --destructive: 0 84.2% 60.2%;
    --success: 142 76% 50%;
    --warning: 38 92% 60%;
    --info: 221 83% 64%;

    --muted: 221 24% 28%;
    --muted-foreground: 221 12% 70%;
    --border: 221 24% 24%;
    --input: 221 24% 24%;
    --ring: 221 83% 64%;
  }
}

* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground;
}
```

### Multiple Theme Variants

```tsx
// lib/themes.ts
export const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: '221 83% 53%',
      accent: '166 76% 40%',
      background: '0 0% 100%',
      foreground: '221 83% 11%',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '221 83% 64%',
      accent: '166 100% 50%',
      background: '221 25% 10%',
      foreground: '0 0% 98%',
    },
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '200 100% 50%',
      accent: '180 100% 40%',
      background: '210 30% 10%',
      foreground: '0 0% 98%',
    },
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: '120 50% 40%',
      accent: '80 60% 50%',
      background: '120 30% 15%',
      foreground: '0 0% 98%',
    },
  },
}
```

## Component Customization with Theme Variables

```tsx
// components/ui/custom-button.tsx
import { cn } from '@/modules/cores/lib/utils'

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function CustomButton({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: CustomButtonProps) {
  const baseStyles = 'font-medium rounded-md transition-colors'

  const variantStyles = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    success: 'bg-success text-white hover:bg-success/90',
    warning: 'bg-warning text-white hover:bg-warning/90',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  }

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
}
```

## CSS Variable Reference

| Variable | Purpose | Light Value | Dark Value |
|----------|---------|------------|-----------|
| `--background` | Page background | `0 0% 100%` | `0 0% 3.6%` |
| `--foreground` | Text color | `0 0% 3.6%` | `0 0% 98%` |
| `--primary` | Primary brand color | `0 0% 9%` | `0 0% 98%` |
| `--accent` | Accent/highlight color | `0 0% 9%` | `0 0% 98%` |
| `--muted` | Muted/secondary background | `0 0% 96.1%` | `0 0% 14.9%` |
| `--destructive` | Danger/error color | `0 84.2% 60.2%` | `0 84.2% 60.2%` |
| `--border` | Border color | `0 0% 89.8%` | `0 0% 14.9%` |
| `--ring` | Focus ring color | `0 0% 3.6%` | `0 0% 83.1%` |

## Installing next-themes

```bash
npm install next-themes
```

## Best Practices

1. **HSL Format**: Use HSL for easier manipulation and variations
2. **Semantic Colors**: Use color names that describe purpose (primary, danger, success)
3. **System Default**: Set `enableSystem={true}` to respect OS preferences
4. **No Flash**: Use `suppressHydrationWarning` on html element
5. **Accessible**: Ensure sufficient contrast between foreground and background
6. **Consistency**: Keep color palette consistent across light and dark modes

## Common Color Palettes

### Modern Blue
```css
--primary: 221 83% 53%;
--accent: 166 76% 40%;
--success: 142 76% 36%;
--warning: 38 92% 50%;
--destructive: 0 84.2% 60.2%;
```

### Pastel
```css
--primary: 260 100% 68%;
--accent: 345 100% 68%;
--success: 140 100% 68%;
--warning: 45 100% 68%;
--destructive: 0 100% 68%;
```

### High Contrast
```css
--primary: 0 0% 0%;
--accent: 0 0% 100%;
--success: 120 100% 25%;
--warning: 40 100% 40%;
--destructive: 0 100% 50%;
```

## Testing Themes

```tsx
// components/__tests__/theme.test.tsx
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

describe('Theme Provider', () => {
  it('should render with light theme', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="bg-background text-foreground">
          Themed Content
        </div>
      </ThemeProvider>
    )

    const element = screen.getByText('Themed Content')
    expect(element).toHaveClass('text-foreground')
  })

  it('should apply dark theme', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
        <div className="bg-background text-foreground dark:bg-slate-950">
          Themed Content
        </div>
      </ThemeProvider>
    )

    expect(document.documentElement).toHaveClass('dark')
  })
})
```
