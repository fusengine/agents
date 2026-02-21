---
name: scan-patterns
description: Grep patterns for vulnerability detection - JavaScript/TypeScript and PHP
when-to-use: When scanning JS/TS or PHP source code for security vulnerabilities
keywords: grep, patterns, xss, sqli, rce, injection, secrets, javascript, php
priority: high
related: scan-patterns-extra.md, owasp-top10.md
---

# Scan Patterns - JavaScript/TypeScript & PHP

## JavaScript/TypeScript (25+ patterns)

### XSS (Cross-Site Scripting)
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `innerHTML\s*=` | HIGH | A03 |
| `dangerouslySetInnerHTML` | HIGH | A03 |
| `document\.write(` | HIGH | A03 |
| `\.outerHTML\s*=` | HIGH | A03 |

### Code Execution
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `eval(` | CRITICAL | A03 |
| `new Function(` | CRITICAL | A03 |
| `setTimeout\("` (string arg) | HIGH | A03 |
| `setInterval\("` (string arg) | HIGH | A03 |

### Command Injection
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `child_process` | HIGH | A03 |
| `exec(` | CRITICAL | A03 |
| `execSync(` | CRITICAL | A03 |
| `shell:\s*true` | HIGH | A03 |

### SQL Injection
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `` `SELECT.*\$\{` `` | CRITICAL | A03 |
| `query(.*\+.*req\.` | CRITICAL | A03 |

### Weak Cryptography / Secrets / SSRF
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `Math\.random()` | MEDIUM | A02 |
| `createHash\('md5'\)` | MEDIUM | A02 |
| `createHash\('sha1'\)` | MEDIUM | A02 |
| `apiKey\s*=\s*["']` | CRITICAL | A02 |
| `AKIA[0-9A-Z]{16}` | CRITICAL | A02 |
| `password\s*=\s*["']` | CRITICAL | A02 |
| `fetch\(req\.` | HIGH | A10 |
| `axios\.get\(req\.` | HIGH | A10 |

## PHP (20+ patterns)

### RCE / Code Execution
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `shell_exec(` | CRITICAL | A03 |
| `system(` | CRITICAL | A03 |
| `exec(` | CRITICAL | A03 |
| `passthru(` | CRITICAL | A03 |
| `popen(` | CRITICAL | A03 |
| `eval(` | CRITICAL | A03 |
| `assert(` | HIGH | A03 |
| `preg_replace.*/e` | CRITICAL | A03 |

### XSS / SQL Injection
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `\$_GET\[.*echo` | HIGH | A03 |
| `\$_POST\[.*echo` | HIGH | A03 |
| `\$_REQUEST\[.*echo` | HIGH | A03 |
| `mysql_query(` | CRITICAL | A03 |
| `\$sql\s*=.*\$_` | CRITICAL | A03 |
| `->whereRaw\(.*\$` | HIGH | A03 |

### LFI/RFI / Deserialization
| Pattern | Severity | OWASP |
|---------|----------|-------|
| `include\(\$` | HIGH | A01 |
| `require\(\$` | HIGH | A01 |
| `include.*\$_GET` | CRITICAL | A01 |
| `unserialize\(\$_` | CRITICAL | A08 |
