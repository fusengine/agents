---
name: changelog-report
description: Template for structured Claude Code update reports
keywords: report, changelog, version, update, template
---

# Changelog Report Template

## Report Header

```markdown
# Claude Code Update Report
**Date**: {date}
**Latest Version**: {latest_version}
**Previous Check**: {last_check_date} (v{last_version})
**New Versions**: {new_count}
```

## Version Section

```markdown
## v{version} ({release_date})

### [BREAKING] Breaking Changes
- {change_description}
  - **Impact**: {affected_plugins_or_files}
  - **Action**: {required_migration_steps}

### [NEW] New Features
- {feature_description}
  - **Opportunity**: {how_plugins_could_use_it}

### [DEPRECATED] Deprecations
- {deprecated_api}
  - **Alternative**: {replacement}
  - **Deadline**: {removal_version_if_known}

### Bug Fixes
- {fix_description}
```

## Summary Section

```markdown
## Action Items
1. [CRITICAL] {breaking_change_to_fix}
2. [PLAN] {deprecation_to_migrate}
3. [EVALUATE] {new_feature_to_adopt}

## Affected Files
| File | Impact | Action |
|------|--------|--------|
| {file_path} | {breaking/deprecated} | {fix_description} |
```
