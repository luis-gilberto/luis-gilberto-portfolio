
# Deployment Verification & Synchronization Protocol

## Overview
This document outlines the mandatory verification steps, automated checks, and rollback procedures for the Creative Portal.

## 1. Automated Verification Script
We have implemented an automated script to verify the health and status of the deployment.

**Usage:**
```bash
# Verify Local Environment
npm run verify

# Verify Staging/Production (example)
npm run verify -- https://your-production-url.com
```

**Checks Performed:**
-   **System Health**: Queries `/api/health` for database connectivity and version.
-   **Critical Routes**: Checks availability of Home, Login, and Admin routes.
-   **Mobile Reachability**: Simulates a mobile User-Agent request.
-   **Environment Variables**: Checks for presence of critical keys (when running locally).

## 2. Health API Endpoint
The `/api/health` endpoint provides real-time status of the application.
-   **URL**: `/api/health`
-   **Response**: JSON object containing `status`, `version`, `database` connection state, and `timestamp`.

## 3. Mobile-Specific Testing Protocols
Before any client demo or major release, the following mobile checks are **mandatory**:

1.  **Responsive Layout Check**:
    -   Open Chrome DevTools (`F12`).
    -   Toggle Device Toolbar (`Ctrl+Shift+M`).
    -   Select **iPhone 12 Pro** and **Pixel 5**.
    -   Verify:
        -   Navigation menu (Hamburger) opens/closes correctly.
        -   No horizontal scrolling (overflow) on the dashboard.
        -   Text readability (no overlapping text).
        -   Buttons are tappable (adequate spacing).

2.  **Touch Interaction**:
    -   Verify swipe gestures on carousels/tables (if applicable).
    -   Verify modal closing via tap-outside.

3.  **Performance**:
    -   Run Lighthouse Mobile Audit on the Home and Dashboard pages.
    -   Ensure Performance score > 80.

## 4. Pre-Demo Deployment Checklist
**Must be completed 2 hours before any client demonstration.**

- [ ] **Run Automated Verification**: `npm run verify -- <DEPLOY_URL>` -> MUST PASS.
- [ ] **Database Sync**: Ensure `npx prisma db push` (dev) or migrations (prod) are applied.
- [ ] **Mobile Smoke Test**: Manually verify the "Critical Path" (Login -> Dashboard -> Project View) on a real mobile device or simulator.
- [ ] **Content Check**: Verify the latest "StrategyIQ" data is visible.
- [ ] **Environment Check**: Confirm the footer/header does not show "Development Mode" indicators (unless intended).

## 5. Rollback Procedures
If Production does not match Staging or fails verification:

### Immediate Rollback (Vercel)
1.  Go to Vercel Dashboard > Deployments.
2.  Find the last known "Green" (successful) deployment.
3.  Click **...** > **Redeploy** or **Promote to Production**.
4.  **Notify Team**: Post in Slack/Teams: "Rolling back to [Version/Commit] due to verification failure."

### Database Rollback
If a database migration caused the issue:
1.  Assess if data loss will occur.
2.  If safe, revert the schema change in code and redeploy.
3.  If critical data corruption, restore from the latest Supabase backup (Point-in-Time Recovery).

## 6. Audit Trail
All verification runs are logged locally to `deployment-logs.txt`.
-   Commit the `package.json` version bump for every release.
-   Tag releases in Git: `git tag -a v0.1.0 -m "Release description"`.
