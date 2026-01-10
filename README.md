# Fusengine Claude Code Plugins

A collection of professional Claude Code plugins for enhanced development workflows.

## Installation

```bash
# Add this marketplace
/plugin marketplace add fusengine/claude-code-plugins

# Or from local path
/plugin marketplace add /path/to/claude-code-plugins
```

## Available Plugins

| Plugin | Version | Description |
|--------|---------|-------------|
| [fuse:commit-pro](./commit-pro) | 1.2.1 | Professional git commits with auto-detection |
| [fuse:laravel](./laravel-expert) | 1.1.0 | Expert Laravel 12 + PHP 8.5 with SOLID |
| [fuse:nextjs](./nextjs-expert) | 1.0.0 | Expert Next.js 16 + React 19 with modular architecture |
| [fuse:swift-apple-expert](./swift-apple-expert) | 1.0.0 | Expert Swift 6 + SwiftUI for Apple platforms |
| [fuse:solid](./apex-solid) | 1.0.0 | SOLID enforcement with auto-detection hooks |
| [fuse:ai-pilot](./ai-pilot) | 1.0.0 | AI Pilot agents: sniper, research, explore, experts |

## Plugins

### fuse:commit-pro

Professional git commits following Conventional Commits standard.

**Features:**
- Smart auto-detection of commit type
- Security validation (blocks secrets)
- No AI signature in commits

```bash
/plugin install fuse:commit-pro@fusengine-plugins
```

### fuse:laravel

Expert Laravel 12 development with comprehensive SOLID principles.

**Features:**
- SOLID PHP architecture (files < 100 lines)
- Codebase analysis before coding
- DRY - reuse before creating
- Eloquent, Livewire, Blade, API skills
- Context7 + Exa research integration

```bash
/plugin install fuse:laravel@fusengine-plugins
```

### fuse:nextjs

Expert Next.js 16 development with modular architecture.

**Features:**
- SOLID Next.js with modular structure (`modules/cores/`, `modules/[feature]/`)
- Codebase analysis before coding
- DRY - reuse before creating
- App Router, Server Components, Prisma 7, Better Auth
- Context7 + Exa research integration

```bash
/plugin install fuse:nextjs@fusengine-plugins
```

### fuse:swift-apple-expert

Expert Swift 6 + SwiftUI for all Apple platforms.

**Features:**
- SOLID Swift with Apple 2025 best practices
- Codebase analysis before coding
- DRY - reuse before creating
- @Observable, actors, #Preview, String Catalogs
- iOS, macOS, iPadOS, watchOS, visionOS support

```bash
/plugin install fuse:swift-apple-expert@fusengine-plugins
```

### fuse:solid

SOLID principles enforcement with automatic hooks.

**Features:**

- Auto-detects project type (Next.js, Laravel, Swift, Go, Python, Rust)
- Blocks interfaces in wrong locations (PreToolUse hook)
- Warns on file size violations (PostToolUse hook)
- Works with all expert plugins

**Hooks:**
| Hook | Action |
|------|--------|
| SessionStart | Detect project type |
| PreToolUse | Validate interface locations |
| PostToolUse | Check file size limits |

```bash
/plugin install fuse:solid@fusengine-plugins
```

### fuse:ai-pilot

Collection of specialized agents for AI-assisted development workflows.

**Agents:**
- **sniper** - Code quality expert, zero-error tolerance
- **sniper-faster** - Rapid modifications, minimal output
- **research-expert** - Context7 + Exa documentation research
- **explore-codebase** - Comprehensive codebase discovery
- **seo-expert** - SEO/SEA/GEO 2025 optimization
- **websearch** - Quick web research with Exa

```bash
/plugin install fuse:ai-pilot@fusengine-plugins
```

---

## Common Features (All Expert Plugins)

All expert plugins share these capabilities:

1. **Research Before Coding** - Context7 + Exa documentation lookup
2. **Codebase Analysis** - Understand architecture before implementing
3. **DRY Enforcement** - Reuse existing code, extract shared helpers
4. **SOLID Principles** - Files < 100-150 lines, interfaces separated
5. **Documentation** - PHPDoc/JSDoc/Swift docs mandatory

## License

MIT
