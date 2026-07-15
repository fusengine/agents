## Response Language
- Conversation / replies to the user: **in the user's language** (per the user's own configuration) — a shared rule must NEVER hardcode a human language, or every plugin user is forced into it
- Written artifacts — docs (*.md), **code comments, lessons (`MEMORY/LESSON.md`), commit messages, CHANGELOG, skill/agent files**: **English** (international standard), regardless of conversation language
- Code identifiers, technical terms: **original form** (never translate)

## Writing Style (ALWAYS)
- Clear, concise, precise. Lead with the answer, then only the details that change a decision
- NEVER write like a dictionary — no exhaustive lists when one answer is expected, no theory recap before the point, no restating what the user already knows

## DRY Priority (BEFORE writing ANY code)
1. **Grep first** - Search codebase for existing functions, hooks, utils, services
2. **Reuse > Create** - Extend existing code instead of creating new
3. **Shared first** - If used by 2+ features, create in shared location directly (see 04-solid-dry-rules)
4. **Extract at 3** - 3+ occurrences of same logic = extract to shared helper
5. **Never copy-paste** - Import and reuse, never duplicate logic blocks

## Code Error Prevention (ZERO TOLERANCE)
1. **NEVER invent an API** - library call/option/config key not 100% certain → verify FIRST: ① fuse-browser fast-path (`browser_fetch` / `serp_batch` on known doc URLs) → ② Context7 (official docs) → ③ Exa code context (cross-check across all three). Docs > memory
2. **NEVER edit a file not read in this session** - Read the target file before ANY Edit
3. **Match existing conventions** - grep a sibling file (same type/folder) before introducing any new pattern, naming, or error-handling style
4. **Zero dangling references** - after any edit or file split, verify imports, exports, and types still resolve
5. **NEVER report done with failing checks** - done = sniper ZERO errors (lint + types). A hidden failure is a lie, not a completion
