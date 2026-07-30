# Claude Code - Load API keys from ~/.claude/.env
# Add to $PROFILE: . /path/to/claude-env.ps1
#
# FUSE_* keys are skipped on purpose: they are per-harness
# (FUSE_HARNESS_REFS points at ONE harness' rules tree), so exporting them
# globally makes every other agent read Claude's rules instead of its own.

$envFile = Join-Path $env:USERPROFILE ".claude\.env"

if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        $entry = $line.Trim()
        if ($entry -eq "" -or $entry.StartsWith("#")) { continue }
        $entry = $entry -replace '^export\s+', ''
        if ($entry -notmatch '^([A-Za-z_][A-Za-z0-9_]*)=(.*)$') { continue }
        $key = $matches[1]
        $val = $matches[2]
        if ($key -like "FUSE_*") { continue }
        if ($val -match '^"([^"]*)"') { $val = $matches[1] }
        elseif ($val -match "^'([^']*)'") { $val = $matches[1] }
        else { $val = ($val -replace '\s+#.*$', '').TrimEnd() }
        [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
    }
}
