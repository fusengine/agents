# APEX Agents Plugin

Collection of specialized agents for the APEX workflow (Analyze → Plan → Execute → eXamine).

## APEX Skill (Auto-detection)

The `/apex` skill automatically detects the project type and loads framework-specific references:

| Config Detected | Framework | Loaded References |
|-----------------|-----------|---------------------|
| `composer.json` + `artisan` | Laravel | `references/laravel/*.md` |
| `next.config.*` | Next.js | `references/nextjs/*.md` |
| `package.json` (react) | React | `references/react/*.md` |
| `Package.swift`, `*.xcodeproj` | Swift | `references/swift/*.md` |

### APEX Phases (00-09)

1. `00-init-branch` - Create branch, verify git status
2. `01-analyze` - Explore codebase, existing patterns
3. `02-features-plan` - TaskCreate, estimate files <100 lines
4. `03-execution` - SOLID implementation, separated interfaces
5. `04-validation` - Linters, type-check, build
6. `05-review` - Self-review, quality checklist
7. `06-fix-issue` - Fix issues found
8. `07-add-test` - Unit and integration tests
9. `08-check-test` - Test execution and coverage
10. `09-create-pr` - Pull request with description

## Included Agents

### Code Quality
- **sniper** - Error detection and correction, SOLID validation, linters
- **sniper-faster** - Fast and silent modifications

### Research
- **research-expert** - Technical research (Context7, Exa, Sequential Thinking)
- **websearch** - Fast web search with sources

### SEO
- **seo-expert** - SEO/SEA/GEO 2026, Local SEO, anti-cannibalization, AI optimization

### Exploration
- **explore-codebase** - Discovery and architecture analysis

## Skills by Domain

- `apex/` - APEX methodology with framework-specific references
- `code-quality/` - Linting patterns, SOLID, architecture
- `research/` - Research methodologies
- `seo/` - SEO/SEA/GEO/Local SEO guidelines
- `exploration/` - Exploration techniques

## Usage

```bash
# APEX Skill (recommended for any development task)
/apex

# Individual agents
> Use sniper to fix all TypeScript errors
> Use research-expert to find Next.js 16 documentation
> Use explore-codebase to understand the project structure
```

## APEX Workflow

1. **A**nalyze - `explore-codebase` + `research-expert` in parallel
2. **P**lan - `TaskCreate` for planning, files <100 lines
3. **E**xecute - Specialized agents, SOLID, separated interfaces
4. **e**Xamine - `sniper` for final validation (MANDATORY)
