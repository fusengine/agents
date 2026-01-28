# fuse-solid

SOLID principles orchestrator for multi-language projects.

## Agents

| Agent | Description |
|-------|-------------|
| `solid-orchestrator` | Detects project type, applies rules |

## Skills

| Skill | Description |
|-------|-------------|
| `solid-detection` | Multi-language detection rules |

## Project Detection

| Config File | Language | Rules |
|-------------|----------|-------|
| `next.config.*` | TypeScript | solid-nextjs |
| `composer.json` | PHP | solid-php |
| `Package.swift` | Swift | solid-swift |
| `package.json` + React | TypeScript | solid-react |

## Universal Rules

1. **Single Responsibility** - One reason to change
2. **Open/Closed** - Open for extension, closed for modification
3. **Liskov Substitution** - Subtypes must be substitutable
4. **Interface Segregation** - Many specific interfaces
5. **Dependency Inversion** - Depend on abstractions

## File Size Limits

| Language | Max Lines | Split At |
|----------|-----------|----------|
| TypeScript | 100 | 90 |
| PHP | 100 | 90 |
| Swift | 100 (150 Views) | 90 |

## Interface Locations

| Framework | Location |
|-----------|----------|
| Next.js/React | `src/interfaces/` |
| Laravel | `app/Contracts/` |
| Swift | `Protocols/` |
