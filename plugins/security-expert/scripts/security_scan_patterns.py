#!/usr/bin/env python3
"""Security scan patterns by language."""


def get_patterns(lang):
    """Return scan patterns for a given language."""
    patterns = {
        "javascript": [
            ("HIGH", "XSS", r"innerHTML\s*=", "*.js"),
            ("HIGH", "XSS", "dangerouslySetInnerHTML", "*.js"),
            ("CRITICAL", "CODE_EXEC", "eval(", "*.js"),
            ("CRITICAL", "CODE_EXEC", "new Function(", "*.js"),
            ("CRITICAL", "CMD_INJECTION", "child_process", "*.js"),
            ("HIGH", "CMD_INJECTION", r"shell:\s*true", "*.js"),
            ("MEDIUM", "WEAK_CRYPTO", r"Math\.random()", "*.js"),
            ("CRITICAL", "SECRETS", r"AKIA[0-9A-Z]\{16\}", "*.js"),
        ],
        "php": [
            ("CRITICAL", "RCE", r"shell_exec\|system(\|passthru(", "*.php"),
            ("CRITICAL", "CODE_EXEC", r"eval(\|assert(", "*.php"),
            ("HIGH", "SQL_INJECTION", "mysql_query(", "*.php"),
        ],
        "python": [
            ("CRITICAL", "CODE_EXEC", r"eval(\|exec(", "*.py"),
            ("CRITICAL", "CMD_INJECTION", r"os\.system(\|subprocess.*shell=True", "*.py"),
            ("HIGH", "DESERIALIZATION", r"pickle\.loads(", "*.py"),
            ("HIGH", "TLS", r"verify=False\|ssl\.CERT_NONE", "*.py"),
        ],
        "swift": [
            ("HIGH", "INSECURE_STORAGE", r"UserDefaults.*password\|token\|secret", "*.swift"),
            ("MEDIUM", "INSECURE_HTTP", '"http://', "*.swift"),
            ("HIGH", "WEAK_KEYCHAIN", "kSecAttrAccessibleAlways", "*.swift"),
        ],
    }
    return patterns.get(lang, [])
