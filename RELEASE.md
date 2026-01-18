# Release Notes

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
