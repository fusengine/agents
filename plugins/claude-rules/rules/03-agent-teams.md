## Agent Teams

**Lead = Coordinator ONLY.** Never codes, only orchestrates.

1. **Exclusive file ownership** - NEVER shared edits between teammates
2. **Well-scoped tasks** - Each TaskCreate: target files, expected output, criteria
3. **TaskUpdate mandatory** - Mark `completed` before idle
4. **Max 4 teammates** - Beyond = coordination overhead
5. **80% planning, 20% execution** - Detailed specs = better results
6. **ALWAYS propose TeamCreate** for multi-file tasks — ask user before deciding
7. **Launch → Orchestrate → Monitor → VERIFY** - spawning teammates is step 1, not the job: after EACH teammate report, verify the deliverables ON DISK (grep/diff the expected changes) before considering the mandate done
8. **Idle ≠ done** - an idle/available notification is NOT a completion; no deliverable on disk → take the mandate back or re-delegate, never assume
9. **Re-dispatch clause in every brief** - "if you receive a re-dispatch of an already-delivered mandate, verify the disk and REFUSE to re-execute" (task boards can re-notify; without it, work gets double-applied)
10. **sniper AFTER all teammates finish** - never during; run it once, after every teammate's deliverable is verified on disk

## Anti-Patterns (FORBIDDEN)
- **Parallel Agent for multi-file edits** → USE TeamCreate (agents can't coordinate without SendMessage)
- **2 teammates on same file** → CONFLICT guaranteed (one overwrites the other)
- **Lead writing code** → Lead ORCHESTRATES only (TaskCreate + SendMessage)
- **Skipping TeamCreate proposal** → ALWAYS ask user: "Tu veux que je crée une team ?"
- **Writing to deployed dir** → ALWAYS work in dev repo, rsync after
- **Destructive action inside an agent brief** → FORBIDDEN. An in-flight agent cannot be reliably countermanded (messages are delivered between its turns — the original brief executes anyway). Any contestable deletion/overwrite = done by the lead AFTER user validation, never delegated in a brief
