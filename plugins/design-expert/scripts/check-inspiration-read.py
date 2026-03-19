#!/usr/bin/env python3
"""check-inspiration-read.py - Block Playwright browsing if design-inspiration.md not read."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import allow_pass, emit_pre_tool

_HOME = os.path.expanduser("~")
_CACHE = os.path.join(_HOME, ".claude", "fusengine-cache")
TRACKING_DIR = os.path.join(_CACHE, "skill-tracking")
FLAG_FILE = os.path.join(_CACHE, "design-agent-active")
KNOWN_DOMAINS = (
    "framer.website", "webflow.io", "awwwards.com", "godly.website",
    "lapa.ninja", "onepagelove.com", "saasframe.io", "bestwebsite.gallery",
    "landingfolio.com",
)
PLUGINS_DIR = os.path.join(_HOME, ".claude", "plugins", "marketplaces",
    "fusengine-plugins", "plugins")
REF = f"{PLUGINS_DIR}/design-expert/skills/3-generating-components/references"


def inspiration_was_read(session_id: str) -> bool:
    """Check if design-inspiration was read in session."""
    if not os.path.isdir(TRACKING_DIR):
        return False
    for fname in os.listdir(TRACKING_DIR):
        if session_id not in fname:
            continue
        try:
            with open(os.path.join(TRACKING_DIR, fname), encoding="utf-8") as f:
                if "design-inspiration" in f.read():
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

    # Only enforce for the active design-expert agent
    if not os.path.isfile(FLAG_FILE):
        sys.exit(0)
    try:
        with open(FLAG_FILE) as f:
            design_agent_id = f.read().strip()
    except OSError:
        sys.exit(0)
    current_agent_id = data.get("agent_id") or ""
    # No agent_id = team lead or main session → skip check
    if not current_agent_id:
        sys.exit(0)
    if design_agent_id and current_agent_id != design_agent_id:
        sys.exit(0)  # Not the design agent → skip check

    if data.get("tool_name", "") != "mcp__playwright__browser_navigate":
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    if not inspiration_was_read(session_id):
        deny_block(
            "BLOCKED: Read your inspiration catalog BEFORE browsing. "
            f"Read BOTH: 1) {REF}/design-inspiration.md "
            f"2) {REF}/design-inspiration-urls.md "
            "Then choose 4 URLs from the catalog and browse them.")

    tool_input = data.get("tool_input") or {}
    url = tool_input.get("url", "")
    is_catalog = any(domain in url for domain in KNOWN_DOMAINS)

    if not is_catalog and url:
        emit_pre_tool("allow",
            f"URL '{url}' not in catalog. Prefer catalog URLs for quality.",
            context=f"Non-catalog URL: {url}")
    else:
        allow_pass("check-inspiration-read", f"pass (catalog URL: {url})")


if __name__ == "__main__":
    main()
