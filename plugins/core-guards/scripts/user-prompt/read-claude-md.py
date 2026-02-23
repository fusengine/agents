#!/usr/bin/env python3
"""UserPromptSubmit hook: Read CLAUDE.md + auto-detect if APEX required."""

import json
import os
import re
import subprocess
import sys
from datetime import datetime

LOG_DIR = os.path.expanduser("~/.claude/logs")
LOG_FILE = os.path.join(LOG_DIR, "hooks.log")


def log(msg):
    """Log with timestamp."""
    try:
        os.makedirs(LOG_DIR, exist_ok=True)
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"[{ts}] [UserPromptSubmit/read-claude-md] {msg}\n")
    except OSError:
        pass


def detect_project_type():
    """Detect project type from current directory."""
    if os.path.isfile("package.json"):
        try:
            with open("package.json", encoding="utf-8") as f:
                content = f.read()
            if "next" in content:
                return "nextjs"
            if "react" in content:
                return "react"
        except OSError:
            pass
    if os.path.isfile("composer.json") and os.path.isfile("artisan"):
        return "laravel"
    if os.path.isfile("Package.swift"):
        return "swift"
    try:
        result = subprocess.run(["ls", "*.xcodeproj"], capture_output=True, check=False)
        if result.returncode == 0:
            return "swift"
    except (subprocess.SubprocessError, FileNotFoundError):
        pass
    return "generic"


def build_apex_instruction(project_type):
    """Build APEX workflow instruction."""
    return (
        f"INSTRUCTION: This is a development task. Use APEX methodology:\n\n"
        f"**TRACKING FILE**: [project]/.claude/apex/task.json\n\n"
        f"1. **ANALYZE** (3 AGENTS IN PARALLEL):\n"
        f"   - explore-codebase + research-expert + general-purpose\n"
        f"   - Project type: {project_type}\n\n"
        f"2. **PLAN**: TaskCreate (<100 lines per file)\n\n"
        f"3. **EXECUTE**: {project_type}-expert, SOLID principles\n\n"
        f"4. **EXAMINE**: Run sniper agent after ANY modification"
    )


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    prompt = data.get("userPrompt", "")
    claude_md = os.path.expanduser("~/.claude/CLAUDE.md")
    if not os.path.isfile(claude_md):
        log("ERROR: CLAUDE.md not found")
        sys.exit(0)
    try:
        with open(claude_md, encoding="utf-8") as f:
            claude_content = f.read()
    except OSError:
        sys.exit(0)
    print("memory: CLAUDE.md loaded", file=sys.stderr)
    apex = ""
    dev_verbs = (
        r"(cr[ée]er|impl[ée]menter|ajouter|d[ée]velopper|construire|"
        r"build|refactor|migrer|implement|create|add|develop)"
    )
    if re.search(dev_verbs, prompt, re.IGNORECASE):
        pt = detect_project_type()
        apex = build_apex_instruction(pt)
        log(f"APEX auto-triggered for dev task (project: {pt})")
    full = (
        f"{apex}\n\n# CLAUDE.md\n{claude_content}"
        if apex
        else f"# CLAUDE.md\n{claude_content}"
    )
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "UserPromptSubmit",
                    "additionalContext": full,
                }
            }
        )
    )
    log(f"CLAUDE.md injected{'+ APEX' if apex else ''}")
    sys.exit(0)


if __name__ == "__main__":
    main()
