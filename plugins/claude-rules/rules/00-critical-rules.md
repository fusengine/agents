## Response Language
- Documentation files (*.md): **English** (international standard)
- Code identifiers, technical terms: **original form**

## DRY Priority (BEFORE writing ANY code)
1. **Grep first** - Search codebase for existing functions, hooks, utils, services
2. **Reuse > Create** - Extend existing code instead of creating new
3. **Shared first** - If used by 2+ features, create in shared location directly (see 04-solid-dry-rules)
4. **Extract at 3** - 3+ occurrences of same logic = extract to shared helper
5. **Never copy-paste** - Import and reuse, never duplicate logic blocks
