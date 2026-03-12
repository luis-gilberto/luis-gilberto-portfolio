# Critical Assets Verification Script
# Checks if all required timeline assets are in place

param(
    [switch]$Detailed,
    [switch]$Fix
)

# Define critical assets
$criticalAssets = @{
    "Videos" = @(
        "assets/Ascent.mp4",
        "assets/Disruption.mp4", 
        "assets/Rise.mp4",
        "assets/Foundations.mp4",
        "assets/images/Ascent.mp4",
        "assets/images/Rise.mp4"
    )
    "Images" = @(
        "assets/images/Brands_I_Supported_Foundations.png",
        "assets/images/Brands_I_Supported_Ascent.png",
        "assets/images/Brands_I_Supported_Rewrite.png",
        "assets/images/Brands_I_Supported_Rise.png",
        "assets/images/Foundations.png",
        "assets/images/Ascent3.png",
        "assets/images/Rewrite.png",
        "assets/images/Rise.png",
        "assets/images/Reinvention.png",
        "assets/Rewrite.png",
        "assets/Reinvention.png"
    )
}

$backupLocation = "CRITICAL_ASSETS"
$missingFiles = @()
$foundFiles = @()

Write-Host "Verifying Critical Timeline Assets..." -ForegroundColor Cyan
Write-Host "=" * 50

foreach ($category in $criticalAssets.Keys) {
    Write-Host "`nChecking ${category}:" -ForegroundColor Yellow
    
    foreach ($file in $criticalAssets[$category]) {
        $fullPath = Join-Path $PWD $file
        
        if (Test-Path $fullPath) {
            $foundFiles += $file
            if ($Detailed) {
                $size = (Get-Item $fullPath).Length
                $sizeKB = [math]::Round($size / 1KB, 2)
                Write-Host "  [OK] $file ($sizeKB KB)" -ForegroundColor Green
            } else {
                Write-Host "  [OK] $file" -ForegroundColor Green
            }
        } else {
            $missingFiles += $file
            Write-Host "  [MISSING] $file" -ForegroundColor Red
            
            # Check if file exists in backup location
            $backupPath = Join-Path $backupLocation (Split-Path $file -Leaf)
            if (Test-Path $backupPath) {
                Write-Host "    [BACKUP] Found in backup: $backupPath" -ForegroundColor Yellow
                
                if ($Fix) {
                    # Create directory if it doesn't exist
                    $targetDir = Split-Path $fullPath -Parent
                    if (!(Test-Path $targetDir)) {
                        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                    }
                    
                    # Copy from backup
                    Copy-Item $backupPath $fullPath -Force
                    Write-Host "    [RESTORED] Restored from backup" -ForegroundColor Green
                    $foundFiles += $file
                    $missingFiles = $missingFiles | Where-Object { $_ -ne $file }
                }
            }
        }
    }
}

# Summary
Write-Host "`n" + "=" * 50
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 50

$totalFiles = ($criticalAssets.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
$foundCount = $foundFiles.Count
$missingCount = $missingFiles.Count

Write-Host "Total Critical Files: $totalFiles" -ForegroundColor White
Write-Host "Found: $foundCount" -ForegroundColor Green
Write-Host "Missing: $missingCount" -ForegroundColor Red

if ($missingCount -eq 0) {
    Write-Host "`nAll critical assets are present!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nMissing critical assets detected!" -ForegroundColor Red
    
    if (!$Fix) {
        Write-Host "`nRun with -Fix parameter to attempt automatic restoration from backup" -ForegroundColor Yellow
        Write-Host "   Example: .\scripts\verify-critical-assets.ps1 -Fix" -ForegroundColor Gray
    }
    
    Write-Host "`nMissing files:" -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    
    exit 1
}