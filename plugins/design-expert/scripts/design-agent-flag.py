#!/usr/bin/env python3
"""design-agent-flag.py - Set/clear flag when design-expert agent starts/stops.

SubagentStart: creates flag file
SubagentStop: removes flag file
PreToolUse hooks check this flag to know if design-expert is active.
"""

import json
import os
import sys

FLAG_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "fusengine-cache")
FLAG_FILE = os.path.join(FLAG_DIR, "design-agent-active")


def main() -> None:
    """Handle SubagentStart/Stop events for design-expert flag."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    event = data.get("hook_event_name", "")
    agent_type = data.get("agent_type", "")

    # Only react to design-expert agent
    if "design-expert" not in agent_type and "design" not in agent_type:
        sys.exit(0)

    os.makedirs(FLAG_DIR, exist_ok=True)

    if event == "SubagentStart":
        # Write session_id to flag file so PreToolUse can match
        session_id = data.get("session_id", "")
        with open(FLAG_FILE, "w") as f:
            f.write(session_id)
    elif event == "SubagentStop":
        # Remove flag file
        try:
            os.remove(FLAG_FILE)
        except FileNotFoundError:
            pass

    sys.exit(0)


if __name__ == "__main__":
    main()
