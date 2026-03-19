#!/usr/bin/env python3
"""track-skill-read.py - Track skill file reads for design-expert."""

import json
import os
import re
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pipeline_checks import load_state, save_state

FRAMEWORK = "design"
_CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
FLAG_FILE = os.path.join(_CACHE_DIR, "design-agent-active")


def track_skill_read(framework: str, skill: str, topic: str, session_id: str) -> None:
    """Write tracking entry to TRACKING_DIR."""
    from tracking import TRACKING_DIR
    tracking_dir = TRACKING_DIR
    os.makedirs(tracking_dir, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    entry = f"{timestamp} SKILL:{skill} {topic}\n"
    with open(os.path.join(tracking_dir, f"{framework}-{session_id}"), "a", encoding="utf-8") as f:
        f.write(entry)
    if framework != "generic":
        with open(os.path.join(tracking_dir, f"generic-{session_id}"), "a", encoding="utf-8") as f:
            f.write(entry)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    if data.get("tool_name") != "Read":
        sys.exit(0)

    file_path = (data.get("tool_input") or {}).get("file_path", "")
    if not re.search(r"skills/.*\.(md|txt)$", file_path):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    track_skill_read(FRAMEWORK, "skill:Read", file_path, session_id)

    # Update state if a design agent is active
    if not os.path.isfile(FLAG_FILE):
        sys.exit(0)
    try:
        with open(FLAG_FILE, encoding="utf-8") as f:
            agent_id = f.read().strip()
    except OSError:
        sys.exit(0)
    if not agent_id:
        sys.exit(0)
    state = load_state(agent_id)
    if not state:
        sys.exit(0)
    if "identity-system" in file_path or "0-identity-system" in file_path:
        state["templates_read"] = True
    if "design-inspiration" in file_path:
        state["inspiration_read"] = True
    save_state(state)
    sys.exit(0)


if __name__ == "__main__":
    main()
