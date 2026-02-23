#!/usr/bin/env python3
"""PostToolUse hook - SOLID validation for Swift/SwiftUI."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
try:
    from validate_solid_common import count_code_lines, deny_solid_violation
except ImportError:
    sys.exit(0)


def main():
    """Validate Swift SOLID principles after Write/Edit."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")
    file_path = data.get("tool_input", {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not file_path.endswith(".swift"):
        sys.exit(0)
    if re.search(r"/(\.build|DerivedData|Pods)/", file_path):
        sys.exit(0)

    content = (
        data.get("tool_input", {}).get("content")
        or data.get("tool_input", {}).get("new_string")
        or ""
    )
    if not content:
        sys.exit(0)

    line_count = count_code_lines(content)
    max_lines = 150 if re.search(r"(View|Screen)\.swift$", file_path) else 100
    violations = []

    if line_count > max_lines:
        violations.append(
            f"File has {line_count} lines (limit: {max_lines}). "
            "Extract to ViewModels, Services, or subviews."
        )

    if re.search(r"^protocol ", content, re.MULTILINE):
        if "/Protocols/" not in file_path:
            violations.append("Protocol defined outside Protocols/ directory.")

    if file_path.endswith("ViewModel.swift"):
        if "@MainActor" not in content:
            violations.append("ViewModel missing @MainActor annotation.")

    if re.search(r"^(class|struct) .* \{", content, re.MULTILINE):
        if "async " in content and "Sendable" not in content:
            violations.append("Type uses async but doesn't conform to Sendable.")

    if violations:
        deny_solid_violation(file_path, violations)

    sys.exit(0)


if __name__ == "__main__":
    main()
