#!/usr/bin/env python3
"""validate-nextjs-modular.py - PreToolUse hook: modular architecture.

When modules/ exists, business logic MUST be in modules/[feature]/.
Cross-module imports blocked (only modules/cores/ allowed).
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from check_skill_common import deny_block, find_project_root
from hook_output import allow_pass
from modular_detection import is_nextjs_modular

_CONVENTION_RE = re.compile(
    r"(page|layout|loading|error|not-found|route|template|default|"
    r"global-error|opengraph-image|twitter-image|icon|apple-icon|"
    r"sitemap|robots|manifest|middleware)\.(tsx|ts|js|jsx)$")
_STATIC_RE = re.compile(r"\.(css|ico|png|jpg|svg|json)$")


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    ti = data.get("tool_input") or {}
    fp = ti.get("file_path", "")
    if data.get("tool_name") not in ("Write", "Edit"):
        sys.exit(0)
    if not re.search(r"\.(tsx|ts|jsx|js)$", fp):
        sys.exit(0)
    if re.search(r"/(node_modules|dist|build|\.next)/", fp):
        sys.exit(0)
    root = find_project_root(
        os.path.dirname(fp), "package.json", ".git")
    if not is_nextjs_modular(root):
        sys.exit(0)

    # Block non-convention files in app/
    rel = os.path.relpath(fp, root)
    if rel.startswith("app/") or rel.startswith("src/app/"):
        bn = os.path.basename(fp)
        if not _CONVENTION_RE.match(bn) and not _STATIC_RE.match(bn):
            deny_block(
                f"BLOCKED: Modular Next.js (modules/ exists). "
                f"'{bn}' is NOT a convention file. "
                f"Move to modules/[feature]/. "
                f"Only page.tsx, layout.tsx, route.ts allowed in app/.")

    # Block cross-module imports (feature -> feature)
    content = ti.get("content") or ti.get("new_string") or ""
    mod = re.search(r"/modules/([^/]+)/", fp)
    if mod and mod.group(1) != "cores":
        current = mod.group(1)
        cross = re.findall(
            r"from\s+['\"][@.].*?/modules/([^/]+)/", content)
        for imported in cross:
            if imported != current and imported not in ("cores", "core"):
                deny_block(
                    f"BLOCKED: Cross-module import. '{current}' imports "
                    f"from '{imported}'. Only modules/cores/ allowed.")

    # Block cores importing from feature modules
    if mod and mod.group(1) == "cores":
        cross = re.findall(
            r"from\s+['\"][@.].*?/modules/([^/]+)/", content)
        for imported in cross:
            if imported not in ("cores", "core"):
                deny_block(
                    f"BLOCKED: modules/cores/ must NOT import from "
                    f"modules/{imported}/. Cores must be independent.")

    allow_pass("validate-nextjs-modular", "modular structure ok")


if __name__ == "__main__":
    main()
