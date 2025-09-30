# Deploy Navigation Changes to luis-gilberto.com
# This script ensures all changes are committed and pushed to trigger Netlify deployment

Write-Host "=== DEPLOYING NAVIGATION CHANGES ==="
Write-Host "Files modified: animated-landing.html, creative-convergence.html"
Write-Host "Changes: Added Resume navigation links"
Write-Host ""

# Check git status
Write-Host "1. Checking git status..."
git status

# Add all changes
Write-Host "\n2. Adding changes to git..."
git add .

# Commit changes
Write-Host "\n3. Committing changes..."
git commit -m "Fix navigation: Add Resume links to animated-landing.html and creative-convergence.html - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Push to trigger Netlify deployment
Write-Host "\n4. Pushing to GitHub to trigger Netlify deployment..."
git push origin main

Write-Host "\n=== DEPLOYMENT COMPLETE ==="
Write-Host "Changes pushed to GitHub. Netlify will automatically deploy."
Write-Host "Check deployment status at: https://app.netlify.com/sites/luis-gilberto/deploys"
Write-Host "Live site: https://luis-gilberto.com"
Write-Host "\nChanges should be live in 1-2 minutes."

# Wait and check site
Write-Host "\nWaiting 30 seconds before checking site..."
Start-Sleep -Seconds 30

Write-Host "\nChecking site status..."
try {
    $response = Invoke-WebRequest -Uri "https://luis-gilberto.com" -Method Head -TimeoutSec 10
    Write-Host "Site is responding: HTTP $($response.StatusCode)"
} catch {
    Write-Host "Site check failed: $($_.Exception.Message)"
}

Write-Host "\n=== DONE ==="
Write-Host "Your navigation changes should now be live at luis-gilberto.com"