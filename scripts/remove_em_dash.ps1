$ErrorActionPreference = 'Stop'
$root = "$PSScriptRoot\.." | Resolve-Path | Select-Object -ExpandProperty Path

$includeDirs = @(
  (Join-Path $root '.'),
  (Join-Path $root 'portal'),
  (Join-Path $root 'assets'),
  (Join-Path $root 'insights'),
  (Join-Path $root 'TheHub')
)

foreach ($dir in $includeDirs) {
  if (-not (Test-Path $dir)) { continue }
  $files = Get-ChildItem -Path $dir -Recurse -Include *.html,*.js,*.css -File |
    Where-Object { $_.FullName -notmatch "\\creative-portal\\" -and $_.FullName -notmatch "\\node_modules\\" }
  foreach ($f in $files) {
    $content = Get-Content -Raw -Encoding UTF8 -Path $f.FullName
    $newContent = $content -replace " \u2014 ", ". "
    $newContent = $newContent -replace "\u2014", " - "
    if ($newContent -ne $content) {
      [System.IO.File]::WriteAllText($f.FullName, $newContent, [System.Text.Encoding]::UTF8)
      Write-Host "Patched: $($f.FullName)"
    }
  }
}
Write-Host "Static World EM-dash purge complete."
