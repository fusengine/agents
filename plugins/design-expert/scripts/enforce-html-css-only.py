#!/usr/bin/env python3
"""PreToolUse: Block design-expert from writing non-HTML/CSS files."""
import json, os, re, sys

_SHARED = os.path.join(os.path.expanduser("~"), ".claude", "plugins",
    "marketplaces", "fusengine-plugins", "plugins", "_shared", "scripts")
sys.path.insert(0, _SHARED)
from hook_output import allow_pass

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
FLAG_FILE = os.path.join(CACHE_DIR, "design-agent-active")
ALLOWED_EXT = re.compile(r'\.(html|css|md|json)$')
EXEMPT_DIRS = ("node_modules/", "dist/", "build/", ".claude/")

DENY_MSG = (
    "BLOCKED: design-expert can only write .html, .css, .md, and .json files. "
    "Framework files (.tsx, .astro, .vue, .swift, .php) must be written by "
    "the domain expert (astro-expert, react-expert, etc.) AFTER design validation.")


def main() -> None:
    """Block non-HTML/CSS writes when design-expert is active."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    if not os.path.isfile(FLAG_FILE):
        sys.exit(0)
    try:
        with open(FLAG_FILE) as f:
            design_agent_id = f.read().strip()
    except OSError:
        sys.exit(0)
    current_agent_id = data.get("agent_id") or ""
    if not current_agent_id:
        sys.exit(0)
    if design_agent_id and current_agent_id != design_agent_id:
        sys.exit(0)
    fp = (data.get("tool_input") or {}).get("file_path", "")
    if not fp:
        sys.exit(0)
    if any(d in fp for d in EXEMPT_DIRS):
        sys.exit(0)
    if ALLOWED_EXT.search(fp):
        allow_pass("enforce-html-css-only", f"allowed: {os.path.basename(fp)}")
        return
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": DENY_MSG}}))


if __name__ == "__main__":
    main()