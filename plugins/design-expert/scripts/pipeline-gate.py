#!/usr/bin/env python3
"""pipeline-gate.py - PreToolUse: enforce phase ordering via state file."""

import json
import os
import sys
from datetime import datetime, timezone

_SHARED = os.path.join(os.path.expanduser("~"), ".claude", "plugins",
    "marketplaces", "fusengine-plugins", "plugins", "_shared", "scripts")
sys.path.insert(0, _SHARED)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hook_output import allow_pass
from pipeline_checks import (
    check_design_system_write, check_gemini_create,
    check_playwright_navigate, load_state, save_state,
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
        # Auto-create state file if missing (e.g. teammate context)
        cwd = os.getcwd()
        ds_exists = any(
            os.path.isfile(os.path.join(cwd, f))
            for f in ["design-system.md", "../design-system.md"]
        )
        state = {
            "agent_id": agent_id,
            "mode": "page" if ds_exists else "full",
            "current_phase": 0,
            "phases_completed": [],
            "templates_read": False,
            "inspiration_read": False,
            "screenshots_count": 0,
            "design_system_exists": ds_exists,
            "design_system_valid": False,
            "gemini_calls": 0,
            "auto_review_done": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        save_state(state)

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
