---
name: init-tracking
description: APEX task-tracking initialization command (Step 0, mandatory first action)
---

# Step 0: Initialize Tracking

**BEFORE anything else**, run this command to initialize APEX tracking.

## Task Slug

Every artefact in `.claude/apex/` (task id, docs, verify/elicit proofs) is keyed on one `{task-slug}`, derived — in order of preference — from:

1. An explicit TaskCreate id, if this task is already tracked on the board (`APEX_TASK_SLUG` below).
2. The current git branch name, stripped of its `type/` prefix and slugified.
3. A `task-<unix-timestamp>` fallback when neither is available (detached HEAD, no branch).

```bash
TASK_SLUG="${APEX_TASK_SLUG:-}"
[ -z "$TASK_SLUG" ] && TASK_SLUG=$(git branch --show-current 2>/dev/null \
  | sed -E 's#.*/##; s/[^a-zA-Z0-9]+/-/g; s/^-+|-+$//g' | tr '[:upper:]' '[:lower:]')
[ -z "$TASK_SLUG" ] && TASK_SLUG="task-$(date +%s)"
```

`{task-slug}` is the same value used everywhere else in APEX: `docs/task-{task-slug}.md` (working notes), `docs/verify-{task-slug}.md` (Verify proof), `docs/elicit-{task-slug}.json` (eLicit proof).

## Command

```bash
TASK_SUBJECT="<the real task description>"   # e.g. "$ARGUMENTS" from the invoking command
NOW="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
mkdir -p .claude/apex/docs
jq -n --arg slug "$TASK_SLUG" --arg subject "$TASK_SUBJECT" --arg now "$NOW" \
  '{current_task: $slug, created_at: $now, tasks: {($slug): {
      subject: $subject, status: "in_progress", phase: "init-branch",
      started_at: $now, doc_consulted: {}
    }}}' > .claude/apex/task.json
echo "✅ APEX tracking initialized in $(pwd)/.claude/apex/ (task: $TASK_SLUG)"
```

Build the JSON with `jq -n`, not a heredoc: `TASK_SUBJECT` is the user's raw request and commonly contains `"` or `` ` `` — string-interpolating it into a heredoc produces invalid JSON (verified: a heredoc with quotes in the subject breaks `jq .` with a parse error). `jq --arg` escapes it correctly regardless of content.

This creates:
- `.claude/apex/task.json` — tracks documentation consultation status, current phase, and subject (see `phase` field, updated by each phase reference — `references/00-init-branch.md` through `references/09-create-pr.md`)
- `.claude/apex/docs/` — stores consulted documentation summaries

**The PreToolUse hooks will BLOCK Write/Edit until documentation is consulted.**
