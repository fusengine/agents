# fuse-lessons

Project memory for Claude Code. Records compact **"never reproduce"** lessons in `MEMORY/LESSON.md` at the **project root** and force-reads them into context at every session and sub-agent start — so the same mistake is never made twice.

## Purpose

Most post-mortem knowledge evaporates between sessions. `fuse-lessons` makes it durable:

- On **finish**, you write a one-line lesson describing what went wrong and what to do instead.
- On **start** (main session and every sub-agent), those lessons are injected back into context automatically.
- `MEMORY/LESSON.md` lives at the project root and is **committed**, so the whole team inherits the lessons.

## Architecture (`MEMORY/`)

| File | Committed? | Role |
|------|------------|------|
| `MEMORY/LESSON.md` | yes | The list of lessons — read at start, appended on finish. |
| `MEMORY/state.json` | no (gitignored) | Throttle counter (last-reminder / last-write timestamps), managed by the hooks. **Never edit by hand.** |

## LESSON.md format

A flat list, one lesson per line, newest at the bottom:

```
- [YYYY-MM-DD HH:MM] <what went wrong> → <what to do instead>
```

Example:

```
- [2026-06-20 11:02] Set "hooks": "./hooks/hooks.json" string in a marketplace entry → never add a hooks field there; hooks auto-load by convention
- [2026-06-20 11:02] Split a 105-line script left a re-parse inline → extract shared constants into a lib module and import them (DRY)
```

Keep each line short and actionable: the failure on the left of `→`, the fix on the right.

## The 4 hooks

All four events route to `@fusengine/harness` (`hook claude-code lessons`); the logic lives in the harness `lessons` scope.

| Event | Behavior |
|-------|----------|
| `SessionStart` | Reads `MEMORY/LESSON.md` and injects the lessons into the main session context. |
| `SubagentStart` | Same injection for every spawned sub-agent, so delegated work inherits the lessons. |
| `Stop` | Reminds you to capture a compact lesson before finishing — throttled to once per 5 min (see below). It injects the exact `YYYY-MM-DD HH:MM` timestamp to use. |
| `PostToolUse` (`Write\|Edit\|MultiEdit`) | Detects a write to `MEMORY/LESSON.md` and resets the throttle in `MEMORY/state.json`. |

Hooks are declared in `hooks/hooks.json` and auto-load by convention.

## Throttle

The `Stop` reminder fires at most once every **5 minutes** by default. Override with the `FUSE_LESSONS_THROTTLE_MIN` environment variable (minutes). Writing to `MEMORY/LESSON.md` resets the throttle automatically via the `PostToolUse` hook.

## Usage

Run `/lessons` to view the current `MEMORY/LESSON.md` and either **append** a new lesson or **refine / merge** existing ones so the list stays sharp. Commit `MEMORY/LESSON.md` alongside your changes so the lesson is shared.

Run `/lessons-compact` when the file has grown large (duplicates, several lessons about the same root cause, stale entries superseded by a later one) — it deduplicates and merges without losing any unique signal, shows a full before/after preview, and asks for confirmation before overwriting the file. Idempotent: running it again on an already-compact file is a no-op.

## "Never reproduce"

The whole point is a growing, committed list of failures the team has already paid for once. Read it at the start, add to it at the end — and stop reproducing solved mistakes.

## Location

`MEMORY/LESSON.md` is created and maintained at the **project root** (committed, not in `.claude/`), so it travels with the repository. `MEMORY/state.json` sits alongside it but is gitignored.
