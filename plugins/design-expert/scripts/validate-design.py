#!/usr/bin/env python3
"""validate-design.py - PostToolUse hook: validate design best practices."""

import json
import re
import sys


def check_accessibility(content: str) -> list[str]:
    """Check for accessibility issues in component content."""
    warnings = []
    if not re.search(r"<(button|a|input|img)", content):
        return warnings
    if re.search(r"<button[^>]*>", content):
        if not re.search(r"aria-label|aria-labelledby", content):
            icon_count = len(re.findall(r"<button[^>]*>[^<]*<.*Icon", content))
            if icon_count > 0:
                warnings.append("Accessibility: Icon buttons need aria-label.")
    if re.search(r'<img[^>]*src=', content):
        for match in re.finditer(r"<img[^>]*?>", content):
            if "alt=" not in match.group():
                warnings.append("Accessibility: Images need alt attribute.")
                break
    return warnings


def check_design_patterns(content: str) -> list[str]:
    """Check for design anti-patterns."""
    warnings = []
    if re.search(r"border-l-[0-9]+ border-l-(blue|green|red|purple)", content):
        warnings.append("Design: Avoid colored left borders - use shadow or gradient.")
    if re.search(r"from-purple|to-purple|via-purple|from-pink.*to-purple", content):
        warnings.append("Design: Avoid purple/pink gradients (AI slop) - use brand colors.")
    if re.search(r">[^\x00-\x7F]+<", content):
        emoji_pattern = r">[🎯🚀💡🔥⚡️✨🎨📊💼🏆]<"
        if re.search(emoji_pattern, content):
            warnings.append("Design: Avoid emojis as icons - use Lucide React.")
    return warnings


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    file_path = (data.get("tool_input") or {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not re.search(r"\.(tsx|jsx)$", file_path):
        sys.exit(0)

    import os
    if not os.path.isfile(file_path):
        sys.exit(0)

    try:
        with open(file_path, encoding="utf-8") as f:
            content = f.read()
    except OSError:
        sys.exit(0)

    warnings = check_accessibility(content) + check_design_patterns(content)

    if warnings:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": " ".join(warnings),
            }
        }))

    sys.exit(0)


if __name__ == "__main__":
    main()
