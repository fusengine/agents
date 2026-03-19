#!/usr/bin/env python3
"""check-inspiration-read.py - Block Playwright if identity or inspiration not read."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import allow_pass

_HOME = os.path.expanduser("~")
_CACHE = os.path.join(_HOME, ".claude", "fusengine-cache")
TRACKING_DIR = os.path.join(_CACHE, "skill-tracking")
FLAG_FILE = os.path.join(_CACHE, "design-agent-active")
KNOWN_DOMAINS = (
    "framer.website", "webflow.io", "awwwards.com", "godly.website",
    "lapa.ninja", "onepagelove.com", "saasframe.io", "bestwebsite.gallery",
    "landingfolio.com",
)
SKILLS = f"{_HOME}/.claude/plugins/marketplaces/fusengine-plugins/plugins/design-expert/skills"


def _tracking_has(session_id: str, keyword: str) -> bool:
    if not os.path.isdir(TRACKING_DIR):
        return False
    for fname in os.listdir(TRACKING_DIR):
        if session_id not in fname:
            continue
        try:
            with open(os.path.join(TRACKING_DIR, fname), encoding="utf-8") as f:
                if keyword in f.read():
                    return True
        except OSError:
            continue
    return False


def _deny(reason: str) -> None:
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    if not os.path.isfile(FLAG_FILE):
        sys.exit(0)
    try:
        with open(FLAG_FILE, encoding="utf-8") as f:
            design_id = f.read().strip()
    except OSError:
        sys.exit(0)
    agent_id = data.get("agent_id") or ""
    if not agent_id or (design_id and agent_id != design_id):
        sys.exit(0)
    if data.get("tool_name") != "mcp__playwright__browser_navigate":
        sys.exit(0)

    sid = data.get("session_id") or f"fallback-{os.getpid()}"

    if not _tracking_has(sid, "identity-system"):
        _deny(f"BLOCKED: Phase 0 not done. READ: {SKILLS}/0-identity-system/SKILL.md first.")

    if not _tracking_has(sid, "design-inspiration"):
        _deny(f"BLOCKED: Read inspiration catalog first. READ: {SKILLS}/1-designing-systems/references/design-inspiration.md + design-inspiration-urls.md")

    url = (data.get("tool_input") or {}).get("url", "")
    if url and not any(d in url for d in KNOWN_DOMAINS):
        _deny(f"BLOCKED: '{url}' not in catalog. Use URLs from design-inspiration-urls.md. Domains: {', '.join(KNOWN_DOMAINS)}")

    allow_pass("check-inspiration-read", f"pass ({url})")


if __name__ == "__main__":
    main()
