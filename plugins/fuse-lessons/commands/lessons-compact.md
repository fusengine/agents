---
name: lessons-compact
description: Compact MEMORY/LESSON.md by deduplicating near-identical lessons, merging same-root-cause lessons, and pruning stale ones — without losing any unique signal.
---

# /lessons-compact

Compact the project's **`MEMORY/LESSON.md`** (project root). Over time this file accumulates near-duplicate entries, several lessons about the same root cause, and entries a later lesson has since contradicted or superseded. This command shrinks the file back down while keeping every distinct piece of signal.

This is a dedicated compaction pass — use `/lessons` to just view or append a single lesson.

## Process

1. **Read** `MEMORY/LESSON.md` at the project root. If it doesn't exist or has fewer than ~15 lines, tell the user there's nothing worth compacting and stop.
2. **Classify every line** into one of:
   - **Keep as-is** — unique lesson, no overlap with any other line.
   - **Duplicate** — near-identical wording/meaning to another line. Keep only one (the clearer/more specific phrasing; prefer the one with the concrete example or file reference).
   - **Merge group** — 2+ lines about the same root cause (e.g. the same file, same bug class, same misunderstanding repeated across sessions). Collapse into ONE stronger lesson that keeps the best concrete example/evidence from the group and states the corrective action clearly. Use the **most recent** timestamp in the group.
   - **Stale** — superseded or contradicted by a later, more specific lesson (e.g. an early "assume X" lesson a later entry proves wrong). Drop it, but only when a *later* line clearly overrides it — never drop just because a lesson looks old.
3. **When in doubt, keep the line.** Losing a unique lesson is the one unrecoverable failure mode of this command; an extra line costs nothing.
4. **Preserve exactly**:
   - The compact line format from `/lessons`: `- [YYYY-MM-DD HH:MM] <what went wrong> → <what to do instead>`
   - One lesson per line, no paragraphs, no code blocks.
   - Chronological order (oldest at top, newest at bottom) — same convention as `/lessons`. Do not switch to thematic grouping; it breaks the "newest at the bottom" convention the hooks and other commands rely on.
5. **Preview before writing.** Show the user:
   - Line count and file size before → after.
   - The list of merges (which lines collapsed into which single line) and the list of drops (with a one-line reason each — "duplicate of line N" or "superseded by line N").
   - The full new file content.
   Then ask for explicit confirmation before overwriting `MEMORY/LESSON.md`.

   This is deliberately **ask-first, not write-then-diff**: compaction is inherently lossy (it deletes lines), and `MEMORY/LESSON.md` is committed team memory force-read into every session — an unwanted compaction that already overwrote the file is harder to notice and walk back than one caught in a preview. If the user has an uncommitted `git diff` on `MEMORY/LESSON.md` already, mention it — compacting on top of unsaved manual edits makes the preview harder to trust.
6. **On confirmation**, write the compacted file, then remind the user to commit `MEMORY/LESSON.md` (same recommendation as `/lessons`) so the team inherits the smaller file.
7. **On rejection or edits requested**, adjust the plan and show a new preview — never write without a confirmed preview.

## Idempotence

Running `/lessons-compact` on an already-compact file should classify everything as "keep as-is" and report zero merges/drops — say so plainly instead of forcing a no-op write.

## Example

Before (3 lines, same root cause, ~2 weeks apart):

```
- [2026-06-20 11:02] Set "hooks": "./hooks/hooks.json" string in a marketplace entry → never add a hooks field there; hooks auto-load by convention
- [2026-06-25 09:14] Added a hooks path to marketplace.json again for a different plugin, same mistake → hooks auto-load by convention from hooks/hooks.json, do not add a hooks field to marketplace entries, ever
- [2026-07-02 16:40] Split a 105-line script left a re-parse inline → extract shared constants into a lib module and import them (DRY)
```

After (2 lines — first two merged, third kept as-is, newest timestamp of the merge group used):

```
- [2026-06-25 09:14] Repeatedly added a "hooks" field to marketplace.json entries (2x, different plugins) → hooks auto-load by convention from hooks/hooks.json; never add a hooks field to marketplace entries
- [2026-07-02 16:40] Split a 105-line script left a re-parse inline → extract shared constants into a lib module and import them (DRY)
```
