# Astro Project Architecture

## Standard SOLID Directory Structure

```text
src/
├── components/              # Reusable UI components (< 60 lines each)
│   ├── common/              # Shared across features (Button, Card, etc.)
│   ├── home/                # Home page sections
│   ├── blog/                # Blog-specific components
│   └── nav/                 # Navigation components
│
├── layouts/                 # Page layout wrappers (< 80 lines each)
│   ├── BaseLayout.astro     # Root HTML layout
│   ├── BlogLayout.astro     # Blog post layout
│   └── DocsLayout.astro     # Documentation layout
│
├── pages/                   # Route definitions (< 50 lines each)
│   ├── index.astro
│   ├── about.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── [locale]/            # i18n routes (if applicable)
│
├── lib/                     # Shared utilities and data services
│   ├── blog.ts              # Blog data fetching
│   ├── utils.ts             # Shared helpers
│   └── i18n/                # i18n utilities (if applicable)
│
├── interfaces/              # TypeScript types (ALL types here)
│   ├── content.interface.ts
│   ├── component.interface.ts
│   └── api.interface.ts
│
├── content/                 # Content collections
│   ├── config.ts            # Collection schemas
│   ├── blog/                # Blog posts
│   └── docs/                # Documentation
│
└── styles/                  # Global styles
    ├── global.css
    └── _variables.css
```

## Data Flow

```
Pages (composition)
  └── Components (UI)
        └── Layouts (structure)
              └── lib/ (data services)
                    └── content/ or API
```

## Module Boundaries

| Boundary | Rule |
|----------|------|
| Pages → Components | OK |
| Components → lib/ | OK |
| Components → Components | OK (only for composition) |
| Pages → lib/ | OK |
| lib/ → lib/ | OK |
| Components → Pages | FORBIDDEN |
| lib/ → Components | FORBIDDEN |
| Pages → Content directly | FORBIDDEN (use lib/) |

## Naming Conventions

- Components: `PascalCase.astro` (e.g., `BlogCard.astro`)
- Pages: `kebab-case.astro` (e.g., `getting-started.astro`)
- Services: `camelCase.ts` (e.g., `blogService.ts` or `blog.ts`)
- Interfaces: `camelCase.interface.ts` (e.g., `content.interface.ts`)
- Styles: `kebab-case.css` (e.g., `global.css`)
