#!/usr/bin/env python3
"""Safe write paths resolution and validation (cross-platform)."""
import os
import re


# Paths where file writes are always allowed (internal plugin cache)
# Cross-platform: expanduser resolves ~ on macOS/Linux/Windows
SAFE_WRITE_PATHS = [
    os.path.normpath(os.path.expanduser('~/.claude/fusengine-cache')),
]


def resolve_path(path):
    """Resolve ~, $HOME, %USERPROFILE% and normalize separators."""
    path = path.strip().strip("'\"")
    path = os.path.expanduser(path)
    path = os.path.expandvars(path)
    return os.path.normpath(path)


def extract_redirect_target(cmd):
    """Extract the file path after > or >> redirect operator."""
    match = re.search(r'>>\s*(\S+)|(?<![2&\d])>\s*(\S+)', cmd)
    if match:
        return resolve_path(match.group(1) or match.group(2))
    return None


def is_safe_write_path(cmd):
    """Check if redirect target points to an allowed write path."""
    target = extract_redirect_target(cmd)
    if not target:
        return False
    return any(target.startswith(safe) for safe in SAFE_WRITE_PATHS)


def extract_command_target(cmd):
    """Extract file path argument from tee/dd commands."""
    tee_match = re.search(r'\btee\s+(?:-[a-z]\s+)*(\S+)', cmd)
    if tee_match:
        return resolve_path(tee_match.group(1))
    dd_match = re.search(r'\bdd\b[^|]*\bof=(\S+)', cmd)
    if dd_match:
        return resolve_path(dd_match.group(1))
    return None


def is_safe_command_target(cmd):
    """Check if tee/dd target points to an allowed write path."""
    target = extract_command_target(cmd)
    if not target:
        return False
    return any(target.startswith(safe) for safe in SAFE_WRITE_PATHS)
