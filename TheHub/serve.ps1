param(
    [int]$port = 5173,
    [string]$root = ""
)

if (-not $root -or $root.Trim().Length -eq 0) {
    $root = Split-Path -Parent $PSCommandPath
}

Write-Host "Serving root: $root"

Add-Type -AssemblyName System.Net
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Server running at $prefix"

function Get-ContentType($ext) {
    switch ($ext.ToLower()) {
        '.html' { return 'text/html' }
        '.htm'  { return 'text/html' }
        '.css'  { return 'text/css' }
        '.js'   { return 'application/javascript' }
        '.json' { return 'application/json' }
        '.png'  { return 'image/png' }
        '.jpg'  { return 'image/jpeg' }
        '.jpeg' { return 'image/jpeg' }
        '.svg'  { return 'image/svg+xml' }
        '.ico'  { return 'image/x-icon' }
        default { return 'application/octet-stream' }
    }
}

while ($true) {
    try {
        while ($listener.IsListening) {
            try {
                $context = $listener.GetContext()
                $request = $context.Request
                $response = $context.Response

                $localPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath.Trim('/'))
                if ([string]::IsNullOrEmpty($localPath)) {
                    $localPath = 'index.html'
                }

                $filePath = Join-Path $root $localPath

                if (-not (Test-Path $filePath)) {
                    $response.StatusCode = 404
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $localPath")
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                    $response.Close()
                    continue
                }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = Get-ContentType([System.IO.Path]::GetExtension($filePath))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
            }
            catch {
                if (-not $listener.IsListening) { break }
                Write-Warning ("Request handling error: " + $_.Exception.Message)
                continue
            }
        }
    }
    catch {
        Write-Error $_
    }
    finally {
        if ($null -ne $listener) {
            try { $listener.Stop() } catch {}
            try { $listener.Close() } catch {}
        }
    }
}