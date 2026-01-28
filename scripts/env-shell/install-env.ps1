# Claude Code - Environment Installer for Windows PowerShell
# Run: .\install-env.ps1

$ErrorActionPreference = "Stop"

Write-Host "Claude Code - Environment Installer (PowerShell)" -ForegroundColor Blue
Write-Host "─────────────────────────────────────────────────"
Write-Host ""

$envFile = "$HOME\.claude\.env"
$profileDir = Split-Path $PROFILE -Parent
$profileFile = $PROFILE

# Check if .env exists
if (-not (Test-Path $envFile)) {
    Write-Host "Warning: $envFile does not exist" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Create it with your API keys:"
    Write-Host "  New-Item -ItemType Directory -Force -Path `"$HOME\.claude`""
    Write-Host "  @'"
    Write-Host "  export CONTEXT7_API_KEY=`"ctx7sk-xxx`""
    Write-Host "  export EXA_API_KEY=`"xxx`""
    Write-Host "  export MAGIC_API_KEY=`"xxx`""
    Write-Host "  '@ | Set-Content `"$envFile`""
    Write-Host ""
}

# Create profile directory if needed
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
    Write-Host "  Created: $profileDir" -ForegroundColor Green
}

# Check if already installed
if ((Test-Path $profileFile) -and (Select-String -Path $profileFile -Pattern "claude" -Quiet)) {
    Write-Host "  PowerShell: Already installed" -ForegroundColor Yellow
} else {
    # Append loader to profile
    $loaderScript = @'

# Claude Code - Load API keys from ~/.claude/.env
$claudeEnvFile = "$HOME\.claude\.env"
if (Test-Path $claudeEnvFile) {
    Get-Content $claudeEnvFile | ForEach-Object {
        if ($_ -match '^export\s+(\w+)=["\x27]?([^"\x27]*)["\x27]?$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}
'@
    Add-Content -Path $profileFile -Value $loaderScript
    Write-Host "  PowerShell: Installed ($profileFile)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Ensure $envFile exists with your API keys"
Write-Host "  2. Restart PowerShell or run: . `$PROFILE"
