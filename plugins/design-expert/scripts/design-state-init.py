#!/usr/bin/env python3
"""design-state-init.py - SubagentStart: create .design-state-{agent_id}.json."""

import json
import os
import sys
from datetime import datetime, timezone

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")


def _detect_mode(data: dict) -> str:
    """Detect pipeline mode from context: full, page, or component."""
    prompt = (data.get("prompt") or "").lower()
    if any(kw in prompt for kw in ("component", "composant", "snippet")):
        return "component"
    ds_path = os.path.join(os.getcwd(), "design-system.md")
    if os.path.isfile(ds_path):
        return "page"
    return "full"


def main() -> None:
    """Create state file on SubagentStart."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    if data.get("hook_event_name") != "SubagentStart":
        sys.exit(0)

    agent_type = data.get("agent_type", "")
    if "design" not in agent_type:
        sys.exit(0)

    agent_id = data.get("agent_id", "")
    if not agent_id:
        sys.exit(0)

    os.makedirs(CACHE_DIR, exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    mode = _detect_mode(data)

    state = {
        "agent_id": agent_id,
        "mode": mode,
        "current_phase": 0,
        "phases_completed": [],
        "templates_read": False,
        "inspiration_read": False,
        "screenshots_count": 0,
        "design_system_exists": os.path.isfile(
            os.path.join(os.getcwd(), "design-system.md")),
        "design_system_valid": False,
        "gemini_calls": 0,
        "auto_review_done": False,
        "created_at": now,
        "updated_at": now,
    }

    state_file = os.path.join(CACHE_DIR, f".design-state-{agent_id}.json")
    with open(state_file, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

    sys.exit(0)


if __name__ == "__main__":
    main()
