---
name: registration
description: How to register agents in marketplace.json
when-to-use: Making agent available after creation
keywords: registration, marketplace, json, plugin, manifest
priority: high
related: architecture.md, frontmatter.md
---

# Agent Registration

## Overview

Agents must be registered in marketplace.json to be discoverable.

---

## Marketplace.json Structure

```json
{
  "name": "fusengine-plugins",
  "plugins": [
    {
      "name": "fuse-nextjs",
      "source": "./plugins/nextjs-expert",
      "description": "Expert Next.js 16 with App Router...",
      "version": "1.1.0",
      "agents": [
        "./agents/nextjs-expert.md"
      ],
      "skills": [
        "./skills/nextjs-16",
        "./skills/solid-nextjs",
        "./skills/prisma-7"
      ]
    }
  ]
}
```

---

## Required Fields

| Field | Description |
|-------|-------------|
| `name` | Plugin identifier (fuse-*) |
| `source` | Path to plugin directory |
| `description` | Plugin description |
| `version` | Semantic version |
| `agents` | Array of agent file paths |
| `skills` | Array of skill directory paths |

---

## Registration Steps

### 1. Add Plugin Entry

```json
{
  "name": "fuse-new",
  "source": "./plugins/new-expert",
  "agents": ["./agents/new-expert.md"],
  "skills": ["./skills/skill-a"]
}
```

### 2. Verify Paths

- Agent path: `./agents/<name>.md`
- Skill path: `./skills/<name>`
- Paths relative to plugin source

### 3. Validate

Run sniper to verify registration.

---

## Plugin.json (Local)

Also update `.claude-plugin/plugin.json` in the plugin:

```json
{
  "name": "fuse-new",
  "version": "1.0.0",
  "description": "...",
  "agents": ["./agents/new-expert.md"],
  "skills": ["./skills/skill-a"]
}
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong path prefix | Use `./` for relative paths |
| Missing skill | Add to skills array |
| Typo in agent name | Match filename exactly |
| Forgot plugin.json | Update both files |

---

## Verification

After registration:

1. Agent appears in available agents list
2. Skills are accessible via `/skill-name`
3. No errors on plugin load

---

## Best Practices

| DO | DON'T |
|----|-------|
| Match folder names | Use different names |
| Update version on changes | Keep stale version |
| List all skills | Forget dependencies |
| Test after registration | Assume it works |
