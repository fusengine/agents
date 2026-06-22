"""Shared SOLID max-lines limit — override via FUSE_SOLID_MAX_LINES (default 100).

Robust parse: empty/NaN/float/zero/negative all fall back to 100.
int() natively rejects "" and floats ("1.5"); mirrors the TS solid-limits.ts.
Single source of truth for the ai-pilot SOLID-compliance + APEX-context scripts.
"""
import os


def max_lines():
    """SOLID max lines per file (positive int). Defaults to 100."""
    try:
        v = int(os.environ.get('FUSE_SOLID_MAX_LINES', '100'))
        return v if v > 0 else 100
    except (TypeError, ValueError):
        return 100


def split_target():
    """Advisory module-split headroom = max_lines - 10 (default 90)."""
    return max(max_lines() - 10, 1)
