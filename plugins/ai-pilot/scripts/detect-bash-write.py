"""
detect-bash-write.py — APEX PreToolUse hook
Blocks Bash-based file write bypasses (cat >, tee, echo >, printf >, heredoc).
"""
import json
import re
import sys


CODE_EXT = re.compile(
    r"\.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java|vue|svelte|astro|css)\b"
)

WRITE_PATTERNS = [
    re.compile(r"cat\s*>"),
    re.compile(r"tee\s+"),
    re.compile(r"echo\s+.*>"),
    re.compile(r"printf\s+.*>"),
    re.compile(r"<<\s*['\"]?EOF['\"]?"),
]

DENY_REASON = (
    "APEX BYPASS BLOCKED: Use Write tool instead of Bash to write code files. "
    "Write tool enforces APEX/SOLID documentation requirements."
)


def _deny(reason: str) -> None:
    """Output a deny decision and exit cleanly."""
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))


def main() -> None:
    """Read PreToolUse event from stdin and block Bash file-write bypasses."""
    try:
        event = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    if event.get("tool_name") != "Bash":
        sys.exit(0)

    command: str = event.get("tool_input", {}).get("command", "")
    if not command:
        sys.exit(0)

    has_write_pattern = any(p.search(command) for p in WRITE_PATTERNS)
    targets_code_file = bool(CODE_EXT.search(command))

    if has_write_pattern and targets_code_file:
        _deny(DENY_REASON)

    sys.exit(0)


if __name__ == "__main__":
    main()
