#!/usr/bin/env python3
"""check-inspiration-read.py - Block Playwright browsing if design-inspiration.md not read."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import allow_pass, emit_pre_tool

TRACKING_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "fusengine-cache", "skill-tracking")
KNOWN_DOMAINS = (
    "framer.website", "webflow.io", "awwwards.com", "godly.website",
    "lapa.ninja", "onepagelove.com", "saasframe.io", "bestwebsite.gallery",
    "landingfolio.com", "localhost",
)
PLUGINS_DIR = os.path.expanduser(
    "~/.claude/plugins/marketplaces/fusengine-plugins/plugins")


def inspiration_was_read(session_id: str) -> bool:
    """Check if design-inspiration was read in session."""
    if not os.path.isdir(TRACKING_DIR):
        return False
    for fname in os.listdir(TRACKING_DIR):
        if session_id not in fname:
            continue
        path = os.path.join(TRACKING_DIR, fname)
        try:
            with open(path, encoding="utf-8") as f:
                content = f.read()
                if "design-inspiration" in content:
                    return True
        except OSError:
            continue
    return False


def deny_block(reason: str) -> None:
    """Emit deny decision and exit."""
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))
    sys.exit(0)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    # Only enforce for design-expert agent
    flag_file = os.path.join(
        os.path.expanduser("~"), ".claude", "fusengine-cache", "design-agent-active")
    if not os.path.isfile(flag_file):
        sys.exit(0)  # Not design-expert -> skip check

    tool_name = data.get("tool_name", "")
    if tool_name != "mcp__playwright__browser_navigate":
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"

    if not inspiration_was_read(session_id):
        deny_block(
            "BLOCKED: You MUST read your inspiration catalog BEFORE browsing. "
            "Read BOTH files NOW: "
            f"1) {PLUGINS_DIR}/design-expert/skills/generating-components/"
            "references/design-inspiration.md "
            f"2) {PLUGINS_DIR}/design-expert/skills/generating-components/"
            "references/design-inspiration-urls.md "
            "Then choose 4 URLs from the catalog and browse them.")

    # Check if URL is from catalog
    tool_input = data.get("tool_input") or {}
    url = tool_input.get("url", "")
    is_catalog_url = any(domain in url for domain in KNOWN_DOMAINS)

    if not is_catalog_url and url:
        emit_pre_tool("allow",
            f"URL '{url}' not in design-inspiration catalog. "
            "Prefer catalog URLs (Framer/Webflow) for verified, high-quality results.",
            context=f"Non-catalog URL detected: {url}")
    else:
        allow_pass("check-inspiration-read", f"pass (catalog URL: {url})")


if __name__ == "__main__":
    main()
