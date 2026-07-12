---
name: exploration-protocol
description: Full 5-phase exploration protocol with exact shell commands per phase
---

# Exploration Protocol

## Phase 1: Initial Reconnaissance

```bash
# List root files
ls -la

# Find config files
find . -maxdepth 2 -name "package.json" -o -name "*.config.*" -o -name "pyproject.toml" -o -name "go.mod" -o -name "Cargo.toml" 2>/dev/null

# Check for common entry points
ls -la src/ app/ lib/ cmd/ 2>/dev/null
```

## Phase 2: Structure Mapping

```bash
# Tree view (excluding common noise)
tree -L 3 -I 'node_modules|dist|build|.git|__pycache__|.next|target|vendor' 2>/dev/null || find . -type d -maxdepth 3 | head -50

# Identify main directories
ls -la src/ lib/ app/ internal/ pkg/ 2>/dev/null
```

## Phase 3: Entry Points Detection

```bash
# JavaScript/TypeScript
grep -rn "main\|index\|app.listen\|createServer\|export default" --include="*.{js,ts,jsx,tsx}" | head -20

# Python
grep -rn "if __name__\|main()\|app.run\|uvicorn" --include="*.py" | head -20

# Go
grep -rn "func main\|http.ListenAndServe" --include="*.go" | head -20

# Rust
grep -rn "fn main" --include="*.rs" | head -10
```

## Phase 4: Dependency Analysis

```bash
# Node.js
cat package.json 2>/dev/null | head -50

# Python
cat pyproject.toml requirements.txt setup.py 2>/dev/null | head -50

# Go
cat go.mod 2>/dev/null

# Rust
cat Cargo.toml 2>/dev/null | head -50

# PHP
cat composer.json 2>/dev/null | head -50
```

## Phase 5: Pattern Detection

**Search for architectural patterns**:

```bash
# MVC patterns
ls -la controllers/ models/ views/ routes/ 2>/dev/null

# Clean/Hexagonal Architecture
ls -la domain/ application/ infrastructure/ interfaces/ adapters/ ports/ 2>/dev/null

# Feature-based
ls -la features/ modules/ 2>/dev/null

# Next.js App Router
ls -la app/ pages/ components/ 2>/dev/null
```
