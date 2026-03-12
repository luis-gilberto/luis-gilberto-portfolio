# Change Verification Checklist

- Build completes without errors (`npm ci`, `npm run build`)
- Updated assets present under `assets/` with correct paths
- Cache-busting version injected (`assets/js/version.js` loaded)
- Insights JSON fetch returns updated content (`/insights/data/articles-metadata.json`)
- About page images show new assets (hard refresh / incognito)
- Modal video plays and closes correctly on Teams case study
- Cross-browser validation (Chrome, Edge, Firefox, Safari)
- Mobile responsiveness verified (iOS/Android)
- External links and rewrites (`vercel.json`) behave as expected
- GitHub Actions completed successfully (Pages) or Vercel deploy succeeded

## Notes
- If updates don’t appear, confirm caches are bypassed and version parameter is present on requests.
