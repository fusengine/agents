# Framework Integration Rules (MANDATORY)

After generating UI with Gemini Design, ALWAYS delegate to framework expert.

## Detection → Delegation

| Project Files | Framework | UI Approach | Delegate To | Skills to Validate |
|---------------|-----------|-------------|-------------|-------------------|
| `next.config.*`, `app/layout.tsx` | Next.js | Gemini Design + shadcn | `fuse-nextjs:nextjs-expert` | solid-nextjs, nextjs-16 |
| `package.json` + React (no Next) | React SPA | Gemini Design + shadcn | `fuse-react:react-expert` | solid-react, react-19 |
| `composer.json` + `artisan` + Inertia + React | Laravel+Inertia | Gemini Design + shadcn | `fuse-laravel:laravel-expert` | solid-php |
| `composer.json` + `artisan` (no Inertia) | Laravel Blade | Visual specs → Livewire Flux | `fuse-laravel:laravel-expert` | solid-php |
| `Package.swift`, `*.xcodeproj` | Swift/Apple | Visual specs → SwiftUI (Apple HIG) | `fuse-swift-apple-expert:swift-expert` | swift-apple |
| `tailwind.config.*` only | Tailwind only | CSS specs | `fuse-tailwindcss:tailwindcss-expert` | tailwindcss-v4 |

## Integration Workflow

```
1. design-expert generates UI via Gemini Design
   ↓
2. Check project framework (next.config.*, package.json, etc.)
   ↓
3. Launch framework expert Task for:
   - SOLID validation (file size < 100 lines, interfaces location)
   - Framework patterns (App Router, Server Components, hooks)
   - Integration (Better Auth, Prisma, TanStack Form)
   ↓
4. sniper validates final code
```

## Delegation Command

```
Task: fuse-nextjs:nextjs-expert
Prompt: "Validate this generated component for:
1. solid-nextjs compliance (file size, interfaces)
2. Next.js 16 patterns (App Router, Server Components)
3. Integration patterns (imports, data fetching)"
```

## Non-React Stacks: Visual Spec Workflow

When project is NOT React-based, design-expert produces:
1. `design-system.md` (identity tokens)
2. Visual specs (layout, components, animations)
3. Delegates IMPLEMENTATION to domain expert

The domain expert receives:
- Layout structure (zones, grid, responsive)
- Component mapping (which UI lib components to use)
- Animation specs (what to animate, durations)
- Design tokens (colors, fonts, spacing)

## Laravel Blade → Livewire Flux Components

| shadcn Component | Livewire Flux Equivalent |
|---|---|
| Button | `flux:button` |
| Card | `flux:card` |
| Input | `flux:input` |
| Dialog | `flux:modal` |
| Select | `flux:select` |
| Table | `flux:table` |
| Tabs | `flux:tabs` |
| Dropdown | `flux:dropdown` |

## Swift → SwiftUI Components

| Web Concept | SwiftUI Equivalent |
|---|---|
| Card | `GroupBox` / custom `View` |
| Button | `Button` with `.buttonStyle` |
| Navigation | `NavigationSplitView` |
| Modal | `.sheet` / `.fullScreenCover` |
| Toast | `.alert` / custom overlay |
| Form | `Form` with `Section` |
| List/Table | `List` / `Table` |
| Tabs | `TabView` |

## Responsibility Split

| Phase | design-expert | framework-expert |
|-------|---------------|------------------|
| UI Generation | ✅ Gemini Design | - |
| Anti-AI-Slop | ✅ Rules applied | - |
| Framer Motion | ✅ Animations | - |
| SOLID compliance | - | ✅ File splitting |
| Framework patterns | - | ✅ App Router, hooks |
| Data integration | - | ✅ Prisma, Auth |
| Final validation | - | ✅ sniper |
