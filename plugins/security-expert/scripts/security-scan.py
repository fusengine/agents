#!/usr/bin/env python3
"""Vulnerability scanning: detect language, grep patterns, JSON output."""
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from security_scan_patterns import get_patterns


def detect_language(project_dir):
    """Detect project language from config files."""
    checks = [
        ("package.json", "javascript"),
        ("composer.json", "php"),
        ("requirements.txt", "python"),
        ("pyproject.toml", "python"),
        ("Package.swift", "swift"),
        ("go.mod", "go"),
        ("Cargo.toml", "rust"),
    ]
    for filename, lang in checks:
        if os.path.isfile(os.path.join(project_dir, filename)):
            return lang
    return "unknown"


def scan_pattern(project_dir, severity, category, pattern, glob_pat):
    """Scan files matching glob for a regex pattern."""
    findings = []
    try:
        result = subprocess.run(
            ["grep", "-rn", pattern, f"--include={glob_pat}", "."],
            capture_output=True, text=True, cwd=project_dir, timeout=30,
            check=False
        )
        for line in result.stdout.splitlines():
            parts = line.split(":", 2)
            if len(parts) < 2:
                continue
            fpath, lineno = parts[0], parts[1]
            if re.search(r"(node_modules|vendor|\.git|dist|build)", fpath):
                continue
            findings.append({
                "severity": severity, "category": category,
                "pattern": pattern, "file": fpath, "line": lineno,
            })
    except (subprocess.TimeoutExpired, OSError):
        pass
    return findings


def main():
    """Run security scan and output JSON results."""
    project_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    lang = detect_language(project_dir)

    counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    all_findings = []

    for severity, category, pattern, glob_pat in get_patterns(lang):
        findings = scan_pattern(project_dir, severity, category, pattern, glob_pat)
        all_findings.extend(findings)
        counts[severity.lower()] = counts.get(severity.lower(), 0) + len(findings)

    result = {
        "language": lang,
        "directory": project_dir,
        "summary": {**counts, "total": sum(counts.values())},
        "findings": all_findings,
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
