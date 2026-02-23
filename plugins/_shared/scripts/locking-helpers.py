#!/usr/bin/env python3
"""locking-helpers.py - Helper locking functions.

Importable functions (no main).
"""

import os
import time
from typing import Any, Callable

LOCKS_DIR = os.environ.get("LOCKS_DIR", "/tmp/claude-locks")


def is_locked(lock_name: str) -> bool:
    """Check if a lock is currently held."""
    lock_dir = os.path.join(LOCKS_DIR, f"{lock_name}.lockdir")
    return os.path.isdir(lock_dir)


def wait_for_lock(lock_name: str, max_wait: int = 300) -> bool:
    """Wait for a lock to be released.

    Returns True if released, False on timeout.
    """
    elapsed = 0
    while is_locked(lock_name) and elapsed < max_wait:
        time.sleep(1)
        elapsed += 1
    return elapsed < max_wait


def with_lock(lock_name: str, func: Callable[..., Any],
              *args: Any, **kwargs: Any) -> Any:
    """Execute a callable while holding a lock."""
    # Import here to avoid circular dependency
    from locking_core import acquire_lock, release_lock

    if not acquire_lock(lock_name):
        raise RuntimeError(f"Cannot acquire lock '{lock_name}'")
    try:
        return func(*args, **kwargs)
    finally:
        release_lock(lock_name)
