# Rollback Procedure

1. Identify the last known good commit or deployment version.
2. GitHub Pages:
   - Re-run the workflow on the good commit or use `pages` history to restore.
3. Vercel:
   - In the dashboard, promote the previous deployment to production.
4. Docker/Nginx:
   - Redeploy the previous image/tag and re-point Traefik to the prior service.
5. Verify:
   - Run through the Change Verification Checklist to confirm stability.

## Emergency Fallback
- Temporarily disable cache-busting by removing `assets/js/version.js` references and `fetch` override.
- Restore original video sources if media processing is suspected.
