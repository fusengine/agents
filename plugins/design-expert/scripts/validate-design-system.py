#!/usr/bin/env python3
"""validate-design-system.py - PreToolUse: block create_frontend if design-system.md is generic."""
import json, os, re, sys
from typing import Optional

_SHARED = os.path.join(os.path.expanduser("~"), ".claude", "plugins",
    "marketplaces", "fusengine-plugins", "plugins", "_shared", "scripts")
sys.path.insert(0, _SHARED)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hook_output import allow_pass
from pipeline_checks import load_state, save_state

FORBIDDEN_FONTS = ("Inter", "Roboto", "Arial", "Open Sans")
OKLCH_RE = re.compile(r"oklch\(\s*[\d.]+%?\s+0\.0*[1-9]")
URL_RE = re.compile(r"https?://")
DENY_NOT_FOUND = (
    "BLOCKED: design-system.md not found. RECOVERY: 1) Read identity templates "
    "2) Read design-inspiration.md 3) Browse 4 sites via Playwright "
    "4) Write design-system.md with ## Design Reference, OKLCH, typography, URL "
    "5) Retry mcp__gemini-design__create_frontend")


def _find_design_system() -> Optional[str]:
    """Walk up to 5 parents from cwd looking for design-system.md."""
    check_dir = os.getcwd()
    for _ in range(6):
        candidate = os.path.join(check_dir, "design-system.md")
        if os.path.isfile(candidate):
            return candidate
        parent = os.path.dirname(check_dir)
        if parent == check_dir:
            break
        check_dir = parent
    return None


def _deny(reason: str) -> None:
    """Emit deny block and exit."""
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)


def _validate_content(content: str) -> list[str]:
    """Return list of missing requirements in design-system.md."""
    missing = []
    if "## Design Reference" not in content:
        missing.append("## Design Reference section")
    if not URL_RE.search(content):
        missing.append("reference URL (https://...)")
    if not OKLCH_RE.search(content):
        missing.append("oklch() color with chroma > 0")
    if any(font in content for font in FORBIDDEN_FONTS):
        missing.append("forbidden font found (Inter/Roboto/Arial/Open Sans)")
    return missing


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    if data.get("tool_name") != "mcp__gemini-design__create_frontend":
        sys.exit(0)

    ds_path = _find_design_system()
    if not ds_path:
        _deny(DENY_NOT_FOUND)
    try:
        with open(ds_path, encoding="utf-8") as f:
            content = f.read()
    except OSError:
        sys.exit(0)

    missing = _validate_content(content)
    if missing:
        _deny(
            f"BLOCKED: design-system.md too generic. Missing: {', '.join(missing)}. "
            "RECOVERY: 1) Fix incomplete sections 2) Add ## Design Reference with URL "
            "3) Ensure oklch() chroma > 0.05 4) Replace forbidden fonts "
            "5) Retry mcp__gemini-design__create_frontend")

    agent_id = data.get("agent_id") or ""
    if agent_id:
        state = load_state(agent_id)
        if state:
            state["design_system_valid"] = True
            state["design_system_exists"] = True
            save_state(state)

    allow_pass("validate-design-system", "design-system.md ok")


if __name__ == "__main__":
    main()
