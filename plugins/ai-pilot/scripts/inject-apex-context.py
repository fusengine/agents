#!/usr/bin/env python3
"""inject-apex-context.py - PreToolUse hook for Task (agent launch).

Injects APEX rules into sub-agent prompt via hookSpecificOutput.additionalContext.
Pattern: hookify (json.load/sys.exit/print json.dumps).
"""

import json
import os
import sys


def load_task_state(task_file: str) -> tuple[str, str, str, str]:
    """Read current task state from task.json.

    Returns: (task_id, subject, phase, doc_status)
    """
    try:
        with open(task_file, encoding="utf-8") as f:
            data = json.load(f)
        task_id = str(data.get("current_task", "1"))
        task = data.get("tasks", {}).get(task_id, {})
        subject = task.get("subject", "")
        phase = task.get("phase", "analyze")
        consulted = [
            k for k, v in task.get("doc_consulted", {}).items()
            if isinstance(v, dict) and v.get("consulted")
        ]
        return task_id, subject, phase, ", ".join(consulted) or "none"
    except (json.JSONDecodeError, KeyError, TypeError, OSError):
        return "1", "", "analyze", "none"


def build_context(task_id: str, subject: str, phase: str, docs: str) -> str:
    """Build the APEX context string for injection."""
    return (
        f"⚠️ APEX MODE - Read .claude/apex/AGENTS.md for rules\n\n"
        f"Current: Task #{task_id} - {subject} (Phase: {phase})\n"
        f"Docs consulted: {docs}\n\n"
        f"Agent must:\n"
        f"1. Read task.json → find last 3 completed tasks\n"
        f"2. Read their notes in docs/ (task-{{ID}}-{{subject}}.md)\n"
        f"3. TaskList → see pending tasks\n"
        f"4. TaskUpdate(in_progress) → before starting\n"
        f"5. Apply SOLID (files < 100 lines)\n"
        f"6. Write notes to docs/task-{{ID}}-{{subject}}.md\n"
        f"7. TaskUpdate(completed) → triggers auto-commit"
    )


def main() -> None:
    """Main entry point for PreToolUse Task hook."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    if data.get("tool_name") != "Task":
        sys.exit(0)

    project_root = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    apex_dir = os.path.join(project_root, ".claude", "apex")

    if not os.path.isdir(apex_dir):
        sys.exit(0)

    task_file = os.path.join(apex_dir, "task.json")
    task_id, subject, phase, docs = load_task_state(task_file)

    print(f"apex: Task #{task_id} context injected", file=sys.stderr)

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "additionalContext": build_context(task_id, subject, phase, docs),
        }
    }))


if __name__ == "__main__":
    main()
