Deployment Log — 2025-12-15

Commit: 4dd1236 Conclude merge: brand guidelines fixes and canonicalization

Summary:
- Updated gradient text rendering in brand guidelines pages
- Added canonical link and unified portfolio links to brand-guidelines.html
- Applied The Lens cursor across portfolio pages

Commands executed:
- git status --porcelain
- git add -A
- git commit -m "Pre-deployment commit of pending changes"
- git pull --no-rebase origin main (merge in progress detected)
- git add brand-guidelines.html brand-guidelines/index.html
- git commit -m "Conclude merge: brand guidelines fixes and canonicalization"
- git push origin main

Notes:
- Remote and local diverged; merged and concluded, then pushed successfully
- Cloud build expected to trigger automatically on push to main

Verification Plan:
- Validate /brand-guidelines.html resolves on production
- Confirm /brand-guidelines/ 301 → /brand-guidelines.html
- Check gradient text and cursor behavior on production
