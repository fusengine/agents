#!/usr/bin/env python3
"""check-skill-common.py - Common skill check functions.

Importable functions (no main).
"""

import json
import os
import sys


def find_project_root(start_dir: str, *markers: str) -> str:
    """Find project root by walking up and checking for marker files."""
    d = os.path.abspath(start_dir)
    while d != "/":
        for marker in markers:
            if os.path.exists(os.path.join(d, marker)):
                return d
        d = os.path.dirname(d)
    return os.getcwd()


def skill_was_consulted(framework: str, session_id: str,
                        project_root: str) -> bool:
    """Check if a skill was consulted (session tracking or APEX)."""
    from tracking import TRACKING_DIR
    tracking = os.path.join(TRACKING_DIR, f"{framework}-{session_id}")
    if os.path.isfile(tracking):
        return True
    task_file = os.path.join(project_root, ".claude", "apex", "task.json")
    if os.path.isfile(task_file):
        try:
            with open(task_file, encoding="utf-8") as f:
                data = json.load(f)
            task_id = str(data.get("current_task", "1"))
            task = data.get("tasks", {}).get(task_id, {})
            doc = task.get("doc_consulted", {}).get(framework, {})
            if isinstance(doc, dict) and doc.get("consulted") is True:
                return True
        except (json.JSONDecodeError, OSError):
            pass
    return False


def specific_skill_consulted(framework: str, skill_name: str,
                             session_id: str) -> bool:
    """Check if a specific skill was read by scanning tracking file contents."""
    from tracking import TRACKING_DIR
    tracking = os.path.join(TRACKING_DIR, f"{framework}-{session_id}")
    if not os.path.isfile(tracking):
        return False
    try:
        with open(tracking, encoding="utf-8") as f:
            content = f.read()
        return f"skills/{skill_name}/" in content
    except OSError:
        return False


def mcp_research_done(session_id: str) -> bool:
    """Check if MCP research (Context7/Exa) was done in this session."""
    from tracking import TRACKING_DIR
    generic = os.path.join(TRACKING_DIR, f"generic-{session_id}")
    if not os.path.isfile(generic):
        return False
    try:
        with open(generic, encoding="utf-8") as f:
            content = f.read()
        return "context7:" in content and "exa:" in content
    except OSError:
        return False


def deny_block(reason: str) -> None:
    """Output hookSpecificOutput deny block (PreToolUse) and exit."""
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)
