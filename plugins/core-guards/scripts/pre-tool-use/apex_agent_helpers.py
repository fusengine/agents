"""Helpers for require-apex-agents.py — session-wide checks and trivial edit counter."""
import os
import sys
import time
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.state_manager import load_session_state, save_session_state

AGENT_TTL_SECONDS = 120
REQUIRED_AGENTS = ['explore-codebase', 'research-expert']


def check_required_agents(sid):
    """Check if BOTH required agents were called within TTL (2min)."""
    state = load_session_state(sid)
    if not state:
        return False, REQUIRED_AGENTS[:]
    return _scan_agents(state)


def _scan_agents(state):
    """Scan agent/MCP entries within TTL (2min). Matches lead + subagent via substring."""
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
    state = load_session_state(sid)
    if not state or not state.get('brainstorming_required'):
        return True
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


