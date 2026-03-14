#!/usr/bin/env python3
"""detect-duplication.py - Wrapper: DRY duplication blocker.

Resolves shared module via __file__ relative path first,
fallback to marketplace absolute path for portability.
"""

import os
import sys

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
_SHARED_RELATIVE = os.path.normpath(
    os.path.join(_SCRIPT_DIR, "..", "..", "_shared", "scripts"))
_SHARED_MARKETPLACE = os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts")

for _path in [_SHARED_RELATIVE, _SHARED_MARKETPLACE]:
    if os.path.isdir(_path):
        sys.path.insert(0, _path)
        break

# pylint: disable=wrong-import-position
from detect_duplication import main

if __name__ == "__main__":
    main()
