---
name: migration-guide
description: Template for generating migration guides when breaking changes are detected
keywords: migration, breaking, upgrade, compatibility, guide
---

# Migration Guide Template

## Header

```markdown
# Migration Guide: Claude Code v{old} → v{new}
**Date**: {date}
**Breaking Changes**: {count}
**Affected Plugins**: {plugin_list}
```

## Breaking Change Section

```markdown
## {change_title}

**Type**: {removed_api | changed_schema | new_required_field}
**Severity**: BREAKING
**Affected Files**:
| File | Line | Current Code | Required Change |
|------|------|-------------|-----------------|
| {path} | {line} | `{old_code}` | `{new_code}` |

### Before
\`\`\`
{old_code_block}
\`\`\`

### After
\`\`\`
{new_code_block}
\`\`\`

### Steps
1. {step_1}
2. {step_2}
3. {step_3}
```

## Verification

```markdown
## Post-Migration Checks
- [ ] All hooks.json files updated
- [ ] Agent frontmatter matches new schema
- [ ] Scripts use correct CLI flags
- [ ] Plugin manifests valid
- [ ] Run sniper validation on changed files
```
