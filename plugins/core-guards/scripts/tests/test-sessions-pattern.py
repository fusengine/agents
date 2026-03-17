#!/usr/bin/env python3
"""Test: validate the fusengine-cache/sessions DENY_PATTERNS entry."""
import re
import sys

PATTERN = r'fusengine-cache/sessions'

CASES = [
    # (command, should_match, label)
    ('cat ~/.claude/fusengine-cache/sessions/abc.json', True, 'read session file'),
    ('echo x > ~/.claude/fusengine-cache/sessions/foo', True, 'write session file'),
    ('rm -rf ~/.claude/fusengine-cache/sessions/', True, 'delete sessions dir'),
    ('ls fusengine-cache/sessions', True, 'ls sessions relative'),
    ('bun run test', False, 'safe bun run'),
    ('git status', False, 'safe git'),
    ('npx eslint .', False, 'safe eslint'),
    ('ls ~/.claude/fusengine-cache/', False, 'parent dir only'),
]


def run_tests():  # pylint: disable=invalid-name
    """Run all pattern match cases and return failure count."""
    failure_count = 0
    for cmd, expected, label in CASES:
        matched = bool(re.search(PATTERN, cmd))
        result_label = 'OK  ' if matched == expected else 'FAIL'
        if matched != expected:
            failure_count += 1
        print(f'{result_label} [{label}]: match={matched} expected={expected}')
    return failure_count


FAILURES = run_tests()
print()
if FAILURES:
    print(f'RESULT: {FAILURES} failure(s)')
    sys.exit(1)
else:
    print('RESULT: All cases passed')
    sys.exit(0)
