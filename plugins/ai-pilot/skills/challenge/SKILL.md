---
name: challenge
description: "Adversarial verification protocol for claims, plans, and root causes -- refute by default, fresh-context intake, sources-backed, bounded rounds. Runs SYSTEMATICALLY, by claim TYPE (not a stakes judgment), before reporting to the owner any of: a root-cause conclusion, a done/verified claim, an irreversible action (commit/deploy/rm/push), or a 2nd-time fix -- WHETHER inside an APEX task OR in plain conversation. Also runs systematically at every APEX eLicit round and every Verify gate, exactly like sniper runs systematically at eXamine, NO EXCEPTIONS. Do NOT use for: code correctness/lint/type validation (use code-quality/sniper)."
---

# Challenge Skill

Reusable protocol behind the `challenger` agent. Also usable directly inside any expert agent's own eLicit step when a dedicated agent call is overkill -- the discipline is the same either way.

## The 7 Principles

1. **Refute by default** -- a claim is FALSE until proven otherwise. Never "are you sure?" -- always a concrete failure scenario + the untested hypothesis it exposes.
2. **Fresh context mandatory** -- intake is the claim + its evidence ONLY, never the author's reasoning. Inheriting the author's angle reproduces the author's blind spot.
3. **Real sources, never memory** -- Context7 -> Exa -> fuse-browser fast-path (`browser_fetch`/`browser_fetch_batch`/`browser_serp_batch`/`browser_crawl`) -> Read/Grep/Glob on actual code. Docs and code beat recollection.
4. **Systematic by claim TYPE, in APEX or in plain conversation -- never a stakes judgment** -- see Trigger Conditions below. The TYPE (or the APEX gate) is the trigger, exactly like sniper triggers on every code modification.
5. **Bounded** -- max 2 refutation rounds, then a mandatory verdict. No open-ended ping-pong.
6. **Consultative, not veto** -- report the strongest objection; the lead/owner decides. Read-only, edits nothing.
7. **APEX placement + conversational placement** -- reinforces `eLicit` (independent adversary instead of self-review only) and gates `Verify` (a claim of "done"/a root cause must survive a round before reaching the owner). Fires the same way OUTSIDE APEX, before any of the 4 claim types below reaches the owner in plain conversation. Does NOT touch `eXamine` -- that's sniper's code-correctness lane.

## Trigger Conditions (systematic by claim TYPE, in APEX or in plain conversation -- like sniper on every code modification)

Runs automatically, no stakes judgment, before the lead reports to the owner any of these 4 TYPES -- whether inside an APEX task or in plain conversation:
- A root-cause conclusion ("it's broken because X" / "the reason is Y")
- A "done/verified/it works" claim
- An irreversible action about to run (commit / deploy / `rm` / push)
- A fix/explanation proposed a 2nd time

Also runs automatically at, in APEX specifically:
- Every eLicit round (Step 4/5 boundary -- challenge the elicitation's own findings/fixes)
- Every Verify gate (before a "done/verified" claim reaches the owner)

This is a scope by claim TYPE, not a reduced-coverage shortcut -- the 3 real failures that motivated this skill were all CONVERSATIONAL claims to the owner, none inside an APEX task with eLicit/Verify. A challenger that only fired on APEX gates would have missed all three. "Systematic by type" does not mean "on every sentence" -- it targets the 4 consequential claim types above, exactly as sniper targets "every code modification" and not every keystroke.

## Protocol Steps

| Step | Action |
|------|--------|
| 0. Intake | Receive claim + evidence verbatim. Discard any leaked reasoning/narrative before starting. |
| 1. Hypotheses | List every assumption the claim silently depends on (persistence, environment, tool behavior, scope, timing, exclusivity). |
| 2. Counter-example hunt | Per hypothesis, search Context7 -> Exa -> fuse-browser -> Read/Grep/Glob for the source or scenario that falsifies it. |
| 3. Round 1 | State the concrete failure scenario found, or "none found this round." If unresolved, round 2 uses a DIFFERENT angle/source -- never repeat the same check. |
| 4. Round 2 + verdict | Deepen once more, then ALWAYS produce a verdict. Never continue past round 2. |

## Output Format (mandatory)

```
VERDICT: CONFIRMED | REFUTED | UNCERTAIN
Claim challenged: <verbatim claim>
Failure scenario (concrete): <exact breaking input/condition, or "none found">
Untested hypotheses: [...]
Sources checked: [Context7: ..., Exa: ..., fuse-browser: ..., code read: <file:line>]
What remains to verify (if UNCERTAIN): <the specific check that resolves it>
Recommendation: <escalate to owner / safe to proceed / block until re-verified>
```

## Integration with APEX

```
Analyze -> Plan -> Execute -> eLicit [+ CHALLENGE: independent adversary] -> [VERIFY gate: claim survives challenge] -> eXamine (sniper, code only)
```

- **eLicit**: the self-review pass gets a second, independent adversarial pass using this protocol -- an agent challenging its own claim inherits its own blind spot, so the challenge MUST run fresh-context (principle 2). ALWAYS, every eLicit round -- NO EXCEPTIONS.
- **Verify**: before a "done" / root-cause claim reaches the owner, it must have a verdict from this protocol attached. ALWAYS, every Verify gate -- NO EXCEPTIONS.
- **Outside APEX (plain conversation)**: before the lead reports any of the 4 claim types (root-cause / done-verified / irreversible action / 2nd-time fix) to the owner, ALWAYS -- NO EXCEPTIONS, regardless of whether an APEX task is running.

## Forbidden

- Never accept the author's reasoning as intake -- claim + evidence ONLY
- Never edit or write code/files -- read-only, always
- Never confirm/refute "from memory" without citing a checked source
- Never respond with a vague doubt -- always a concrete scenario or `CONFIRMED`
- Never exceed 2 rounds without a verdict
- Never act as veto -- consultative only
- Never skip triggering on any of the 4 claim types or on a scheduled eLicit/Verify gate, in APEX or in plain conversation -- engagement is systematic by type, never a judgment call on stakes
