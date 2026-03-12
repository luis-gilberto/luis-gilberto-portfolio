Param(
  [string]$Source = "contact.html"
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $Source)) {
  Write-Error "Source file not found: $Source"
}

function Ensure-Dir([string]$path) {
  if (-not (Test-Path $path)) { New-Item -ItemType Directory -Force -Path $path | Out-Null }
}

$targets = @(
  "_site/contact.html",
  "_site/contact/index.html",
  "_deploy_v2/contact.html",
  "_deploy_v2/contact/index.html",
  "_deploy_final/contact.html",
  "_deploy_final/contact/index.html"
)

Ensure-Dir "_site/contact"
Ensure-Dir "_deploy_v2/contact"
Ensure-Dir "_deploy_final/contact"

foreach ($t in $targets) {
  Copy-Item -Force $Source $t
  Write-Host "Synced: $t"
}

Write-Host "Contact sync complete."

