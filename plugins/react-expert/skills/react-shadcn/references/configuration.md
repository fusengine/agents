---
name: configuration
description: Configure shadcn/ui with SOLID paths, Tailwind v4, and icon libraries
when-to-use: Setting up project structure, customizing component aliases, configuring theme
keywords: components.json, tailwind, aliases, theme, css-variables
priority: high
requires: installation.md
related: button.md, input.md, card.md
---

# shadcn/ui Configuration

## components.json (SOLID Paths)

Place at project root: `/components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc: false,
  "tsx": true,
  "aliasPrefix": "@",
  "aliases": {
    "components": "@/modules/cores/shadcn/components",
    "utils": "@/modules/cores/lib/utils"
  }
}
```

### What Each Field Does

| Field | Value | Purpose |
|-------|-------|---------|
| `$schema` | URL | Schema validation |
| `style` | `new-york` \| `default` | Component design system |
| `rsc: false` | React Server Components support |
| `tsx` | `true` | Use TypeScript |
| `aliasPrefix` | `@` | Path alias prefix |
| `aliases.components` | SOLID path | Where UI components live |
| `aliases.utils` | SOLID path | Where `cn()` util lives |

## Directory Structure

After installation, your project should have:

```
project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/
│   └── modules/
│       └── cores/
│           ├── shadcn/
│           │   └── components/
│           │       ├── ui/
│           │       │   ├── button.tsx
│           │       │   ├── input.tsx
│           │       │   ├── card.tsx
│           │       │   ├── label.tsx
│           │       │   └── ... (other components)
│           │       └── index.ts
│           └── lib/
│               └── utils.ts
├── components.json
├── tsconfig.json
└── tailwind.config.ts
```

## Tailwind CSS v4 Integration

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/modules/cores/shadcn/*": ["./src/modules/cores/shadcn/*"],
      "@/modules/cores/lib/*": ["./src/modules/cores/lib/*"]
    }
  }
}
```

### app/globals.css (Tailwind v4)

With Tailwind v4, NO config file is needed. Only manage CSS:

```css
@import "tailwindcss";

/* Base layer for default element styles */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}

/* Component layer for custom component styles */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-primary-foreground rounded-md;
  }
}
```

### CSS Variables (Theme Colors)

shadcn/ui uses CSS variables in `app/globals.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 89.5%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 9%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 89.5%;
    --input: 0 0% 89.5%;
    --ring: 0 0% 9%;
  }

  .dark {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    /* ... dark mode vars ... */
  }
}
```

## Icon Library Setup

### Install lucide-react

```bash
bun add lucide-react
```

### Create Icon Wrapper (Optional)

Create `src/modules/cores/shadcn/components/icons.tsx`:

```typescript
/**
 * Icon components from lucide-react
 * Centralized import for consistency
 */

export {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Loader,
  Trash2,
  Plus,
  Minus,
  Check,
  X,
  Menu,
  Home,
  Settings,
  LogOut,
  type LucideProps,
} from 'lucide-react'
```

### Usage

```typescript
import { AlertCircle, Copy } from '@/modules/cores/shadcn/components/icons'

export function HeaderWithIcon() {
  return (
    <div className="flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <button aria-label="Copy">
        <Copy className="w-4 h-4" />
      </button>
    </div>
  )
}
```

## Component Registration

When you run:

```bash
bunx shadcn-ui@latest add button
```

The CLI automatically:
1. Creates `@/modules/cores/shadcn/components/ui/button.tsx`
2. Adds dependency to `package.json`
3. Updates TypeScript paths

### Manual Component Install

If CLI doesn't work, manually add to `components.json`:

```json
{
  "aliases": {
    "components": "@/modules/cores/shadcn/components"
  }
}
```

Then copy the component file from [shadcn/ui registry](https://ui.shadcn.com/).

## Customization: Dark Mode

Enable dark mode in `app/layout.tsx`:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
```

Or use `next-themes`:

```bash
bun add next-themes
```

```typescript
'use client'

import { ThemeProvider } from 'next-themes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Verification Checklist

- [ ] `components.json` in project root
- [ ] Aliases point to `@/modules/cores/shadcn/*`
- [ ] `tsconfig.json` has path mapping for `@/*`
- [ ] `app/globals.css` imports tailwindcss
- [ ] CSS variables defined for theme colors
- [ ] At least one component installed (e.g., button)
- [ ] `lucide-react` installed for icons
- [ ] Components render without errors

## Common Issues

### Issue: "Cannot find module '@/modules/cores/shadcn/components/ui/button'"

**Solution**: Check that:
1. Directory structure matches `components.json` aliases
2. Component file exists at path
3. Run `bunx shadcn-ui@latest add button` to reinstall

### Issue: Tailwind classes not applying

**Solution**:
1. Verify `app/globals.css` has `@import "tailwindcss"`
2. Check CSS variables are set in `:root`
3. Clear `.next` cache: `rm -rf .next && bun dev`

### Issue: Icons not found

**Solution**:
1. Install lucide: `bun add lucide-react`
2. Check import path: `import { IconName } from 'lucide-react'`
3. Verify icon exists: [lucide-react icons](https://lucide.dev/)

## Next Steps

- [Button Component](button.md) - All variants and patterns
- [Input Component](input.md) - Forms and validation
- [Card Component](card.md) - Layout patterns
