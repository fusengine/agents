#!/usr/bin/env python3
"""Security rules and validation logic for command checking."""
import re

CRITICAL_COMMANDS = [
    'del', 'mkfs', 'shred', 'dd if=', 'fdisk',
    'diskutil erase', 'diskutil eraseDisk',
]

PRIVILEGE_COMMANDS = ['sudo', 'su', 'doas', 'passwd']

DANGEROUS_PATTERNS = [
    re.compile(r'rm\s+.*-rf\s*/\s*$', re.IGNORECASE),
    re.compile(r'rm\s+.*-rf\s*/etc', re.IGNORECASE),
    re.compile(r'rm\s+.*-rf\s*/usr', re.IGNORECASE),
    re.compile(r'rm\s+.*-rf\s*/var', re.IGNORECASE),
    re.compile(r'rm\s+.*-rf\s*/bin', re.IGNORECASE),
    re.compile(r'rm\s+.*-rf\s*/sbin', re.IGNORECASE),
    re.compile(r'>\s*/dev/(sda|hda|nvme)', re.IGNORECASE),
    re.compile(r'curl\s+.*\|\s*(sh|bash|zsh)', re.IGNORECASE),
    re.compile(r'wget\s+.*-O\s*-\s*\|\s*(sh|bash)', re.IGNORECASE),
]


def extract_command_part(command):
    """Extract command part, excluding heredoc content."""
    match = re.match(r"^([^<]*<<\s*['\"]?(\w+)['\"]?)", command)
    return match.group(1) if match else command


def validate_command(command):
    """Validate a command against security rules.

    Returns:
        tuple: (is_valid: bool, violations: list[str])
    """
    violations = []
    cmd = extract_command_part(command)
    tokens = [t for t in re.split(r'[\s|;&]+', cmd) if t]

    for critical in CRITICAL_COMMANDS:
        if any(t == critical or t.startswith(critical + ' ') for t in tokens):
            violations.append(f"CRITICAL: Detected dangerous command '{critical}'")

    for pattern in DANGEROUS_PATTERNS:
        if pattern.search(cmd):
            violations.append(f"DANGEROUS PATTERN: {pattern.pattern}")

    if re.search(r'\brm\s+', cmd) and not re.search(r'trash', cmd, re.IGNORECASE):
        violations.append("DELETE: 'rm' permanently deletes - confirmation required")

    if re.search(r'\bunlink\s+', cmd):
        violations.append("DELETE: 'unlink' command detected - confirmation required")

    for priv in PRIVILEGE_COMMANDS:
        regex = re.compile(rf'(^|\s|;|\||&){priv}(\s|$|;|\||&)', re.IGNORECASE)
        if regex.search(cmd):
            violations.append(f"PRIVILEGE ESCALATION: {priv}")

    return (len(violations) == 0, violations)
