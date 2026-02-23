#!/usr/bin/env python3
"""Detection checks for Radix UI vs Base UI."""
import json
import os
import subprocess


def grep_quiet(pattern, path):
    """Return True if pattern found in path."""
    try:
        result = subprocess.run(
            ["grep", "-rq", pattern, path],
            capture_output=True, timeout=10, check=False
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, OSError):
        return False


def check_pkg_json(root, signals):
    """Check package.json for UI libraries (weight: 40)."""
    radix, baseui = 0, 0
    pkg = os.path.join(root, "package.json")
    if not os.path.isfile(pkg):
        return radix, baseui
    try:
        with open(pkg, encoding="utf-8") as f:
            content = f.read()
        if '"@radix-ui/react-' in content:
            radix = 40
            signals.append("pkg:radix-ui")
        if '"@base-ui/react' in content:
            baseui = 40
            signals.append("pkg:base-ui")
    except OSError:
        pass
    return radix, baseui


def check_components_json(root, signals):
    """Check components.json style (weight: 20)."""
    cjson = os.path.join(root, "components.json")
    if not os.path.isfile(cjson):
        return 0, 0
    try:
        with open(cjson, encoding="utf-8") as f:
            data = json.load(f)
        style = data.get("style", "")
        if style in ("new-york", "default"):
            signals.append(f"style:{style}")
            return 20, 0
        if style == "base-vega":
            signals.append("style:base-vega")
            return 0, 20
    except (json.JSONDecodeError, OSError):
        pass
    return 0, 0


def scan_imports_and_attrs(root, signals):
    """Scan imports (weight: 25) and data attributes (weight: 15)."""
    radix, baseui = 0, 0
    scan_dirs = [os.path.join(root, d) for d in ("src", "components", "app")]
    dirs = [d for d in scan_dirs if os.path.isdir(d)]

    for d in dirs:
        if grep_quiet("@radix-ui/react-", d):
            radix += 25
            signals.append("import:radix")
            break
    for d in dirs:
        if grep_quiet("@base-ui/react", d):
            baseui += 25
            signals.append("import:base-ui")
            break
    for d in dirs:
        if grep_quiet("data-state=", d):
            radix += 15
            signals.append("attr:data-state")
            break
    for d in dirs:
        if grep_quiet(r"data-\[open\]", d):
            baseui += 15
            signals.append("attr:data-[open]")
            break
    return radix, baseui


def detect_pm(root, signals):
    """Detect package manager from lockfiles."""
    for lockfile, pm, runner in [
        ("bun.lockb", "bun", "bunx"), ("bun.lock", "bun", "bunx"),
        ("pnpm-lock.yaml", "pnpm", "pnpm dlx"),
        ("yarn.lock", "yarn", "yarn dlx"),
    ]:
        if os.path.isfile(os.path.join(root, lockfile)):
            signals.append(f"pm:{pm}")
            return pm, runner
    signals.append("pm:npm")
    return "npm", "npx"
