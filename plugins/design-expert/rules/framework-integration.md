# Framework Integration Rules (MANDATORY)

After generating UI with Gemini Design, ALWAYS delegate to framework expert.

## Detection → Delegation

| Project Files | Framework | Delegate To | Skills to Validate |
|---------------|-----------|-------------|-------------------|
| `next.config.*`, `app/layout.tsx` | Next.js | `fuse-nextjs:nextjs-expert` | solid-nextjs, nextjs-16 |
| `package.json` + React (no Next) | React | `fuse-react:react-expert` | solid-react, react-19 |
| `composer.json` + `artisan` | Laravel | `fuse-laravel:laravel-expert` | solid-php |
| `tailwind.config.*` only | Tailwind | `fuse-tailwindcss:tailwindcss-expert` | tailwindcss-v4 |

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
