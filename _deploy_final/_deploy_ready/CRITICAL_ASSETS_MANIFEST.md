# Critical Assets Manifest

## Overview
This document lists all critical assets required for the Luis Gilberto portfolio website. These assets MUST be backed up and protected from accidental deletion.

## Timeline Era Assets

### Foundations Era (2012-2014)
- **Brands I Supported Image**: `assets/images/Brands_I_Supported_Foundations.png`
- **Brand Logos**:
  - `assets/images/brands/windows8.png`
  - `assets/images/brands/surface-rt.png`
  - `assets/images/brands/office2013.png`
  - `assets/images/brands/accessories.png`

### Ascent Era (2014-2016)
- **Brands I Supported Image**: `assets/images/Brands_I_Supported_Ascent.png`
- **Brand Logos**:
  - `assets/images/brands/surface.png`
  - `assets/images/brands/surface-pro3.png`
  - `assets/images/brands/ms-band.png`
  - `assets/images/brands/hololens.png`
  - `assets/images/brands/office.png`

### Rewrite Era (2016-2018)
- **Brands I Supported Image**: `assets/images/Brands_I_Supported_Rewrite.png`
- **Brand Logos**:
  - `assets/images/brands/surface.png`
  - `assets/images/brands/accessories.png`
  - `assets/images/brands/office2016.png`
  - `assets/images/brands/office2019.png`

### Pivot Era (2019-2020)
- **Brands I Supported Image**: `assets/images/Brands_I_Supported_Pivot.png`
- **Brand Logos**:
  - `assets/images/brands/office.png`
  - `assets/images/brands/microsoft365.png`
  - `assets/images/brands/family-safety.png`

### Rise Era (2020-2023)
- **Brands I Supported Image**: `assets/images/Brands_I_Supported_Rise.png`
- **Brand Logos**:
  - `assets/images/brands/teams.png`
  - `assets/images/brands/free-to-be-free.png`

### Reinvention Era (2023-2025)
- **Brands I Supported Image**: `assets/images/Brands_I_Supported_Reinvention.png`
- **Brand Logos**:
  - `assets/images/brands/edge.png`
  - `assets/images/brands/copilot.png`

## Video Assets (Currently Missing - HIGH PRIORITY)
- `assets/images/Foundations.mp4` - Timeline era video
- `assets/images/Ascent.mp4` - Timeline era video
- `assets/images/Disruption.mp4` - Timeline era video
- `assets/images/Rise.mp4` - Timeline era video

## Other Critical Assets
- `assets/images/Rewrite.png` - Timeline era image
- `assets/images/Reinvention.png` - Timeline era image

## Current Status
✅ **RESTORED**: Basic brand logos and some campaign images
❌ **MISSING**: All timeline video files (.mp4)
❌ **MISSING**: Timeline era summary images (.png)
❌ **MISSING**: Individual brand logo files in brands/ subdirectory

## Root Cause Analysis
The `.gitignore` file excludes:
1. Large video files (exceeding GitHub's 100MB limit)
2. Backup files (*.bak, *.backup)
3. Build outputs and temporary files

## Prevention Strategy
1. Implement Git LFS for large files
2. Create multiple backup locations
3. Automated backup scripts
4. Asset monitoring system
5. Recovery procedures documentation

---
**Last Updated**: January 2025
**Status**: CRITICAL - Multiple assets missing