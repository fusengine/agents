#!/usr/bin/env python3
"""PreToolUse: Block screenshot if no scroll was done since last navigate."""
import json
import os
import sys

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
FLAG_FILE = os.path.join(CACHE_DIR, "design-agent-active")
TRACKING_DIR = os.path.join(CACHE_DIR, "skill-tracking")

DENY_MSG = (
    "BLOCKED: You must scroll the page before taking a screenshot. "
    "Use mcp__playwright__browser_evaluate with "
    "window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}) "
    "then wait 5s, scroll back to top, wait 2s, THEN take fullPage screenshot.")


def _scroll_done_since_last_nav(agent_id: str) -> bool:
    """Check agent tracking file for browser_evaluate after last browser_navigate."""
    agent_file = os.path.join(TRACKING_DIR, f"agent-{agent_id}")
    if not os.path.isfile(agent_file):
        return False
    try:
        with open(agent_file, encoding="utf-8") as f:
            lines = f.readlines()
    except OSError:
        return False
    last_nav_idx = -1
    for i, line in enumerate(lines):
        if "browser_navigate" in line:
            last_nav_idx = i
    if last_nav_idx == -1:
        return False
    for line in lines[last_nav_idx + 1:]:
        if "browser_evaluate" in line or "browser_run_code" in line:
            return True
    return False


def main() -> None:
    """Block screenshot without prior scroll."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    if not os.path.isfile(FLAG_FILE):
        sys.exit(0)
    try:
        with open(FLAG_FILE, encoding="utf-8") as f:
            design_agent_id = f.read().strip()
    except OSError:
        sys.exit(0)
    current_agent_id = data.get("agent_id") or ""
    if not current_agent_id:
        sys.exit(0)
    if design_agent_id and current_agent_id != design_agent_id:
        sys.exit(0)
    if not _scroll_done_since_last_nav(current_agent_id):
        print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
            "permissionDecision": "deny", "permissionDecisionReason": DENY_MSG}}))
        return
    sys.exit(0)


if __name__ == "__main__":
    main()
