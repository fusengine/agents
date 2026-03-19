#!/usr/bin/env python3
"""guard-state-files.py - PreToolUse: block agent from modifying state files."""

import json
import os
import sys

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
    fp = (data.get("tool_input") or {}).get("file_path", "")
    if ".design-state-" in fp:
        print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
            "permissionDecision": "deny", "permissionDecisionReason":
            "BLOCKED: .design-state files are READ-ONLY for you. "
            "Hooks update them automatically as you progress. "
            "Do NOT try to modify them — it will not unblock you. "
            "Follow the pipeline: Phase 0→1→2→3→4→5→6 in order."}}))
        sys.exit(0)


if __name__ == "__main__":
    main()
