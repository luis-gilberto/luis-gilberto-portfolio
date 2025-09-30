# Simple HTTP Server for Static Files
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()

Write-Host "Server started at http://localhost:8000"
Write-Host "Press Ctrl+C to stop the server"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/') {
            $localPath = '/index.html'
        }
        
        $filePath = Join-Path $PSScriptRoot $localPath.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            try {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                
                # Set content type based on file extension
                switch ($extension) {
                    '.html' { $response.ContentType = 'text/html' }
                    '.css' { $response.ContentType = 'text/css' }
                    '.js' { $response.ContentType = 'application/javascript' }
                    '.png' { $response.ContentType = 'image/png' }
                    '.jpg' { $response.ContentType = 'image/jpeg' }
                    '.jpeg' { $response.ContentType = 'image/jpeg' }
                    '.gif' { $response.ContentType = 'image/gif' }
                    '.svg' { $response.ContentType = 'image/svg+xml' }
                    '.mp4' { $response.ContentType = 'video/mp4' }
                    '.pdf' { $response.ContentType = 'application/pdf' }
                    default { $response.ContentType = 'application/octet-stream' }
                }
                
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
                Write-Host "200 - $($request.Url.LocalPath)"
            }
            catch {
                $response.StatusCode = 500
                Write-Host "500 - Error serving $($request.Url.LocalPath): $($_.Exception.Message)"
            }
        }
        else {
            $response.StatusCode = 404
            $notFoundContent = [System.Text.Encoding]::UTF8.GetBytes('404 - File Not Found')
            $response.ContentLength64 = $notFoundContent.Length
            $response.OutputStream.Write($notFoundContent, 0, $notFoundContent.Length)
            Write-Host "404 - $($request.Url.LocalPath)"
        }
        
        $response.Close()
    }
}
finally {
    $listener.Stop()
    Write-Host "Server stopped"
}