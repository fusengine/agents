#!/usr/bin/env python3
"""validate-design.py - PostToolUse hook: validate design + advance state."""

import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import post_pass

sys.path.insert(0, os.path.dirname(__file__))
from design_checks import run_all_checks
from pipeline_checks import load_state, save_state

_CACHE = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
_FLAG = os.path.join(_CACHE, "design-agent-active")


def _advance_state_for_ds(agent_id: str) -> None:
    """Advance pipeline state when design-system.md is written."""
    state = load_state(agent_id)
    if not state:
        return
    state["design_system_exists"] = True
    state["design_system_valid"] = True
    state["current_phase"] = max(state.get("current_phase", 0), 3)
    phases = state.get("phases_completed", [])
    if "design-system" not in phases:
        phases.append("design-system")
    state["phases_completed"] = phases
    save_state(state)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    file_path = (data.get("tool_input") or {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)

    # Auto-advance state when design-system.md is written
    if os.path.basename(file_path) == "design-system.md":
        if os.path.isfile(_FLAG):
            try:
                with open(_FLAG, encoding="utf-8") as f:
                    _advance_state_for_ds(f.read().strip())
            except OSError:
                pass
        post_pass("validate-design", "design-system.md → phase 3")
        return

    if not re.search(r"\.(tsx|jsx|css)$", file_path):
        sys.exit(0)

    if not os.path.isfile(file_path):
        sys.exit(0)

    try:
        with open(file_path, encoding="utf-8") as f:
            content = f.read()
    except OSError:
        sys.exit(0)

    warnings = run_all_checks(content)

    if warnings:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": " ".join(warnings),
            }
        }))

    post_pass("validate-design", "design ok")


if __name__ == "__main__":
    main()
