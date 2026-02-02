---
name: registration
description: How to register skills in agent and marketplace
when-to-use: After creating a skill, to make it available
keywords: registration, agent, marketplace, json, frontmatter
priority: high
related: architecture.md
---

# Skill Registration

## Overview

A skill won't load unless registered in TWO places:
1. Agent frontmatter
2. Marketplace.json

---

## Step 1: Agent Frontmatter

Add skill name to the agent's `skills:` list:

**Location**: `plugins/<plugin>/agents/<agent>.md`

```yaml
---
name: agent-name
skills: existing-skill-a, existing-skill-b, NEW-SKILL-NAME
---
```

### Important

| Rule | Reason |
|------|--------|
| Exact name match | Must match skill folder name |
| Comma-separated | List format |
| No paths | Just skill name |

---

## Step 2: Marketplace.json

Add skill path to plugin's `skills:` array:

**Location**: `.claude-plugin/marketplace.json`

```json
{
  "plugins": [
    {
      "name": "fuse-<plugin>",
      "skills": [
        "./skills/existing-skill-a",
        "./skills/existing-skill-b",
        "./skills/NEW-SKILL-NAME"
      ]
    }
  ]
}
```

### Important

| Rule | Reason |
|------|--------|
| Relative path | From plugin root |
| Starts with `./skills/` | Standard location |
| Exact folder name | Must match directory |

---

## Verification

After registration, verify:

| Check | Command |
|-------|---------|
| Skill loads | Invoke skill in conversation |
| References load | Check skill has access to refs |
| No errors | Check console for issues |

---

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Skill not found | Not in marketplace.json | Add to skills array |
| Skill not triggered | Not in agent frontmatter | Add to skills list |
| Wrong references | Mismatched name | Ensure exact match |

---

## Example Registration

### For new `tanstack-query` skill in `react-expert`:

**1. Agent frontmatter** (`plugins/react/agents/react-expert.md`):
```yaml
---
name: react-expert
skills: react-19, solid-react, tanstack-query
---
```

**2. Marketplace.json** (`.claude-plugin/marketplace.json`):
```json
{
  "plugins": [
    {
      "name": "fuse-react",
      "skills": [
        "./skills/react-19",
        "./skills/solid-react",
        "./skills/tanstack-query"
      ]
    }
  ]
}
```

---

## Related Skills Registration

If skill has `related-skills:` in frontmatter:

```yaml
related-skills: skill-a, skill-b
```

Ensure those skills are also registered.

---

## Checklist

- [ ] Added to agent's `skills:` in frontmatter
- [ ] Added to `skills:` array in marketplace.json
- [ ] Name matches folder exactly
- [ ] Related skills are registered
- [ ] Tested skill loads correctly
