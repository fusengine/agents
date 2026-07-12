---
name: exploration
description: Codebase exploration techniques for rapid discovery, architecture analysis, pattern detection, and dependency mapping.
argument-hint: "[directory] [--thorough]"
context: fork
agent: fuse-ai-pilot:explore-codebase
user-invocable: false
---

**Session:** ${CLAUDE_SESSION_ID}

# Exploration Skill

## Exploration Protocol

Run these 5 phases in order — full commands in `references/exploration-protocol.md`:

1. **Initial Reconnaissance** — list root files, find config files, check common entry points
2. **Structure Mapping** — tree view (excluding noise dirs), identify main directories
3. **Entry Points Detection** — grep for `main`/`index`/server bootstrap per language
4. **Dependency Analysis** — read `package.json`/`pyproject.toml`/`go.mod`/`Cargo.toml`/`composer.json`
5. **Pattern Detection** — check for MVC, Clean/Hexagonal, feature-based, Next.js App Router directories

---

## Architecture Pattern Detection

### Pattern Indicators

| Pattern | Key Directories | Indicators |
|---------|-----------------|------------|
| **MVC** | `controllers/`, `models/`, `views/` | Rails, Laravel, Express |
| **Clean Architecture** | `domain/`, `application/`, `infrastructure/` | DDD, Use cases |
| **Hexagonal** | `adapters/`, `ports/`, `core/` | Ports & adapters |
| **Feature-based** | `features/[name]/` | All layers per feature |
| **Layered** | `presentation/`, `business/`, `data/` | Traditional 3-tier |
| **Monolith** | Single `src/` | Mixed concerns |
| **Microservices** | Multiple `services/` | Separate repos/folders |
| **Next.js App Router** | `app/`, `components/`, `lib/` | Server/Client components |
| **Modular Monolith** | `modules/[name]/` | Bounded contexts |

---

## Forbidden Behaviors

- ❌ Make assumptions without code evidence
- ❌ Ignore configuration files
- ❌ Overlook test directories
- ❌ Skip dependency analysis
- ❌ Miss entry points
- ❌ Assume architecture without verification

## Behavioral Traits

- Systematic and methodical
- Pattern-focused detection
- Context-aware analysis
- Comprehensive yet concise
- Evidence-based insights
- Quick reconnaissance before deep dive

---

## Detailed References (Load on Demand)

- `references/exploration-protocol.md` — Load when running the 5-phase protocol (exact shell commands per phase)
- `references/tech-stack-detection.md` — Load when identifying framework/ORM/tooling per language (JS/TS, Python, Go, PHP, Rust)
- `references/code-organization-checks.md` — Load when auditing interface separation, business-logic location, or state management
- `references/response-format.md` — Load when writing the final exploration report
- `references/quick-analysis-commands.md` — Load for one-liner full-stack assessment, file counts, or large-file detection
