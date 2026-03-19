#!/usr/bin/env python3
"""pipeline-gate.py - PreToolUse: enforce phase ordering via state file."""

import json
import os
import sys

_SHARED = os.path.join(os.path.expanduser("~"), ".claude", "plugins",
    "marketplaces", "fusengine-plugins", "plugins", "_shared", "scripts")
sys.path.insert(0, _SHARED)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hook_output import allow_pass
from pipeline_checks import (
    check_design_system_write, check_gemini_create,
    check_playwright_navigate, load_state,
)

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
FLAG_FILE = os.path.join(CACHE_DIR, "design-agent-active")


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    if not os.path.isfile(FLAG_FILE):
        sys.exit(0)

    agent_id = data.get("agent_id") or ""
    if not agent_id:
        sys.exit(0)

    state = load_state(agent_id)
    if not state:
        allow_pass("pipeline-gate", "no state file, skipping")
        return

    tool = data.get("tool_name", "")
    fp = (data.get("tool_input") or {}).get("file_path", "")

    if tool in ("Write", "Edit") and os.path.basename(fp) == "design-system.md":
        check_design_system_write(state)
    elif tool == "mcp__gemini-design__create_frontend":
        check_gemini_create(state)
    elif tool == "mcp__playwright__browser_navigate":
        check_playwright_navigate(state)

    allow_pass("pipeline-gate", f"phase {state.get('current_phase', 0)} ok")


if __name__ == "__main__":
    main()
