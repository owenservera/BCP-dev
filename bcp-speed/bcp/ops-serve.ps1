# BCP-SPEED serve launcher - starts `opencode serve` for the Task 4 control plane.
# Fixed port 4096, loopback only. Serves the BCP workspace dir so project
# config (opencode.json -> bcp MCP) loads. ASCII-only, PS 5.1-safe.
# Run by hand: powershell -ExecutionPolicy Bypass -File ops-serve.ps1
# Register: schtasks /Create /F /TN "BCP-Serve" /SC ONSTART /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `\"C:\0-BlackBoxProject-0\Vivim-omega\BCP-dev\bcp-speed\bcp\ops-serve.ps1`\""
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

$port = 4096
$host_ = "127.0.0.1"
Write-Host ("[serve] starting opencode serve --port {0} --hostname {1} (cwd={2})" -f $port, $host_, $PSScriptRoot)
& opencode serve --port $port --hostname $host_
