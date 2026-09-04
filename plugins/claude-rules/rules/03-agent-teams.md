## Agent Teams

**Lead = Coordinator ONLY.** Never codes, only orchestrates.

1. **Exclusive file ownership** - NEVER shared edits between teammates
2. **Well-scoped mandates** - Each brief states: target files (exclusive), expected output, acceptance criteria
3. **Completion is reported by message, not by a task board** - `TaskCreate`/`TaskUpdate` are NOT loaded on Opus 5 by default (Claude Code v2.1.233+); coordination runs on `SendMessage`, which every agent carries. A teammate announces `completed` by messaging the lead — the lead still verifies ON DISK (rule 7)
4. **Max 4 teammates** - Beyond = coordination overhead
5. **80% planning, 20% execution** - Detailed specs = better results
6. **SPLIT by default from 3 files** — announce the split, don't ask. A teammate is born from an `Agent` call carrying a `name` (`TeamCreate` was removed in Claude Code v2.1.178)
7. **Launch → Orchestrate → Monitor → VERIFY** - spawning teammates is step 1, not the job: after EACH teammate report, verify the deliverables ON DISK (grep/diff the expected changes) before considering the mandate done
8. **Idle ≠ done** - an idle/available notification is NOT a completion; no deliverable on disk → take the mandate back or re-delegate, never assume
9. **Re-dispatch clause in every brief** - "if you receive a re-dispatch of an already-delivered mandate, verify the disk and REFUSE to re-execute" (task boards can re-notify; without it, work gets double-applied)
10. **sniper AFTER all teammates finish** - never during; run it once, after every teammate's deliverable is verified on disk

## Scope Ladder — take the smallest tool that suffices

Pick the level by the WORK, not by reflex. The rules above (team min 4, mandatory ANALYZE trio for anything touching code) still hold — this ladder tells you WHEN each applies and WHY, so you neither over-apply (a 4-agent team + ANALYZE trio for a mid-size edit) nor under-apply.

| Scope | Action | Why |
|-------|--------|-----|
| Trivial / read-only / 1 targeted file, bounded change | Direct edit (or 1 domain-expert) + sniper. NO team, NO mandatory ANALYZE trio. | Orchestration cost (spawn, briefs, FIFO cross-checks) exceeds the gain. |
| Non-trivial mono-concern, 1-2 files | 1 domain-expert (+ targeted ANALYZE if it touches unknown code) + sniper/challenger. | One executor suffices; verification comes from sniper + challenger, not parallelism. |
| Multi-file (3+), SAME domain, even COUPLED | **2-3 agents by EXCLUSIVE FILE OWNERSHIP** — split the file set, one owner per subset. Coupling is handled by the brief (shared contract stated up front) and by `SendMessage` between them. Announce the split, don't ask. | Coupling forbids concurrent edits to the SAME file, not concurrent work on the same feature. One executor on 6 files is a context bottleneck, not a safety measure. |
| Truly parallelizable: INDEPENDENT batches, multi-domain, or large multi-file with no cross-dependency | Team, MINIMUM 4 agents — `Agent` with a `name` per teammate. | Parallelism only pays when the batches have no dependency between them. |

**Key rule — the trigger is the FILE SET, and coupling dictates the SPLIT, not the agent count.** 1-2 files = 1 executor; 3+ files = split by exclusive ownership; independent batches = full team (min 4). Never put 2 agents on the same file. When the owner says "team", it's a team (min 4), no debate.

## Anti-Patterns (FORBIDDEN)
- **Unnamed parallel agents for multi-file edits** → NAME each one (`Agent` with a `name`): unnamed agents cannot be addressed, so they cannot coordinate. Every agent carries `SendMessage`
- **2 teammates on same file** → CONFLICT guaranteed (one overwrites the other)
- **Lead writing code** → Lead ORCHESTRATES only (`Agent` to spawn + `SendMessage` to steer)
- **Serializing 3+ files onto one executor** → SPLIT by exclusive file ownership and announce it; asking permission for every split is its own anti-pattern
- **Writing to deployed dir** → ALWAYS work in dev repo, rsync after
- **Destructive action inside an agent brief** → FORBIDDEN. An in-flight agent cannot be reliably countermanded (messages are delivered between its turns — the original brief executes anyway). Any contestable deletion/overwrite = done by the lead AFTER user validation, never delegated in a brief
