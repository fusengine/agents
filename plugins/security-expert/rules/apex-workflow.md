---
description: Security-specific APEX workflow adaptation
alwaysApply: true
---

# Security APEX Workflow

## 5-Phase Security Audit

```
DETECT → RESEARCH → SCAN → REPORT → FIX
```

### Phase Mapping to APEX

| Security Phase | APEX Phase | Agent/Tool |
|---------------|------------|------------|
| DETECT | Analyze | explore-codebase |
| RESEARCH | Analyze | research-expert + Exa |
| SCAN | Execute | security-scan.sh + Grep |
| REPORT | eLicit | Sequential Thinking |
| FIX | eXamine | sniper |

### Mandatory Rules

1. **NEVER skip DETECT** - Wrong language = wrong patterns
2. **ALWAYS research CVEs** before scanning
3. **SCAN all categories** - XSS, SQLi, RCE, SSRF, secrets
4. **REPORT with OWASP mapping** - Every finding has a category
5. **FIX via sniper** - Never fix inline without validation

### Severity Handling

| Severity | Action | Deadline |
|----------|--------|----------|
| CRITICAL | Fix immediately, block deployment | Same session |
| HIGH | Fix before merge | Same session |
| MEDIUM | Fix if time permits | Next session |
| LOW | Document for backlog | Tracked |

### Integration with Main APEX

When used within the main APEX workflow:
- Security scan runs during **eXamine** phase
- Findings feed into sniper's validation
- CRITICAL/HIGH block the workflow until fixed
