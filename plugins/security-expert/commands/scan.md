---
description: Launch a comprehensive security audit on the current project. Detects vulnerabilities, scans dependencies, checks OWASP Top 10, and generates a structured report.
argument-hint: "[--full] [--deps-only] [--headers] [--auth] [path]"
disable-model-invocation: false
---

# Security Scan

Execute a comprehensive security audit following the 5-phase workflow.

## Usage

- `/scan` - Full security audit of current project
- `/scan --deps-only` - Dependency audit only
- `/scan --headers` - Security headers check only
- `/scan --auth` - Authentication patterns audit only
- `/scan path/to/dir` - Scan specific directory

## Workflow

### Phase 1: DETECT
Identify project language and framework automatically:
- Scan for marker files (package.json, composer.json, etc.)
- Detect framework versions and dependencies
- Map to appropriate scan patterns

### Phase 2: RESEARCH
Query recent CVEs for the detected stack:
- Use Exa to search NVD, OSV.dev, GitHub Advisory
- Focus on dependencies found in project
- Check for known exploits

### Phase 3: SCAN
Run vulnerability patterns and dependency audit:
- Execute language-specific grep patterns (OWASP Top 10)
- Run `security-scan.sh` for automated pattern matching
- Execute dependency audit CLI (npm audit, composer audit, etc.)
- Detect hardcoded secrets and credentials

### Phase 4: REPORT
Generate structured vulnerability report:
- Categorize by severity: CRITICAL, HIGH, MEDIUM, LOW
- Map findings to OWASP A01-A10 categories
- Include file:line references and fix instructions

### Phase 5: FIX
Delegate corrections to sniper agent:
- Generate fix instructions per vulnerability
- Invoke sniper with precise file:line + description
- Validate all fixes applied correctly

## Arguments

- `$ARGUMENTS` specifies scan options and target path

## Examples

- `/scan` → Full OWASP + dependency + secrets audit
- `/scan --deps-only` → Quick dependency vulnerability check
- `/scan --auth` → JWT/OAuth/session security patterns
- `/scan src/api/` → Scan only API directory
