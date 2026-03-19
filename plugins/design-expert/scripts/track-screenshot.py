#!/usr/bin/env python3
"""track-screenshot.py - PostToolUse: increment screenshots_count in state."""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pipeline_checks import load_state, save_state, MIN_SCREENSHOTS

_CACHE = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
FLAG_FILE = os.path.join(_CACHE, "design-agent-active")


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    if not os.path.isfile(FLAG_FILE):
        sys.exit(0)
    try:
        with open(FLAG_FILE, encoding="utf-8") as f:
            design_id = f.read().strip()
    except OSError:
        sys.exit(0)
    agent_id = data.get("agent_id") or ""
    if not agent_id or (design_id and agent_id != design_id):
        sys.exit(0)
    state = load_state(agent_id)
    if not state:
        sys.exit(0)
    count = state.get("screenshots_count", 0) + 1
    state["screenshots_count"] = count
    mode = state.get("mode", "full")
    needed = MIN_SCREENSHOTS.get(mode, 4)
    if count >= needed and state.get("current_phase", 0) < 2:
        state["current_phase"] = 2
        phases = state.get("phases_completed", [])
        for p in ("identity", "research"):
            if p not in phases:
                phases.append(p)
        state["phases_completed"] = phases
    save_state(state)


if __name__ == "__main__":
    main()
