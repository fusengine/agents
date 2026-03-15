## Agent Teams

**Lead = Coordinator ONLY.** Never codes, only orchestrates.

1. **Exclusive file ownership** - NEVER shared edits between teammates
2. **Well-scoped tasks** - Each TaskCreate: target files, expected output, criteria
3. **TaskUpdate mandatory** - Mark `completed` before idle
4. **Max 4 teammates** - Beyond = coordination overhead
5. **80% planning, 20% execution** - Detailed specs = better results
6. **ALWAYS propose TeamCreate** for multi-file tasks — ask user before deciding

## Anti-Patterns (FORBIDDEN)
- **Parallel Agent for multi-file edits** → USE TeamCreate (agents can't coordinate without SendMessage)
- **2 teammates on same file** → CONFLICT guaranteed (one overwrites the other)
- **Lead writing code** → Lead ORCHESTRATES only (TaskCreate + SendMessage)
- **Skipping TeamCreate proposal** → ALWAYS ask user: "Tu veux que je crée une team ?"
- **Writing to deployed dir** → ALWAYS work in dev repo, rsync after
