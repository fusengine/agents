---
name: audit-commands
description: Dependency audit CLI commands for npm, composer, pip, cargo, go, swift, ruby
when-to-use: When running dependency vulnerability checks on a project
keywords: npm-audit, composer-audit, pip-audit, cargo-audit, govulncheck
priority: high
related: templates/audit-report.md
---

# Audit Commands by Ecosystem

## Node.js

```bash
# npm
npm audit --json
npm audit fix          # Auto-fix safe updates
npm audit fix --force  # Force major updates (risky)

# yarn
yarn audit --json
yarn audit --groups dependencies

# pnpm
pnpm audit --json

# bun
bun audit
```

## PHP

```bash
# Composer
composer audit --format=json
composer audit --locked  # Check lock file only
```

## Python

```bash
# pip-audit (recommended)
pip-audit --format=json
pip-audit -r requirements.txt

# safety
safety check --json
safety check -r requirements.txt
```

## Rust

```bash
# cargo-audit
cargo audit --json
cargo audit fix        # Auto-fix
cargo audit --deny warnings
```

## Go

```bash
# govulncheck (official)
govulncheck -json ./...
govulncheck -mode=binary ./cmd/app
```

## Swift / CocoaPods

```bash
# CocoaPods
pod audit
pod outdated

# Swift Package Manager (manual)
# Check Package.resolved against OSV.dev
```

## Ruby

```bash
# bundler-audit
bundle audit check --format=json
bundle audit update    # Update advisory DB
```

## Common Flags

| Flag | Purpose |
|------|---------|
| `--json` | Machine-readable output |
| `--fix` | Auto-apply safe fixes |
| `--production` | Skip devDependencies |
