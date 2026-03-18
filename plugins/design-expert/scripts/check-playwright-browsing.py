#!/usr/bin/env python3
"""Block Write/Edit and Gemini MCP calls if < 4 Playwright screenshots taken."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import allow_pass

TRACKING_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "fusengine-cache", "skill-tracking")
MIN_SCREENSHOTS = 4
REF_PATH = "skills/generating-components/references/design-inspiration.md"
EXEMPT_DIRS = ("node_modules/", "dist/", "build/", ".claude/")
DENY_MSG = (
    "BLOCKED: Only {count}/{min} Playwright screenshots taken. "
    "You MUST browse 4 inspiration sites BEFORE writing any code. "
    "Follow your Design Pipeline Phase 1: read {ref}, then use "
    "mcp__playwright__browser_navigate + mcp__playwright__browser_wait_for"
    " + mcp__playwright__browser_take_screenshot with fullPage:true "
    "on 4 different sites from 2 platforms."
)


def count_screenshots(session_id: str) -> int:
    """Count Playwright screenshot entries in tracking files."""
    if not os.path.isdir(TRACKING_DIR):
        return 0
    count = 0
    for fname in os.listdir(TRACKING_DIR):
        if session_id not in fname:
            continue
        path = os.path.join(TRACKING_DIR, fname)
        try:
            with open(path, encoding="utf-8") as f:
                for line in f:
                    if "playwright" in line and "screenshot" in line:
                        count += 1
        except OSError:
            continue
    return count


def deny_block(reason: str) -> None:
    """Emit deny block and exit."""
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))
    sys.exit(0)


def _is_exempt(file_path: str) -> bool:
    """Return True if the file is exempt from screenshot checks."""
    if file_path.endswith(".md"):
        return True
    return any(d in file_path for d in EXEMPT_DIRS)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    needs_check = False

    if tool_name.startswith("mcp__gemini-design__"):
        needs_check = True
    elif tool_name in ("Write", "Edit"):
        file_path = (data.get("tool_input") or {}).get("file_path", "")
        if not _is_exempt(file_path):
            needs_check = True

    if not needs_check:
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    screenshots = count_screenshots(session_id)

    if screenshots >= MIN_SCREENSHOTS:
        allow_pass("check-playwright-browsing",
                   f"pass ({screenshots} screenshots)")
        return

    deny_block(DENY_MSG.format(
        count=screenshots, min=MIN_SCREENSHOTS, ref=REF_PATH))


if __name__ == "__main__":
    main()
