---
description: Manage history of created and optimized prompts
---

# /prompt history

Command for managing prompt history and versioning.

## Usage

```bash
/prompt history [action] [options]
```

## Actions

| Action | Description |
|--------|-------------|
| `list` | List all saved prompts |
| `show <id>` | Display a specific prompt |
| `search <query>` | Search by keyword |
| `diff <id1> <id2>` | Compare two versions |
| `rollback <id>` | Restore a previous version |
| `export` | Export history |
| `clean` | Clean old versions |

## Storage

Prompts are saved in:

```text
~/.claude/prompt-history/
├── index.json                 # Prompt index
└── prompts/
    ├── 2025-01-21_code-reviewer_v1.md
    ├── 2025-01-21_code-reviewer_v2.md
    └── 2025-01-22_support-assistant_v1.md
```

## Index Format

```json
{
  "version": "1.0",
  "prompts": [
    {
      "id": "prompt_001",
      "name": "code-reviewer",
      "versions": [
        {
          "version": 1,
          "date": "2025-01-21T10:30:00Z",
          "file": "2025-01-21_code-reviewer_v1.md",
          "hash": "abc123",
          "notes": "Initial version"
        },
        {
          "version": 2,
          "date": "2025-01-21T14:00:00Z",
          "file": "2025-01-21_code-reviewer_v2.md",
          "hash": "def456",
          "notes": "Added security section",
          "parent": 1
        }
      ],
      "tags": ["code", "review", "quality"],
      "category": "agents"
    }
  ]
}
```

## Examples

### List History

```bash
/prompt history list
```

**Output**:

```markdown
## Prompt History

| ID | Name | Versions | Last Modified | Tags |
|----|------|----------|---------------|------|
| prompt_001 | code-reviewer | 3 | 2025-01-21 | code, review |
| prompt_002 | support-assistant | 2 | 2025-01-20 | support |
| prompt_003 | summarizer | 1 | 2025-01-19 | text |

Total: 3 prompts, 6 versions
```

### View a Prompt

```bash
/prompt history show prompt_001
```

**Output**:

```markdown
## code-reviewer (prompt_001)

**Category**: agents
**Tags**: code, review, quality
**Versions**: 3

### Version History

| V | Date | Notes | Hash |
|---|------|-------|------|
| 3 | 2025-01-21 14:00 | Added OWASP | def456 |
| 2 | 2025-01-21 12:00 | Added SOLID | abc123 |
| 1 | 2025-01-21 10:00 | Initial version | 789xyz |

### Current Content (v3)

---
[Prompt content]
---
```

### Search

```bash
/prompt history search "security"
```

**Output**:

```markdown
## Results for "security"

| ID | Name | Match | Version |
|----|------|-------|---------|
| prompt_001 | code-reviewer | "security audit" | v3 |
| prompt_005 | security-auditor | Name | v1 |

2 results found
```

### Compare Two Versions

```bash
/prompt history diff prompt_001:v2 prompt_001:v3
```

**Output**:

```markdown
## Diff: code-reviewer v2 → v3

### Statistics
- Lines added: +15
- Lines removed: -3
- Lines modified: 5

### Changes

```diff
@@ Security Section @@
+ ### OWASP Verification
+ - [ ] No SQL injection?
+ - [ ] XSS protection?
+ - [ ] Input validation?

@@ Forbidden @@
- ❌ Ignore warnings
+ ❌ Ignore security flaws
+ ❌ Approve vulnerable code
```
```

### Rollback

```bash
/prompt history rollback prompt_001:v2
```

**Output**:

```markdown
## Rollback Complete

- **Prompt**: code-reviewer
- **From**: v3 → v2
- **New version**: v4 (copy of v2)

Prompt has been restored to version 2.
Version 3 remains in history.
```

### Export

```bash
/prompt history export --format json
```

**Formats**:

| Format | Description |
|--------|-------------|
| `json` | Complete JSON export |
| `yaml` | YAML export |
| `markdown` | Markdown documentation |
| `zip` | Complete archive |

### Clean

```bash
/prompt history clean --keep 5
```

**Options**:

| Option | Description |
|--------|-------------|
| `--keep N` | Keep the last N versions |
| `--older-than 30d` | Delete versions > 30 days |
| `--dry-run` | Preview without deleting |

## Automatic Saving

Every time a prompt is created or modified via `/prompt create` or `/prompt optimize`, a new version is automatically saved.

### Disable Saving

```bash
/prompt create --no-history
```

### Force Save

```bash
/prompt save --name "my-prompt" --tags "tag1,tag2"
```

## Best Practices

1. **Name clearly** prompts to facilitate searching
2. **Tag** with relevant keywords
3. **Add notes** for important modifications
4. **Clean regularly** old versions
5. **Export** before major updates
