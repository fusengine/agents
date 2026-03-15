"""Helpers for require-apex-agents.py — session-wide checks and trivial edit counter."""
import json
import os
import time
from datetime import datetime

STATE_DIR = os.path.join(os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions')
AGENT_TTL_SECONDS = 120
REQUIRED_AGENTS = ['explore-codebase', 'research-expert']
TRIVIAL_EDIT_WINDOW = 120  # 2 minutes


def _load_agent_state(sid):
    """Load agent state file for a session, return (state, path)."""
    sf = os.path.join(STATE_DIR, f'session-{sid}-agents.json')
    if not os.path.isfile(sf):
        return None, sf
    try:
        with open(sf, encoding='utf-8') as f:
            return json.load(f), sf
    except (json.JSONDecodeError, OSError):
        return None, sf


def check_required_agents(sid):
    """Check if BOTH required agents were called within TTL (2min)."""
    state, _ = _load_agent_state(sid)
    if not state:
        return False, REQUIRED_AGENTS[:]
    return _scan_agents(state)


def _scan_agents(state):
    """Scan agent entries within TTL window (2min). No exceptions."""
    agents = state.get('agents', [])
    if not agents:
        return False, REQUIRED_AGENTS[:]
    now = time.time()
    found = set()
    for entry in reversed(agents):
        if not isinstance(entry, dict):
            continue
        ts = entry.get('timestamp', '')
        try:
            dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
            if (now - dt.timestamp()) > AGENT_TTL_SECONDS:
                break
        except (ValueError, AttributeError, TypeError, OverflowError):
            continue
        agent_type = entry.get('type', '')
        quality = entry.get('quality', 'insufficient')
        for req in REQUIRED_AGENTS:
            if req in agent_type and quality == 'sufficient':
                found.add(req)
    missing = [r for r in REQUIRED_AGENTS if r not in found]
    return len(missing) == 0, missing


def check_brainstorm_done(sid):
    """Check if brainstorming agent was called with sufficient quality."""
    state, _ = _load_agent_state(sid)
    if not state:
        return True  # No state file = flag never written = not required
    if not state.get('brainstorming_required'):
        return True  # Not required, skip check
    now = time.time()
    for entry in reversed(state.get('agents', [])):
        if not isinstance(entry, dict):
            continue
        ts = entry.get('timestamp', '')
        try:
            dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
            if (now - dt.timestamp()) > AGENT_TTL_SECONDS:
                break
        except (ValueError, AttributeError, TypeError, OverflowError):
            continue
        if 'brainstorming' in entry.get('type', ''):
            return entry.get('quality', '') == 'sufficient'
    return False


def increment_trivial_edit_counter(sid):
    """Increment trivial edit counter, return count of edits in last 2 min."""
    state, sf = _load_agent_state(sid)
    if state is None:
        state = {}
    now = time.time()
    edits = state.get('trivial_edits', [])
    cutoff = now - TRIVIAL_EDIT_WINDOW
    edits = [ts for ts in edits if ts > cutoff]
    edits.append(now)
    state['trivial_edits'] = edits
    try:
        os.makedirs(os.path.dirname(sf), exist_ok=True)
        with open(sf, 'w', encoding='utf-8') as f:
            json.dump(state, f, indent=2)
    except OSError:
        pass
    return len(edits)
