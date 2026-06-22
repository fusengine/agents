#!/usr/bin/env python3
"""PostToolUse hook: Warn when files exceed the SOLID limit (FUSE_SOLID_MAX_LINES, default 100)."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from solid_limits import max_lines, split_target  # noqa: E402

CODE_EXTENSIONS = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte|astro)$'

SOLID_REF_MAP = {
    'ts': 'react', 'tsx': 'react', 'js': 'react', 'jsx': 'react',
    'php': 'laravel-expert/skills/solid-php/',
    'swift': 'swift-apple-expert/skills/solid-swift/',
    'py': 'generic/solid-python/',
    'go': 'generic/solid-go/',
}


def get_solid_reference(file_path):
    """Get SOLID reference path based on file extension."""
    ext = file_path.rsplit('.', 1)[-1] if '.' in file_path else ''
    if ext in ('ts', 'tsx', 'js', 'jsx'):
        for cfg in ['next.config.js', 'next.config.ts', 'next.config.mjs']:
            if os.path.isfile(cfg):
                return 'nextjs-expert/skills/solid-nextjs/'
        return 'react-expert/skills/solid-react/'
    return SOLID_REF_MAP.get(ext, 'generic/')


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    file_path = data.get('tool_input', {}).get('file_path', '')
    if not file_path:
        sys.exit(0)
    if not re.search(CODE_EXTENSIONS, file_path):
        sys.exit(0)
    if not os.path.isfile(file_path):
        sys.exit(0)

    try:
        with open(file_path, encoding='utf-8') as f:
            lines = sum(1 for _ in f)
    except OSError:
        sys.exit(0)

    if lines > max_lines():
        filename = os.path.basename(file_path)
        solid_ref = get_solid_reference(file_path)
        plugins = '~/.claude/plugins/marketplaces/fusengine-plugins/plugins'
        reason = (
            f"SOLID VIOLATION: '{filename}' has {lines} lines (max: {max_lines()}). "
            f"ACTION REQUIRED: 1) Read SOLID principles: {plugins}/{solid_ref} "
            f"2) Split this file into smaller modules (<{split_target()} lines each) "
            f"3) Follow Single Responsibility Principle."
        )
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": reason
            }
        }))

    sys.exit(0)


if __name__ == '__main__':
    main()
