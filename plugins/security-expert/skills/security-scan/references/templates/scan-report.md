---
name: scan-report
description: Complete template for structured security scan reports with OWASP mapping
keywords: report, template, findings, severity, owasp
---

# Security Scan Report Template

## Header

```
# Security Scan Report
**Project**: {project_name}
**Date**: {date}
**Language**: {language}
**Framework**: {framework}
```

## Executive Summary

```
## Summary
| Severity | Count |
|----------|-------|
| CRITICAL | {critical_count} |
| HIGH     | {high_count} |
| MEDIUM   | {medium_count} |
| LOW      | {low_count} |
| **Total** | **{total_count}** |
```

## Findings Section

```
## Findings

### [CRITICAL] {finding_title}
- **File**: `{file_path}:{line_number}`
- **Category**: {owasp_category}
- **Pattern**: `{matched_pattern}`
- **Description**: {description}
- **Remediation**: {fix_instructions}
```

## Dependency Audit Section

```
## Dependency Audit
| Package | Current | Patched | Severity | Advisory |
|---------|---------|---------|----------|----------|
| {pkg}   | {ver}   | {fix}   | {sev}    | {url}    |
```

## Recommendations

```
## Recommendations
1. Fix all CRITICAL findings immediately
2. Update vulnerable dependencies
3. Add security headers (CSP, HSTS)
4. Review authentication patterns
5. Enable audit logging
```
