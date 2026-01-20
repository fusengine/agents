# Claude Code - Load API keys from ~/.claude/.env
# Add to $PROFILE: . /path/to/claude-env.ps1

$envFile = Join-Path $env:USERPROFILE ".claude\.env"

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*export\s+(\w+)=["'']?([^"'']+)["'']?\s*$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
        elseif ($_ -match '^\s*(\w+)=["'']?([^"'']+)["'']?\s*$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}
