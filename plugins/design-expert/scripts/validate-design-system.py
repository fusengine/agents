#!/usr/bin/env python3
"""validate-design-system.py - PreToolUse: block create_frontend if design-system.md is generic."""
import json, os, re, sys
from typing import Optional

_SHARED = os.path.join(os.path.expanduser("~"), ".claude", "plugins",
    "marketplaces", "fusengine-plugins", "plugins", "_shared", "scripts")
sys.path.insert(0, _SHARED)
from hook_output import allow_pass

FORBIDDEN_FONTS = ("Inter", "Roboto", "Arial", "Open Sans")
OKLCH_RE = re.compile(r"oklch\(\s*[\d.]+%?\s+0\.0*[1-9]")
URL_RE = re.compile(r"https?://")
DENY_NOT_FOUND = (
    "BLOCKED: design-system.md not found in project tree. "
    "Create it first using identity templates in "
    "skills/identity-system/references/templates/."
)
DENY_GENERIC = (
    "BLOCKED: design-system.md is too generic. Required: "
    "## Design Reference section, a reference URL (https://...), "
    "at least one oklch() color with non-zero chroma, "
    "and no generic fonts (Inter/Roboto/Arial/Open Sans)."
)


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
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)


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

    has_ref_section = "## Design Reference" in content
    has_url = bool(URL_RE.search(content))
    has_oklch = bool(OKLCH_RE.search(content))
    has_forbidden = any(font in content for font in FORBIDDEN_FONTS)

    if not has_ref_section or not has_url or not has_oklch or has_forbidden:
        _deny(DENY_GENERIC)

    allow_pass("validate-design-system", "design-system.md ok")


if __name__ == "__main__":
    main()
