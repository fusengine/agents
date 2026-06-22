#!/usr/bin/env python3
"""PreToolUse hook: Block edits to files over the SOLID limit (FUSE_SOLID_MAX_LINES, default 100)."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from solid_limits import max_lines, split_target  # noqa: E402

CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte|astro)$'
SOLID_MAP = {
    'ts': 'react', 'tsx': 'react', 'js': 'react', 'jsx': 'react',
    'php': 'laravel-expert/skills/solid-php/',
    'swift': 'swift-apple-expert/skills/solid-swift/',
}


def get_solid_ref(fp):
    """Get SOLID reference path for file."""
    ext = fp.rsplit('.', 1)[-1] if '.' in fp else ''
    if ext in ('ts', 'tsx', 'js', 'jsx'):
        d = os.path.dirname(fp)
        if any(os.path.isfile(os.path.join(d, c)) for c in ['next.config.js', 'next.config.ts']):
            return 'nextjs-expert/skills/solid-nextjs/'
        return 'react-expert/skills/solid-react/'
    return SOLID_MAP.get(ext, 'generic/')


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    # Skip file size enforcement for read-only agents (Explore, Plan)
    agent_type = data.get("agent_type", "")
    if agent_type in ("Explore", "Plan"):
        sys.exit(0)
    tool = data.get('tool_name', '')
    fp = data.get('tool_input', {}).get('file_path', '')
    content = data.get('tool_input', {}).get('new_string', '') or data.get('tool_input', {}).get('content', '')
    if not fp or not re.search(CODE_EXT, fp) or not os.path.isfile(fp):
        sys.exit(0)
    try:
        with open(fp, encoding='utf-8') as f:
            cur_lines = sum(1 for _ in f)
    except OSError:
        sys.exit(0)
    limit = max_lines()
    if cur_lines <= limit:
        sys.exit(0)
    if tool == 'Edit':
        sys.exit(0)
    if tool == 'Write' and content:
        new_lines = content.count('\n') + 1
        if new_lines <= limit:
            sys.exit(0)
    fname = os.path.basename(fp)
    ref = get_solid_ref(fp)
    split = split_target()
    plugins = '~/.claude/plugins/marketplaces/fusengine-plugins/plugins'
    reason = (f"BLOCKED: '{fname}' has {cur_lines} lines (max: {limit}). TO SPLIT: "
              f"1) Read SOLID rules: {plugins}/{ref} "
              f"2) Create new module files (<{split} lines each) "
              f"3) Use Write to replace '{fname}' with <{limit} lines version.")
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)


if __name__ == '__main__':
    main()
