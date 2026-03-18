#!/usr/bin/env python3
"""PreToolUse hook: Require reading SOLID principles before coding."""
import json, os, re, sys, time
from datetime import datetime, timezone
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '_shared', 'scripts'))
from ref_router import route_references
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.state_manager import load_session_state, save_session_state

CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte|astro)$'
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
        cfgs = ('next.config.js', 'next.config.ts', 'next.config.mjs')
        if any(os.path.isfile(os.path.join(os.path.dirname(fp), c)) for c in cfgs):
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

def _check_solid_read(sid, fw):
    """Return True if a SOLID read for *fw* exists in session state within TTL."""
    for r in reversed(load_session_state(sid).get('solid_reads', [])):
        if r.get('framework') != fw:
            continue
        try:
            t = datetime.strptime(r.get('timestamp', ''), '%Y-%m-%dT%H:%M:%SZ')
            return (time.time() - t.replace(tzinfo=timezone.utc).timestamp()) < 120
        except ValueError:
            return False
    return False

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
    fp = data.get('tool_input', {}).get('file_path', '')
    sid = data.get('session_id', '')
    if not fp or not re.search(CODE_EXT, fp):
        sys.exit(0)
    fw = get_framework(fp)
    if not fw or _check_solid_read(sid, fw):
        sys.exit(0)
    state = load_session_state(sid)
    ts = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    root = find_project_root(os.path.dirname(fp))
    state['target'] = {'project': root, 'framework': fw,
                       'set_by': 'require-solid-read.py', 'set_at': ts}
    save_session_state(sid, state)
    skill = SKILL_MAP.get(fw, '')
    routed = route_references(fp, '', os.path.expanduser(f'{P}/{skill}'))
    reason = _build_reason(fp, fw, skill, routed)
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))

if __name__ == '__main__':
    main()
