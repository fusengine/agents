---
name: scan-patterns-extra
description: Grep patterns for vulnerability detection - Python, Swift/iOS, Go, Rust
when-to-use: When scanning Python, Swift, Go, or Rust source code for security vulnerabilities
keywords: grep, patterns, python, swift, go, rust, injection, deserialization
priority: high
related: scan-patterns.md, owasp-top10.md
---

# Scan Patterns - Python, Swift/iOS & More

## Python (18+ patterns)

### Code Execution / Command Injection
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `eval(` | CRITICAL | A03 |
| `exec(` | CRITICAL | A03 |
| `compile(.*exec` | HIGH | A03 |
| `os\.system(` | CRITICAL | A03 |
| `subprocess.*shell=True` | CRITICAL | A03 |
| `os\.popen(` | HIGH | A03 |

### Deserialization
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `pickle\.loads(` | HIGH | A08 |
| `yaml\.load\(` (sans Loader=) | HIGH | A08 |
| `marshal\.loads(` | HIGH | A08 |

### SQL Injection / TLS
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `cursor\.execute.*%` | HIGH | A03 |
| `cursor\.execute.*f"` | CRITICAL | A03 |
| `verify=False` | HIGH | A02 |
| `ssl\.CERT_NONE` | HIGH | A02 |

## Swift/iOS (15+ patterns)

### Insecure Storage
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `UserDefaults.*password` | HIGH | A02 |
| `UserDefaults.*token` | HIGH | A02 |
| `UserDefaults.*secret` | HIGH | A02 |

### Insecure HTTP / Weak Keychain
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `"http://` | MEDIUM | A05 |
| `NSAllowsArbitraryLoads` | HIGH | A05 |
| `kSecAttrAccessibleAlways` | HIGH | A02 |

### Weak Crypto / Secrets
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `kCCOptionECBMode` | MEDIUM | A02 |
| `CCAlgorithmDES` | HIGH | A02 |
| `let apiKey = "` | CRITICAL | A02 |
| `let secret = "` | CRITICAL | A02 |

## Go (12+ patterns)

### Command Injection / SQL
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `exec\.Command\(.*\+` | CRITICAL | A03 |
| `os/exec` with user input | HIGH | A03 |
| `fmt\.Sprintf.*SELECT` | CRITICAL | A03 |
| `db\.Query\(.*\+` | CRITICAL | A03 |

### TLS / Crypto
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `InsecureSkipVerify.*true` | HIGH | A02 |
| `md5\.New\(\)` | MEDIUM | A02 |
| `sha1\.New\(\)` | MEDIUM | A02 |
