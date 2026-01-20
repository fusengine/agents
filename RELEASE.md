# Release Notes

## [1.5.5] - 20-01-2026

### Added

- **APEX Methodology Skill** with framework auto-detection
  - `skills/apex/SKILL.md`: Main skill with YAML frontmatter, auto-detection logic
  - 10 generic reference phases (00-09): init-branch through create-pr
  - Language-agnostic with multi-language tables (TypeScript, PHP, Swift, Go, Python)

- **Framework-Specific References** (40 files)
  - `references/laravel/`: Laravel 12 + PHP 8.5 (Larastan, Pint, PHPUnit, Pest)
  - `references/nextjs/`: Next.js 16 + React 19 (ESLint, Vitest, App Router)
  - `references/react/`: React 19 + TanStack (ESLint, Vitest, Testing Library)
  - `references/swift/`: Swift 6 + SwiftUI (SwiftLint, XCTest, @Observable)

- **Auto-Detection System**
  - `composer.json` + `artisan` → Laravel references
  - `next.config.*` → Next.js references
  - `package.json` (react) → React references
  - `Package.swift`, `*.xcodeproj` → Swift references

### Changed

- Updated marketplace.json with apex skill
- Updated README.md with auto-detection documentation
- Updated plugins/ai-pilot/README.md with APEX phases (00-09)

## [1.5.4] - 18-01-2026

### Added

- **Complete SEO/GEO 2026 Documentation** (40 files)
  - `01-seo-foundations/`: Current date awareness, research workflow, SEO vs GEO paradigm
  - `02-onpage-seo/`: Meta tags, Open Graph (Facebook/LinkedIn), Twitter Cards, H1-H6, alt text
  - `03-schema-org/`: 9 schema types (Article, FAQ, Product, LocalBusiness, Organization, Person, Breadcrumb, HowTo, Review)
  - `04-geo-2026/`: AI platforms (ChatGPT, Gemini, Claude, Perplexity, Copilot), citation strategies (Princeton 10 tactics), zero-click optimization
  - `05-technical-seo/`: Core Web Vitals (LCP, INP, CLS), mobile-first, crawlability
  - `06-content-strategy/`: E-E-A-T 2026, anti-cannibalization, AI content guidelines
  - `07-sea-google-ads/`: Quality Score, landing pages, ad extensions
  - `08-measurement/`: GEO tracking tools (OmniSEO, Otterly.ai, Rankscale), Share of Model
  - `09-checklists/`: Pre-publication, technical audit, GEO compliance

- **Swift MCP Tools Integration** (3 files)
  - `mcp-tools/xcode-build-mcp.md`: XcodeBuildMCP documentation (build, clean, create projects)
  - `mcp-tools/apple-docs-mcp.md`: Apple Docs MCP with WWDC 2014-2025 offline access
  - `mcp-tools/SKILL.md`: MCP tools index and workflow integration

### Changed

- **seo-expert agent**: Updated to 2026 standards with GEO integration, Open Graph, Twitter Cards, complete schema coverage
- **swift-expert agent**: Added MCP tools (`mcp__XcodeBuildMCP__*`, `mcp__apple-docs__*`), research priority (Apple Docs MCP > Context7)
- **solid-swift skill**: Updated workflow with Apple Docs MCP as PRIMARY source, XcodeBuildMCP build validation
- **Model corrections**: Fixed model from opus to sonnet in design-expert, laravel-expert, nextjs-expert, react-expert agents

## [1.5.3] - 18-01-2026

### Added

- **Anti-AI Slop System** for design-expert
  - `references/typography.md` - Fonts FORBIDDEN/APPROVED list
  - `references/color-system.md` - CSS variables, IDE-inspired palettes
  - `references/motion-patterns.md` - Orchestrated animations, hover states
  - `references/theme-presets.md` - Brutalist, Solarpunk, Editorial, Cyberpunk, Luxury
- **4-Pillar Framework** in design-expert agent (Typography, Colors, Motion, Backgrounds)
- **Theme Presets** with implementation examples
- **Step 0** in generating-components workflow (MANDATORY read anti-AI slop refs)
- Border-left colored indicators prohibition in all design agents

### Changed

- Optimized design-expert.md from 305 lines to 131 lines (following Anthropic best practices)
- Moved detailed examples to reference files
- Updated generating-components SKILL.md with 7-step workflow
- Added anti-AI slop rules to react-expert and tailwindcss-expert agents
- Updated marketplace.json to v1.5.3

## [1.5.2] - 18-01-2026

### Changed
- **Major refactor of design-expert agent** - No more generic AI aesthetics
- Added MANDATORY WORKFLOW (search 21st.dev BEFORE coding)
- Added DESIGN THINKING section (purpose, tone, differentiation)
- Added FORBIDDEN patterns (Generic AI Slop, empty heroes, flat cards)
- Integrated frontend-design skill principles (bold aesthetics, distinctive fonts)
- Refactored generating-components skill (strict workflow, forbidden patterns)
- Refactored adding-animations skill (MANDATORY Framer Motion)

## [1.5.1] - 18-01-2026

### Added
- Color pink to design-expert agent
- Emoji icons prohibition (use Lucide React / Blade Icons only)
- Semantic versioning rules in commit commands

### Changed
- Updated marketplace.json to v1.5.1

## [1.5.0] - 18-01-2026

### Added
- Mandatory skills usage enforcement for nextjs-expert, react-expert, laravel-expert
- Task-to-skill mapping tables in agent definitions
- 4-step workflow: identify domain → load skill → follow docs → code

### Changed
- Updated marketplace.json to v1.5.0

## [1.4.0] - 17-01-2026

### Added
- fuse-design plugin (Expert UI/UX design for React/Next.js)
- design-expert agent with shadcn/ui, 21st.dev, Tailwind CSS
- generating-components skill (component generation with 21st.dev)
- designing-systems skill (design tokens, color palettes, typography)
- validating-accessibility skill (WCAG 2.2 Level AA)
- adding-animations skill (Framer Motion micro-interactions)
- /design command (5-phase workflow: Discover → Design → Build → Animate → Validate)

### Changed
- Updated marketplace.json to v1.4.0 (9 plugins, 14 agents, 64 skills)
- Updated README.md and docs with fuse-design documentation

## [1.3.0] - 17-01-2026

### Added
- laravel-i18n skill (localization with SOLID architecture)
- laravel-permission skill (Spatie Laravel Permission for RBAC)
- nextjs-i18n skill (Next.js 16 with proxy.ts, SOLID architecture)
- react-i18n skill (react-i18next with SOLID architecture)

### Changed
- Updated marketplace.json to v1.3.0
- Updated README.md (60 skills)
- Updated agents with new i18n skills
