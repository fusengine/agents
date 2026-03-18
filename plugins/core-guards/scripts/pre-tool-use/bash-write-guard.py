#!/usr/bin/env python3
"""PreToolUse hook: Block Bash commands that write files (Edit/Write bypass)."""
import json
import os
import re
import sys

# Add _shared/scripts to path for safe_paths module import
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                '..', '..', '..', '_shared', 'scripts'))
from safe_paths import is_safe_write_path, is_safe_command_target, has_safe_write_target  # pylint: disable=wrong-import-position

CODE_EXT = re.compile(r'\.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java|vue|svelte|astro|css)\b')

SAFE_PREFIXES = [
    'ls', 'pwd', 'which', 'cat ', 'head ', 'tail ', 'wc ', 'file ', 'stat ', 'tree', 'du ', 'df ',
    'find ', 'grep ', 'rg ', 'git ', 'cd ', 'source ', 'export ', 'unset ', 'env ', 'printenv',
    'bun test', 'bun run', 'bunx ', 'npm test', 'npm run', 'npx ', 'biome ', 'eslint ',
    'prettier ', 'ruff ', 'pyright ', 'tsc ', 'mkdir ', 'mv ', 'cp ',
]

DENY_PATTERNS = [
    (r'python3?\s+-\s*<<', 'Python heredoc input'),
    (r'python3?\s+-c\s', 'Python inline script'),
    (r'\bsed\b[^|]*\s-i', 'sed in-place edit'),
    (r'\bperl\b[^|]*\s-[pi]i?\b', 'perl in-place edit'),
    (r'\bawk\b[^|]*-i\s*inplace', 'awk in-place edit'),
    (r'\bpatch\b', 'patch file modification'),
    (r'fusengine-cache/sessions', 'Session state tampering — hook bypass prevention'),
]

NODE_WRITES = r'writeFile|appendFile|createWriteStream|fs\.(write|rename|unlink|mkdir|rmdir|copyFile)|execSync|spawnSync|child_process'  # pylint: disable=line-too-long
RUBY_WRITES = r'File\.(write|open|delete|rename)|IO\.write|FileUtils|\bsystem\b|\bexec\b|`[^`]'

ASK_PATTERNS = [
    (r'\btee\s+[^-/\s]', 'tee to file'),
    (r'\bdd\b[^|]*\bof=', 'dd output to file'),
]


def output_decision(decision, reason):
    """Output hookSpecificOutput JSON for PreToolUse."""
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": decision,
        "permissionDecisionReason": f"BASH WRITE GUARD: {reason}",
    }}))
    sys.exit(0)


def has_file_redirect(cmd):
    """Detect shell output redirections to files (not /dev/null or &)."""
    return bool(re.search(r'(?<![2&\d])\s*>>?\s*(?!/dev/null|&)[a-zA-Z./~$]', cmd))


def main():
    """Entry point: read stdin JSON, evaluate command, output decision."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    cmd = data.get('tool_input', {}).get('command', '')
    if not cmd:
        sys.exit(0)
    stripped = cmd.strip()
    if any(stripped.startswith(p) for p in SAFE_PREFIXES) and not has_file_redirect(stripped):
        sys.exit(0)
    for pattern, desc in DENY_PATTERNS:
        if re.search(pattern, cmd):
            output_decision('deny', f"{desc} — Use Edit/Write tools instead")
    if has_file_redirect(cmd):
        if is_safe_write_path(cmd):
            sys.exit(0)
        if CODE_EXT.search(cmd):
            output_decision('deny', 'Bash redirect to code file — Use Write/Edit tools (enforces APEX + SOLID specs)')
        output_decision('ask', 'Shell redirect to file detected. Authorize?')
    if re.search(r'\bnode\s+-e\b', cmd) and re.search(NODE_WRITES, cmd):
        if has_safe_write_target(cmd):
            sys.exit(0)
        output_decision('ask', 'Node.js write operation detected. Authorize?')
    if re.search(r'\bruby\s+-e\b', cmd) and re.search(RUBY_WRITES, cmd):
        output_decision('ask', 'Ruby write operation detected. Authorize?')
    for pattern, desc in ASK_PATTERNS:
        if re.search(pattern, cmd):
            if is_safe_command_target(cmd):
                sys.exit(0)
            output_decision('ask', f"{desc} detected. Authorize?")
    sys.exit(0)

if __name__ == '__main__':
    main()
