# FusEngine Claude Code Plugins

A collection of professional Claude Code plugins for enhanced development workflows.

## Installation

```bash
# Add this marketplace
/plugin marketplace add fusengine/claude-plugins

# Or from local path
/plugin marketplace add /path/to/claude-plugins
```

## Available Plugins

| Plugin | Version | Description |
|--------|---------|-------------|
| [commit-pro](./commit-pro) | 1.2.1 | Professional git commits with auto-detection |
| [laravel-expert](./laravel-expert) | 1.1.0 | Expert Laravel 12 + PHP 8.5 with SOLID |
| [nextjs-expert](./nextjs-expert) | 1.0.0 | Expert Next.js 16 + React 19 with modular architecture |
| [swift-apple-expert](./swift-apple-expert) | 1.0.0 | Expert Swift 6 + SwiftUI for Apple platforms |

## Plugins

### commit-pro

Professional git commits following Conventional Commits standard.

**Features:**
- Smart auto-detection of commit type
- Security validation (blocks secrets)
- No AI signature in commits

```bash
/plugin install commit-pro@fusengine-plugins
```

### laravel-expert

Expert Laravel 12 development with comprehensive SOLID principles.

**Features:**
- SOLID PHP architecture (files < 100 lines)
- Codebase analysis before coding
- DRY - reuse before creating
- Eloquent, Livewire, Blade, API skills
- Context7 + Exa research integration

```bash
/plugin install laravel-expert@fusengine-plugins
```

### nextjs-expert

Expert Next.js 16 development with modular architecture.

**Features:**
- SOLID Next.js with modular structure (`modules/cores/`, `modules/[feature]/`)
- Codebase analysis before coding
- DRY - reuse before creating
- App Router, Server Components, Prisma 7, Better Auth
- Context7 + Exa research integration

```bash
/plugin install nextjs-expert@fusengine-plugins
```

### swift-apple-expert

Expert Swift 6 + SwiftUI for all Apple platforms.

**Features:**
- SOLID Swift with Apple 2025 best practices
- Codebase analysis before coding
- DRY - reuse before creating
- @Observable, actors, #Preview, String Catalogs
- iOS, macOS, iPadOS, watchOS, visionOS support

```bash
/plugin install swift-apple-expert@fusengine-plugins
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
