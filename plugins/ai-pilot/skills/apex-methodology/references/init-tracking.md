---
name: init-tracking
description: APEX task-tracking initialization command (Step 0, mandatory first action)
---

# Step 0: Initialize Tracking

**BEFORE anything else**, run this command to initialize APEX tracking:

```bash
mkdir -p .claude/apex/docs && cat > .claude/apex/task.json << 'INITEOF'
{
  "current_task": "1",
  "created_at": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'",
  "tasks": {
    "1": {
      "status": "in_progress",
      "started_at": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'",
      "doc_consulted": {}
    }
  }
}
INITEOF
echo "✅ APEX tracking initialized in $(pwd)/.claude/apex/"
```

This creates:
- `.claude/apex/task.json` - Tracks documentation consultation status
- `.claude/apex/docs/` - Stores consulted documentation summaries

**The PreToolUse hooks will BLOCK Write/Edit until documentation is consulted.**
