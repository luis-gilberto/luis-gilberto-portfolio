# Deployment Pipeline Documentation

## Overview
This document outlines the deployment process for the Luis Gilberto Portfolio ecosystem to Cloudflare Pages.

## Project Configuration
- **Project Name**: misitio
- **Deployment Source**: GitHub Repository
- **Production Branch**: `main`
- **Live URL**: [https://misitio-6ld.pages.dev](https://misitio-6ld.pages.dev)

## Deployment Workflow

### 1. Staging and Committing Changes
Changes are committed to the local `main` branch with a descriptive message including a timestamp and feature summary.
```bash
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git add .
git commit -m "feat/deploy: $timestamp - [Feature Description]"
```

### 2. Pushing to Remote
Pushing to the remote `main` branch triggers the Cloudflare Pages build pipeline automatically.
```bash
git push origin main
```

### 3. Automated Build & Deploy
Cloudflare Pages monitors the `main` branch. Upon a new push, it:
1. Detects the changes.
2. Initiates a build process (if applicable).
3. Deploys the static assets to the global edge network.
4. Updates the live URL.

### 4. Verification
Verification is performed by checking the live URL for specific feature flags or CSS rules.
```bash
curl.exe -L -s https://misitio-6ld.pages.dev/insights/ | Select-String -Pattern "THEME IMAGE VISIBILITY LOGIC"
```

## Recent Deployment (2026-02-11)
- **Status**: Successful
- **Features Included**:
  - Restored high-fidelity Insights homepage from recovery source.
  - Fixed "Double Image" glitch in Latest Insight spotlight.
  - Locked Insights header to Light Mode styling (cream background).
  - Standardized global navigation across static pages.
