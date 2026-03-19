#!/usr/bin/env python3
"""design-state-cleanup.py - SubagentStop: archive state file, clean old ones."""

import json
import os
import sys
import time
from datetime import datetime, timezone

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
MAX_AGE_DAYS = 7


def _archive_state(agent_id: str) -> None:
    """Rename current state file with timestamp suffix."""
    src = os.path.join(CACHE_DIR, f".design-state-{agent_id}.json")
    if not os.path.isfile(src):
        return
    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    dst = os.path.join(CACHE_DIR, f".design-state-{agent_id}-{ts}.json")
    os.rename(src, dst)


def _cleanup_old_states() -> None:
    """Remove archived state files older than MAX_AGE_DAYS."""
    if not os.path.isdir(CACHE_DIR):
        return
    cutoff = time.time() - (MAX_AGE_DAYS * 86400)
    for fname in os.listdir(CACHE_DIR):
        if not fname.startswith(".design-state-"):
            continue
        path = os.path.join(CACHE_DIR, fname)
        try:
            if os.path.getmtime(path) < cutoff:
                os.remove(path)
        except OSError:
            continue


def main() -> None:
    """Archive state and clean old files on SubagentStop."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    if data.get("hook_event_name") != "SubagentStop":
        sys.exit(0)

    agent_type = data.get("agent_type", "")
    if "design" not in agent_type:
        sys.exit(0)

    agent_id = data.get("agent_id", "")
    if agent_id:
        _archive_state(agent_id)

    _cleanup_old_states()
    sys.exit(0)


if __name__ == "__main__":
    main()
