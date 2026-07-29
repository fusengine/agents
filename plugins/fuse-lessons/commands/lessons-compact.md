---
name: lessons-compact
description: Compact MEMORY/LESSON.md by deduplicating near-identical lessons, merging same-root-cause lessons, and pruning stale ones — without losing any unique signal. Delegates the analysis to the lessons-compactor agent.
---

# /lessons-compact

Compact the project's **`MEMORY/LESSON.md`** (project root). Over time this file accumulates near-duplicate entries, several lessons about the same root cause, and entries a later lesson has since contradicted.

Use `/lessons` to just view or append a single lesson — this command is the dedicated compaction pass.

## How it runs — delegate, then arbitrate

**Do not classify the entries yourself.** Spawn the **`fuse-lessons:lessons-compactor`** agent and let it do the reading and the analysis.

Why delegate: compaction is a heavy-context, light-output task — it means reading the whole file, classifying every entry, and cross-checking each against all the others, to produce a verdict of a dozen lines. Doing that inline burns the lead's context for a result that fits in a paragraph.

### Step 1 — spawn the agent

Pass it, in its prompt:
- the absolute path of `MEMORY/LESSON.md`,
- **the absolute path of a scratchpad directory** where it must write its proposal (it needs one — it will ask rather than guess if you omit it),
- any specific concern the user raised when invoking the command.

### Step 2 — relay its report to the user

The agent returns a verdict, before/after sizes, the observed ordering convention, the merge list (with the shared root cause of each) and the drop list (each naming the later entry that supersedes it).

**Show the user the proposed merges and drops, and ask for explicit confirmation before anything is written.**

This is deliberately ask-first, not write-then-diff. Compaction is inherently lossy — it deletes lines — and `MEMORY/LESSON.md` is committed team memory, force-read into every session and every subagent. An unwanted compaction that already overwrote the file is far harder to notice and walk back than one caught in review. Nobody misses a lesson until the mistake it prevented happens again.

If `git diff` shows uncommitted changes on the file, the agent flags it — pass that warning on. Compacting on top of unsaved manual edits makes the proposal harder to trust.

### Step 3 — on confirmation

Copy the agent's proposal file over `MEMORY/LESSON.md`, then remind the user to commit it so the team inherits the smaller file.

**On rejection or requested edits**, send the agent back with the feedback — never write without a confirmed proposal.

## Rules the agent enforces (stated here so you can check its work)

- **Keep / Duplicate / Merge group / Superseded** — an entry is dropped *only* when a later, more specific entry demonstrably replaces it, and the agent must name that entry. **Never dropped for being old.**
- **When in doubt, keep.** An extra line costs nothing; a lost lesson costs the same mistake twice.
- **Merge on root cause, not on shared vocabulary.** Two lessons about the same file can be two distinct lessons. A merge that loses a distinct corrective action is a failed merge, however well it reads.
- **Format preserved**: `- [YYYY-MM-DD HH:MM] <what went wrong> → <what to do instead>`, one lesson per entry, no code blocks.
- **Ordering: read the file's own header, never assume.** This repo's `MEMORY/LESSON.md` declares `newest on top` in its HTML comment and is written that way. Earlier versions of this command claimed the opposite — that was wrong, and applying it would have silently reversed the whole file and broken the hooks that read it. **The file's actual convention always wins**; the agent reports which one it observed.

## Idempotence

On an already-compact file, the agent classifies everything as Keep and reports zero merges and zero drops. Say so plainly — never force a no-op write to look useful.

## Example

Before (3 entries, the first two sharing one root cause):

```
- [2026-06-20 11:02] Set "hooks": "./hooks/hooks.json" string in a marketplace entry → never add a hooks field there; hooks auto-load by convention
- [2026-06-25 09:14] Added a hooks path to marketplace.json again for a different plugin, same mistake → hooks auto-load by convention from hooks/hooks.json, do not add a hooks field to marketplace entries, ever
- [2026-07-02 16:40] Split a 105-line script left a re-parse inline → extract shared constants into a lib module and import them (DRY)
```

After (2 entries — first two merged under the group's most recent timestamp, third untouched):

```
- [2026-06-25 09:14] Repeatedly added a "hooks" field to marketplace.json entries (2x, different plugins) → hooks auto-load by convention from hooks/hooks.json; never add a hooks field to marketplace entries
- [2026-07-02 16:40] Split a 105-line script left a re-parse inline → extract shared constants into a lib module and import them (DRY)
```
