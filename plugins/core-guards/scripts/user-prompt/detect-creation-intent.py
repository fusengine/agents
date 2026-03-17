#!/usr/bin/env python3
"""UserPromptSubmit: Detect creation keywords and flag brainstorming as required."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.state_manager import load_session_state, save_session_state

CREATION_KEYWORDS = re.compile(
    r'\b(create|implement|add|build|new|feature|component|generate|make|develop|scaffold)\b',
    re.IGNORECASE,
)
SKIP_KEYWORDS = re.compile(
    r'\b(fix|bug|debug|update|refactor|rename|move|delete|remove|commit|push|status'
    r'|edit|modify|change|adjust|tweak|existing|current)\b',
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
    if not prompt or not CREATION_KEYWORDS.search(prompt) or SKIP_KEYWORDS.search(prompt):
        state = load_session_state(sid)
        state['brainstorming_required'] = False
        save_session_state(sid, state)
        sys.exit(0)
    state = load_session_state(sid)
    state['brainstorming_required'] = True
    save_session_state(sid, state)
    sys.exit(0)


if __name__ == '__main__':
    main()
