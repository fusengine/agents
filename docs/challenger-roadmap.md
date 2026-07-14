# Challenger — Roadmap

Adversarial verifier for claims/plans/root causes, distinct from `sniper` (code correctness). Read-only, fresh-context, sources-backed, bounded. See `plugins/ai-pilot/agents/challenger.md` + `plugins/ai-pilot/skills/challenge/SKILL.md`.

## Why

APEX's `eLicit` is self-review by the same agent that wrote the code/claim — it shares the author's blind spots. `sniper` (`eXamine`) challenges the CODE (lint/types/API, Context7/Exa-verified) but not non-code claims, reasoning, or root causes. Three real failures from a single session show the gap — none would have been caught by sniper (`tsc` + tests were green), and critically, **all three were CONVERSATIONAL claims the lead made directly to the owner in chat — none occurred inside an APEX task, none passed through an eLicit or Verify gate**. A challenger scoped only to APEX gates would have missed all three. This is why the trigger is claim TYPE (root-cause / done-verified / irreversible action / 2nd-time fix), not APEX phase — it must fire in plain conversation exactly as it fires at eLicit/Verify:

1. **"We reuse `substituteHome` at install"** — FALSE. Install-time path resolution does not survive a marketplace clone re-checkout: Claude Code re-checks out `~/.claude/plugins/marketplaces/fusengine-plugins/plugins/`, which wipes gitignored `node_modules` and reverts install-resolved files (e.g. `hooks.json`) back to their `$HOME`-literal source. The durable fix had to live in the long-lived runtime entry point (`hooks-loader.ts`), not at install time.
2. **"The design gate is absent from dist"** — FALSE. Artifact of a wrapped `ugrep -I` that skips binaries on a stray NUL byte — the gate was present, the grep tool was lying.
3. **Over-pushing "Option A: root install"** — an architecture the owner had already explicitly rejected, re-proposed instead of implementing the owner's simpler, already-stated design. Cost: the owner had to repeat himself 3x with escalating frustration.

A challenger given only the claim + evidence (never the reasoning) would have surfaced the untested hypothesis in each case early — before it reached the owner.

## Phase A — MAINTENANT (delivered in this chantier)

- `plugins/ai-pilot/agents/challenger.md` — read-only adversarial agent (model: opus, tools: Read/Glob/Grep/Bash read-only + Context7 + Exa + sequential-thinking + fuse-browser fast-path, no Edit/Write). Systematic by claim TYPE, in APEX or in plain conversation.
- `plugins/ai-pilot/skills/challenge/SKILL.md` — reusable protocol: 7 principles, trigger conditions (4 claim types + APEX gates), bounded 2-round procedure, mandatory verdict format (`CONFIRMED` / `REFUTED` / `UNCERTAIN`).
- APEX wiring — done, not just identified (see below).
- `plugins/claude-rules/templates/CLAUDE.md.template` — Critical Rules jumelle rule (challenger, symmetric to the sniper rule), scoped to both APEX and plain conversation.
- This roadmap.

### APEX wiring (done)

- `plugins/ai-pilot/skills/apex-methodology/references/03.5-elicit.md` — Step 4.5 "Challenge round" inserted between Step 4 (Correct) and Step 5 (Report): ALWAYS runs the `challenger` agent (or `challenge` skill inline) on the elicitation's own findings/fixes, fed fresh-context (claim = "issues found and fixed", evidence = the diff/findings, no reasoning).
- `plugins/ai-pilot/skills/apex-methodology/references/04-validation.md` — the "Gate — Required Proof Artefacts" section now also blocks validation unless `.claude/apex/docs/challenge-{task-slug}.md` exists on disk, same additive pattern as the existing `elicit-*.json` / `verify-*.md` checks.
- `plugins/ai-pilot/skills/verification/SKILL.md` — Step 6 now routes the "functionally resolved" claim through the challenger BEFORE writing "Original problem is FUNCTIONALLY resolved"; only a `CONFIRMED` (or owner-accepted `UNCERTAIN`) unlocks that statement — soft-gate, not a hard veto.

Trigger scope covers BOTH: the 3 APEX-internal artefact gates above, AND the 4 conversational claim types (root-cause / done-verified / irreversible action / 2nd-time fix) that must trigger the challenger even outside any APEX task — see `CLAUDE.md.template` Critical Rules and the `challenge` skill's Trigger Conditions section.

## Phase B — PLUS TARD (à valider, hors périmètre de ce chantier)

Harness-level enforcement: `fuse-harness` blocks a "done" / root-cause claim from reaching the owner until a `challenge-{task-slug}.md` verdict artifact exists on disk (same mechanical pattern as the current `elicit-*.json` / `verify-*.md` gate in `04-validation.md`).

- Separate `fuse-harness` release — not a `claude-plugins` change, a harness/hook change.
- Risk to border: infinite challenge loops (challenger flags `UNCERTAIN` repeatedly, or a challenge-of-a-challenge spiral) — needs a hard cap mirroring sniper's Fix Retry Loop (3 cycles) and an explicit `Escalate` exit, never silent retry.
- Needs design for how to detect one of the 4 claim TYPES (root-cause / done-verified / irreversible action / 2nd-time fix) at the hook level (regex/heuristic on the claim text vs. explicit tagging by the reporting agent) before it can be enforced mechanically.

## Non-Goals

- Does **not** replace `sniper` — code correctness (lint/types/API/edge-cases) stays sniper's exclusive lane; the challenger never touches code.
- Is **not** a per-sentence reviewer — systematic by claim TYPE (root-cause / done-verified / irreversible action / 2nd-time fix) and by APEX gate (eLicit/Verify), not "on every sentence." Same scoping principle as sniper firing on "every code modification," not every keystroke.
- Has **no veto power** — verdict is consultative; the lead or owner decides what to do with a `REFUTED`/`UNCERTAIN` verdict. The challenger edits nothing and blocks nothing on its own.
