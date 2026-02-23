#!/usr/bin/env python3
"""locking-core.py - Core locking functions (acquire/release).

Importable functions (no main).
"""

import os
import time

LOCKS_DIR = os.environ.get("LOCKS_DIR", "/tmp/claude-locks")


def acquire_lock(lock_name: str, timeout: int = 30) -> bool:
    """Acquire an exclusive lock using mkdir (atomic on POSIX).

    Returns True on success, False on timeout.
    """
    lock_dir = os.path.join(LOCKS_DIR, f"{lock_name}.lockdir")
    lock_file = os.path.join(LOCKS_DIR, f"{lock_name}.lock")
    os.makedirs(LOCKS_DIR, exist_ok=True)
    elapsed = 0
    while elapsed < timeout:
        try:
            os.mkdir(lock_dir)
            with open(lock_file, "w", encoding="utf-8") as f:
                f.write(str(os.getpid()))
            return True
        except FileExistsError:
            time.sleep(1)
            elapsed += 1
    return False


def release_lock(lock_name: str) -> bool:
    """Release a lock. Returns True on success, False if not owner."""
    lock_file = os.path.join(LOCKS_DIR, f"{lock_name}.lock")
    lock_dir = os.path.join(LOCKS_DIR, f"{lock_name}.lockdir")
    if os.path.isfile(lock_file):
        try:
            with open(lock_file, encoding="utf-8") as f:
                lock_pid = f.read().strip()
            if lock_pid != str(os.getpid()):
                return False
        except OSError:
            pass
    try:
        os.remove(lock_file)
    except OSError:
        pass
    try:
        os.rmdir(lock_dir)
    except OSError:
        pass
    return True
