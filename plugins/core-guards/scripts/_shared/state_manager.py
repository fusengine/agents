"""Centralised session-state manager.

Single source of truth for loading/saving per-session JSON state.
Replaces duplicated STATE_DIR / load / save patterns across hook scripts.
"""
import json
import os
import re
import tempfile

STATE_DIR = os.path.join(
    os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions'
)

_SID_RE = re.compile(r'^[a-zA-Z0-9_-]{1,128}$')


def sanitize_session_id(sid):
    """Validate and return *sid*, or raise ValueError."""
    sid = str(sid or '').strip()
    if not _SID_RE.match(sid):
        raise ValueError(f'Invalid session id: {sid!r}')
    return sid


def ensure_state_dir():
    """Create STATE_DIR (0o700) if it does not exist."""
    os.makedirs(STATE_DIR, mode=0o700, exist_ok=True)


def get_state_path(sid):
    """Return the unified state file path for *sid*."""
    sid = sanitize_session_id(sid)
    return os.path.join(STATE_DIR, f'session-{sid}.json')


def load_session_state(sid):
    """Load session state from disk.

    Returns the parsed dict, or ``{}`` when the file is missing or corrupt.
    """
    path = get_state_path(sid)
    if not os.path.isfile(path):
        return {}
    try:
        with open(path, encoding='utf-8') as fh:
            data = json.load(fh)
        return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, OSError, ValueError):
        return {}


def save_session_state(sid, state):
    """Atomically persist *state* dict for *sid*.

    Writes to a temp file, flushes to disk, then replaces the target
    so readers never see a partial write.  Permissions set to 0o600.
    """
    if not isinstance(state, dict):
        raise TypeError('state must be a dict')
    ensure_state_dir()
    target = get_state_path(sid)
    fd, tmp = tempfile.mkstemp(
        dir=STATE_DIR, prefix='.state_', suffix='.tmp'
    )
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as fh:
            json.dump(state, fh, indent=2)
            fh.flush()
            os.fsync(fh.fileno())
        os.chmod(tmp, 0o600)
        os.replace(tmp, target)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise
