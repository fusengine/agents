---
name: audit-report
description: Complete template for dependency audit reports with vulnerability details
keywords: report, dependency, vulnerability, advisory, template
---

# Dependency Audit Report

## Header

```
# Dependency Audit Report
**Project**: {project_name}
**Ecosystem**: {ecosystem}
**Date**: {date}
**Total Dependencies**: {dep_count}
```

## Summary

```
## Vulnerability Summary
| Severity | Count |
|----------|-------|
| CRITICAL | {critical} |
| HIGH     | {high} |
| MEDIUM   | {medium} |
| LOW      | {low} |
```

## Vulnerability Detail

```
### {package_name}@{current_version}
- **Severity**: {severity}
- **Advisory**: {advisory_url}
- **Description**: {description}
- **Patched Version**: {fix_version}
- **Action**: `npm install {package_name}@{fix_version}`
```

## Recommendations

```
## Actions Required
1. Update CRITICAL packages immediately
2. Review HIGH severity for breaking changes
3. Schedule MEDIUM updates for next sprint
4. Document LOW severity in backlog
```
