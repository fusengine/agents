#!/usr/bin/env python3
"""PreToolUse hook: Require reading SOLID principles before coding."""
import json, os, re, sys, time
from datetime import datetime, timezone
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '_shared', 'scripts'))
from ref_router import route_references

CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$'
FW_MAP = {'ts': None, 'tsx': None, 'js': None, 'jsx': None, 'vue': None, 'svelte': None,
          'php': 'php', 'swift': 'swift', 'java': 'java', 'go': 'go', 'rb': 'ruby', 'rs': 'rust'}
SKILL_MAP = {'react': 'react-expert/skills/solid-react', 'nextjs': 'nextjs-expert/skills/solid-nextjs',
             'php': 'laravel-expert/skills/solid-php', 'swift': 'swift-apple-expert/skills/solid-swift',
             'generic': 'solid/skills/solid-generic', 'java': 'solid/skills/solid-java',
             'go': 'solid/skills/solid-go', 'ruby': 'solid/skills/solid-ruby', 'rust': 'solid/skills/solid-rust'}
P = '~/.claude/plugins/marketplaces/fusengine-plugins/plugins'

def get_framework(fp):
    """Detect framework from file extension."""
    ext = fp.rsplit('.', 1)[-1] if '.' in fp else ''
    if ext in ('ts', 'tsx', 'js', 'jsx', 'vue', 'svelte'):
        if any(os.path.isfile(os.path.join(os.path.dirname(fp), c)) for c in ('next.config.js', 'next.config.ts', 'next.config.mjs')):
            return 'nextjs'
        return 'react'
    return FW_MAP.get(ext, '')

def find_project_root(d):
    """Walk up to find project root."""
    while d != '/':
        if any(os.path.exists(os.path.join(d, m)) for m in ('package.json', 'composer.json')):
            return d
        if os.path.isdir(os.path.join(d, '.git')):
            return d
        d = os.path.dirname(d)
    return os.getcwd()

def _build_reason(fp, fw, skill, routed):
    """Build deny reason with routed references."""
    if not routed:
        return f"BLOCKED: Read SOLID first (2min): {P}/{skill}/SKILL.md"
    ln = [f"BLOCKED: Read SOLID refs (2min) for {fw}.", f"Editing: {fp}", "Required:"]
    for i, r in enumerate(routed['required'], 1):
        ln.append(f"  {i}. {r['meta']['filePath']}")
    if routed.get('optional'):
        ln.append("Optional:")
        for i, r in enumerate(routed['optional'], len(routed['required']) + 1):
            ln.append(f"  {i}. {r['meta']['filePath']}")
    ln.append(f"Full: {P}/{skill}/SKILL.md")
    return '\n'.join(ln)

def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    fp, sid = data.get('tool_input', {}).get('file_path', ''), data.get('session_id', '')
    if not fp or not re.search(CODE_EXT, fp):
        sys.exit(0)
    fw = get_framework(fp)
    if not fw:
        sys.exit(0)
    log_dir = os.path.expanduser('~/.claude/logs/00-apex')
    os.makedirs(log_dir, exist_ok=True)
    valid, log_file = False, os.path.join(log_dir, 'solid-reads.json')
    if os.path.isfile(log_file):
        try:
            reads = json.load(open(log_file, encoding='utf-8')).get('reads', [])
            matches = [r for r in reads if r.get('framework') == fw and r.get('session') == sid]
            if matches:
                try:
                    t = datetime.strptime(matches[-1].get('timestamp', ''), '%Y-%m-%dT%H:%M:%SZ')
                    valid = (time.time() - t.replace(tzinfo=timezone.utc).timestamp()) < 120
                except ValueError:
                    pass
        except (json.JSONDecodeError, OSError):
            pass
    if valid:
        sys.exit(0)
    now, root = datetime.now(), find_project_root(os.path.dirname(fp))
    ts = now.strftime('%Y-%m-%dT%H:%M:%SZ')
    state_file = os.path.join(log_dir, f'{now.strftime("%Y-%m-%d")}-state.json')
    try:
        with open(state_file, encoding='utf-8') as f:
            state = json.load(f)
    except (json.JSONDecodeError, OSError, FileNotFoundError):
        state = {'$schema': 'apex-state-v1', 'target': {}}
    state['target'] = {'project': root, 'framework': fw, 'set_by': 'require-solid-read.py', 'set_at': ts}
    try:
        with open(state_file, 'w', encoding='utf-8') as f:
            json.dump(state, f)
    except OSError:
        pass
    skill = SKILL_MAP.get(fw, '')
    routed = route_references(fp, '', os.path.expanduser(f'{P}/{skill}'))
    reason = _build_reason(fp, fw, skill, routed)
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))

if __name__ == '__main__':
    main()
