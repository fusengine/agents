#!/usr/bin/env python3
"""PreToolUse hook: Require reading SOLID principles before coding."""
import json
import os
import re
import sys
import time
from datetime import datetime, timezone

CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$'
FW_MAP = {'ts': None, 'tsx': None, 'js': None, 'jsx': None, 'vue': None, 'svelte': None,
          'php': 'php', 'swift': 'swift'}
SKILL_MAP = {'react': 'react-expert/skills/solid-react', 'nextjs': 'nextjs-expert/skills/solid-nextjs',
             'php': 'laravel-expert/skills/solid-php', 'swift': 'swift-apple-expert/skills/solid-swift'}


def get_framework(fp):
    """Detect framework from file extension."""
    ext = fp.rsplit('.', 1)[-1] if '.' in fp else ''
    if ext in ('ts', 'tsx', 'js', 'jsx', 'vue', 'svelte'):
        d = os.path.dirname(fp)
        for cfg in ['next.config.js', 'next.config.ts', 'next.config.mjs']:
            if os.path.isfile(os.path.join(d, cfg)):
                return 'nextjs'
        return 'react'
    return FW_MAP.get(ext, '')


def find_project_root(directory):
    """Walk up to find project root."""
    d = directory
    while d != '/':
        for m in ['package.json', 'composer.json']:
            if os.path.exists(os.path.join(d, m)):
                return d
        if os.path.isdir(os.path.join(d, '.git')):
            return d
        d = os.path.dirname(d)
    return os.getcwd()


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    fp = data.get('tool_input', {}).get('file_path', '')
    sid = data.get('session_id', '')
    if not fp or not re.search(CODE_EXT, fp):
        sys.exit(0)
    fw = get_framework(fp)
    if not fw:
        sys.exit(0)
    log_dir = os.path.expanduser('~/.claude/logs/00-apex')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, 'solid-reads.json')
    valid = False
    if os.path.isfile(log_file):
        try:
            with open(log_file, encoding='utf-8') as f:
                reads = json.load(f).get('reads', [])
            matches = [r for r in reads if r.get('framework') == fw and r.get('session') == sid]
            if matches:
                last_ts = matches[-1].get('timestamp', '')
                try:
                    read_epoch = datetime.strptime(last_ts, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc).timestamp()
                    valid = (time.time() - read_epoch) < 120
                except ValueError:
                    pass
        except (json.JSONDecodeError, OSError):
            pass
    if valid:
        sys.exit(0)
    root = find_project_root(os.path.dirname(fp))
    today = datetime.now().strftime('%Y-%m-%d')
    ts = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    state_file = os.path.join(log_dir, f'{today}-state.json')
    state = {'$schema': 'apex-state-v1', 'target': {}}
    if os.path.isfile(state_file):
        try:
            with open(state_file, encoding='utf-8') as f:
                state = json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    state['target'] = {'project': root, 'framework': fw, 'set_by': 'require-solid-read.py', 'set_at': ts}
    try:
        with open(state_file, 'w', encoding='utf-8') as f:
            json.dump(state, f)
    except OSError:
        pass
    skill = SKILL_MAP.get(fw, '')
    plugins = '~/.claude/plugins/marketplaces/fusengine-plugins/plugins'
    reason = f"BLOCKED: Read SOLID first (expires every 2min): {plugins}/{skill}/SKILL.md"
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)


if __name__ == '__main__':
    main()
