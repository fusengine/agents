#!/usr/bin/env python3
"""modular_detection.py - Detect modular architectures.

FuseCore (Laravel) and modules/ (Next.js) detection.
Importable functions (no main).
"""

import os


def is_fusecore_project(directory: str = ".") -> bool:
    """Check if Laravel project uses FuseCore modular architecture."""
    return (os.path.isdir(os.path.join(directory, "FuseCore"))
            and os.path.isfile(os.path.join(directory, "artisan")))


def is_nextjs_modular(directory: str = ".") -> bool:
    """Check if Next.js project uses modules/ architecture."""
    has_modules = os.path.isdir(os.path.join(directory, "modules"))
    has_next = any(
        os.path.isfile(os.path.join(directory, f))
        for f in ("next.config.js", "next.config.ts", "next.config.mjs"))
    return has_modules and has_next
