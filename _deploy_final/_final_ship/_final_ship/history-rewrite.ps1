# Git History Rewrite Script - Remove large backup folder
# WARNING: This is a destructive operation that rewrites Git history

Write-Host "Checking working tree status..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "ERROR: Working tree not clean. Commit or stash first." -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: Working tree is clean" -ForegroundColor Green

# Create backup branch
$backupBranch = "backup-before-history-rewrite-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "Creating backup branch: $backupBranch" -ForegroundColor Yellow
git branch $backupBranch
git push origin $backupBranch
Write-Host "SUCCESS: Backup branch created and pushed" -ForegroundColor Green

# Check if git-filter-repo is available
Write-Host "Checking git-filter-repo availability..." -ForegroundColor Yellow
try {
    python -c "import git_filter_repo" 2>$null
    Write-Host "SUCCESS: git-filter-repo already installed" -ForegroundColor Green
} catch {
    Write-Host "Installing git-filter-repo via pip" -ForegroundColor Yellow
    python -m pip install git-filter-repo
}

# Show repository size before cleanup
Write-Host "Repository size before cleanup:" -ForegroundColor Yellow
$sizeBefore = (Get-ChildItem .git -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Repository size: $([math]::Round($sizeBefore, 2)) MB" -ForegroundColor Cyan

# Nuclear wipe: remove the folder from all history
Write-Host "DESTRUCTIVE OPERATION: Removing project-backup-20250914_182531 from ALL history" -ForegroundColor Red
Write-Host "This will permanently delete this folder from all Git history!" -ForegroundColor Red
$confirm = Read-Host "Type 'YES' to continue or anything else to abort"
if ($confirm -ne 'YES') {
    Write-Host "Operation aborted by user" -ForegroundColor Red
    exit 1
}

git filter-repo --force --path "project-backup-20250914_182531" --invert-paths

# Add gitignore rule
Write-Host "Adding gitignore rule for local backups" -ForegroundColor Yellow
Add-Content -Path .gitignore -Value "`n# local backups`nproject-backup*/"
git add .gitignore
git commit -m "chore: ignore local backup folders (post history rewrite)" --allow-empty

# Show repository size after cleanup
Write-Host "Repository size after cleanup:" -ForegroundColor Yellow
$sizeAfter = (Get-ChildItem .git -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Repository size: $([math]::Round($sizeAfter, 2)) MB" -ForegroundColor Cyan
Write-Host "Space saved: $([math]::Round($sizeBefore - $sizeAfter, 2)) MB" -ForegroundColor Green

# Push rewritten history
Write-Host "Pushing rewritten history..." -ForegroundColor Yellow
git push origin --force --all
git push origin --force --tags

Write-Host "SUCCESS: History rewritten and pushed." -ForegroundColor Green
Write-Host "Next: In Netlify UI, Deploys -> Clear cache and deploy site." -ForegroundColor Cyan
Write-Host "Backup branch available: $backupBranch" -ForegroundColor Yellow