#!/bin/bash
# security-scan.sh - Vulnerability scanning: detect language, grep patterns, JSON output
set -euo pipefail

PROJECT_DIR="${1:-.}"
cd "$PROJECT_DIR"

CRITICAL=0; HIGH=0; MEDIUM=0; LOW=0; FINDINGS="[]"

detect_language() {
  if [[ -f "package.json" ]]; then echo "javascript"
  elif [[ -f "composer.json" ]]; then echo "php"
  elif [[ -f "requirements.txt" ]] || [[ -f "pyproject.toml" ]]; then echo "python"
  elif [[ -f "Package.swift" ]] || ls *.xcodeproj &>/dev/null; then echo "swift"
  elif [[ -f "go.mod" ]]; then echo "go"
  elif [[ -f "Cargo.toml" ]]; then echo "rust"
  else echo "unknown"; fi
}
LANG=$(detect_language)

add_finding() {
  local severity="$1" category="$2" pattern="$3" file="$4" line="$5"
  FINDINGS=$(echo "$FINDINGS" | jq --arg s "$severity" --arg c "$category" \
    --arg p "$pattern" --arg f "$file" --arg l "$line" \
    '. + [{"severity":$s,"category":$c,"pattern":$p,"file":$f,"line":$l}]')
  case "$severity" in
    CRITICAL) CRITICAL=$((CRITICAL + 1)) ;; HIGH) HIGH=$((HIGH + 1)) ;;
    MEDIUM) MEDIUM=$((MEDIUM + 1)) ;; LOW) LOW=$((LOW + 1)) ;;
  esac
}

scan_pattern() {
  local severity="$1" category="$2" pattern="$3" glob="$4"
  while IFS=: read -r file line _; do
    [[ -z "$file" ]] && continue
    [[ "$file" =~ node_modules|vendor|\.git|dist|build ]] && continue
    add_finding "$severity" "$category" "$pattern" "$file" "$line"
  done < <(grep -rn "$pattern" --include="$glob" . 2>/dev/null || true)
}

scan_js() {
  scan_pattern "HIGH" "XSS" "innerHTML\s*=" "*.{js,ts,jsx,tsx}"
  scan_pattern "HIGH" "XSS" "dangerouslySetInnerHTML" "*.{js,ts,jsx,tsx}"
  scan_pattern "CRITICAL" "CODE_EXEC" "eval(" "*.{js,ts,jsx,tsx}"
  scan_pattern "CRITICAL" "CODE_EXEC" "new Function(" "*.{js,ts,jsx,tsx}"
  scan_pattern "CRITICAL" "CMD_INJECTION" "child_process" "*.{js,ts,jsx,tsx}"
  scan_pattern "HIGH" "CMD_INJECTION" "shell:\s*true" "*.{js,ts,jsx,tsx}"
  scan_pattern "MEDIUM" "WEAK_CRYPTO" "Math\.random()" "*.{js,ts,jsx,tsx}"
  scan_pattern "MEDIUM" "WEAK_CRYPTO" "createHash.*md5\|sha1" "*.{js,ts,jsx,tsx}"
  scan_pattern "CRITICAL" "SECRETS" "AKIA[0-9A-Z]\{16\}" "*.{js,ts,jsx,tsx}"
  scan_pattern "HIGH" "SSRF" "fetch(req\.\|axios\.get(req\." "*.{js,ts,jsx,tsx}"
}

scan_php() {
  scan_pattern "CRITICAL" "RCE" "shell_exec\|system(\|passthru(" "*.php"
  scan_pattern "CRITICAL" "CODE_EXEC" "eval(\|assert(" "*.php"
  scan_pattern "HIGH" "SQL_INJECTION" "mysql_query(" "*.php"
  scan_pattern "CRITICAL" "DESERIALIZATION" 'unserialize(\$_' "*.php"
  scan_pattern "HIGH" "LFI" 'include(\$\|require(\$' "*.php"
}

scan_python() {
  scan_pattern "CRITICAL" "CODE_EXEC" "eval(\|exec(" "*.py"
  scan_pattern "CRITICAL" "CMD_INJECTION" "os\.system(\|subprocess.*shell=True" "*.py"
  scan_pattern "HIGH" "DESERIALIZATION" "pickle\.loads(" "*.py"
  scan_pattern "HIGH" "TLS" "verify=False\|ssl\.CERT_NONE" "*.py"
}

scan_swift() {
  scan_pattern "HIGH" "INSECURE_STORAGE" "UserDefaults.*password\|token\|secret" "*.swift"
  scan_pattern "MEDIUM" "INSECURE_HTTP" '"http://' "*.swift"
  scan_pattern "HIGH" "WEAK_KEYCHAIN" "kSecAttrAccessibleAlways" "*.swift"
  scan_pattern "MEDIUM" "WEAK_CRYPTO" "kCCOptionECBMode\|CCAlgorithmDES" "*.swift"
}

case "$LANG" in
  javascript) scan_js ;; php) scan_php ;;
  python) scan_python ;; swift) scan_swift ;;
esac

jq -n --arg lang "$LANG" --arg dir "$PROJECT_DIR" \
  --argjson c "$CRITICAL" --argjson h "$HIGH" \
  --argjson m "$MEDIUM" --argjson l "$LOW" \
  --argjson findings "$FINDINGS" \
  '{language:$lang,directory:$dir,summary:{critical:$c,high:$h,medium:$m,low:$l,total:($c+$h+$m+$l)},findings:$findings}'
