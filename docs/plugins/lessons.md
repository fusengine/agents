# fuse-lessons

Per-project memory of mistakes. Writes compact "never reproduce" lessons to `MEMORY/LESSON.md` and force-reads them at session and subagent start — so Claude (and every teammate) stops repeating the same errors across sessions.

## How It Works

Four hooks, one central loader (no `/reload-plugins` needed — handlers are read live from `marketplaces/`):

| Event | Handler | Action |
|-------|---------|--------|
| `SessionStart` | `inject-memory.ts` | Injects `<root>/MEMORY/LESSON.md` as additional context |
| `SubagentStart` | `inject-memory.ts` | Same injection for every spawned agent/teammate |
| `PostToolUse` (`Write\|Edit\|MultiEdit`) | `mark-write.ts` | On a real code edit → arms `lastCodeEditAt` for the edited file's project; on a `LESSON.md` edit → resets the reminder timer |
| `Stop` | `remind-write.ts` | If code was edited since the last reminder (and throttle elapsed) → reminds you to append 1–3 compact lessons, timestamped `[YYYY-MM-DD HH:MM]` |

## Why It Only Nags After Code

The reminder is **state-driven**, not every-turn. `mark-write` records `lastCodeEditAt` per project root; `remind-write` only fires when `lastCodeEditAt > lastRemindedAt`. A conversation-only turn (no `Write`/`Edit`) produces no reminder. Writing the `LESSON.md` resets the timer automatically — the nag stops once you've recorded.

> Note: a blocked `PreToolUse` (e.g. an APEX gate) prevents the edit from running, so `mark-write` never fires — the edit must pass the gate first to arm the reminder.

## Multi-Project

Each reminder targets the **edited file's own repo**, resolved by walking up to the nearest `.git` directory (falls back to `package.json` only when no `.git` ancestor exists — avoids false monorepo roots). Edited roots are tracked in a registry at `~/.claude/fusengine-cache/lessons/roots.json`, so editing projects A and B in one session reminds you for A and B independently.

## Files

| File | Purpose |
|------|---------|
| `<project>/MEMORY/LESSON.md` | Committed lessons file (newest on top, one compact bullet each) |
| `<project>/MEMORY/state.json` | Machine-local throttle counters — auto-gitignored, never committed |

## Lesson Format

```
- [YYYY-MM-DD HH:MM] what went wrong → do instead
```

Keep each bullet terse; append, merge, or sharpen existing ones rather than piling up duplicates.

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `FUSE_LESSONS_THROTTLE_MIN` | `5` | Minimum minutes between two write-reminders |

## Commands

| Command | Description |
|---------|-------------|
| `/lessons` | Show the current project's `MEMORY/LESSON.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/handlers/inject-memory.ts` | Reads and injects `LESSON.md` at session/subagent start |
| `scripts/handlers/mark-write.ts` | Arms `lastCodeEditAt` on code edits; resets timer on `LESSON.md` edits |
| `scripts/handlers/remind-write.ts` | Emits the timestamped write-reminder when code was edited |
| `scripts/lib/hook-io.ts` | `findProjectRoot` (.git-first), `isCodeFile`, stdin reader |
| `scripts/lib/throttle.ts` | `state.json` counters + `nowStamp()` timestamp |
| `scripts/lib/registry.ts` | Tracks edited project roots across the session |
| `scripts/lib/gitignore.ts` | Auto-writes `MEMORY/.gitignore` (ignores `state.json`) |
