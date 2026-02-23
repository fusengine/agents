#!/usr/bin/env python3
"""Detect Radix UI vs Base UI in project."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from detect_primitive_checks import (
    check_components_json,
    check_pkg_json,
    detect_pm,
    scan_imports_and_attrs,
)


def main():
    """Detect primitive UI library and output JSON."""
    root = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    signals = []

    r1, b1 = check_pkg_json(root, signals)
    r2, b2 = check_components_json(root, signals)
    r3, b3 = scan_imports_and_attrs(root, signals)
    pm, runner = detect_pm(root, signals)

    radix = r1 + r2 + r3
    baseui = b1 + b2 + b3

    if radix > 0 and baseui > 0:
        primitive, confidence = "mixed", (radix + baseui) // 2
    elif radix > baseui:
        primitive, confidence = "radix", radix
    elif baseui > radix:
        primitive, confidence = "base-ui", baseui
    else:
        primitive, confidence = "none", 0

    print(json.dumps({
        "primitive": primitive, "confidence": confidence,
        "pm": pm, "runner": runner, "signals": signals,
    }))


if __name__ == "__main__":
    main()
