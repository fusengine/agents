#!/usr/bin/env python3
"""framework-detection.py - Common framework detection functions.

Importable functions (no main).
"""

import os


_KEYWORD_MAP = [
    (["next"], "nextjs"),
    (["react"], "react"),
    (["tailwind"], "tailwind"),
    (["laravel", "php"], "laravel"),
    (["swift", "swiftui", "ios"], "swift"),
    (["design", "shadcn", " ui"], "design"),
]


def detect_framework_from_string(input_str: str) -> str:
    """Detect framework from a query or path string."""
    s = input_str.lower()
    for keywords, framework in _KEYWORD_MAP:
        if any(kw in s for kw in keywords):
            return framework
    return "generic"


def detect_project_type(directory: str = ".") -> str:
    """Detect project type from directory markers."""
    checks = [
        (["next.config.js", "next.config.ts", "next.config.mjs"], "nextjs"),
        (["composer.json"], "laravel"),  # also needs artisan
        (["Package.swift"], "swift"),
        (["Cargo.toml"], "rust"),
        (["go.mod"], "go"),
        (["tailwind.config.js", "tailwind.config.ts"], "tailwind"),
        (["vite.config.ts", "vite.config.js"], "react"),
    ]
    for files, fw in checks:
        for f in files:
            if os.path.isfile(os.path.join(directory, f)):
                if fw == "laravel":
                    if not os.path.isfile(os.path.join(directory, "artisan")):
                        continue
                return fw
    return "generic"
