#!/usr/bin/env python3
"""UserPromptSubmit: Detect creation keywords and flag brainstorming as required."""
import json
import os
import re
import sys

STATE_DIR = os.path.join(os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions')

CREATION_KEYWORDS = re.compile(
    r'\b(create|implement|add|build|new|feature|component|generate|make|develop|scaffold)\b',
    re.IGNORECASE,
)
SKIP_KEYWORDS = re.compile(
    r'\b(fix|bug|debug|update|refactor|rename|move|delete|remove|commit|push|status)\b',
    re.IGNORECASE,
)


def main():
    """Detect creation intent in user prompt, flag brainstorming required."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    prompt = data.get('prompt', '')
    sid = data.get('session_id', '') or 'unknown'
    if not prompt or not CREATION_KEYWORDS.search(prompt):
        sys.exit(0)
    if SKIP_KEYWORDS.search(prompt):
        sys.exit(0)
    sf = os.path.join(STATE_DIR, f'session-{sid}-agents.json')
    state = {}
    if os.path.isfile(sf):
        try:
            with open(sf, encoding='utf-8') as f:
                state = json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    state['brainstorming_required'] = True
    try:
        os.makedirs(STATE_DIR, exist_ok=True)
        with open(sf, 'w', encoding='utf-8') as f:
            json.dump(state, f, indent=2)
    except OSError:
        pass
    sys.exit(0)


if __name__ == '__main__':
    main()
