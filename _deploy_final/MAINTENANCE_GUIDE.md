# Portfolio Maintenance Guide

## 🚨 Prevention Strategies

### 1. Navigation Consistency

#### Component-Based Navigation
- **Create a single navigation component** that all pages import
- Store navigation items in a central configuration file
- Use template includes or JavaScript modules to ensure consistency

#### Current Navigation Structure
```
Home -> index.html
About Me -> about.html
Resume -> cv.html
Timeline -> timeline.html
Experience -> myexperience.html
Contact -> contact.html
```

#### Important: Case Studies Context
- **✅ ALLOWED**: "Case studies" as descriptive text in Experience page (myexperience.html)
- **❌ NOT ALLOWED**: "Case Studies" as navigation menu items
- **✅ RECOMMENDED**: Individual case study articles should link back to Experience page for easy navigation

### 2. Pre-Deployment Checklist

#### Before Every Commit:
- [ ] Test all navigation links on desktop and mobile
- [ ] Verify consistent terminology across all pages
- [ ] Check localhost:8000 functionality
- [ ] Run navigation consistency check (see script below)

#### Git Hooks Setup
Create `.git/hooks/pre-commit` to automatically check for inconsistencies:
```bash
#!/bin/bash
# Check for navigation inconsistencies
if grep -r "Services\|ScopeIQ\|Case Studies" *.html --exclude-dir=assets; then
    echo "❌ Found old navigation items. Please update before committing."
    exit 1
fi
echo "✅ Navigation consistency check passed"
```

### 3. Automated Testing

#### Navigation Validation Script
Create `scripts/validate-navigation.js`:
```javascript
const fs = require('fs');
const path = require('path');

const expectedNavItems = ['Home', 'About Me', 'Resume', 'Timeline', 'Experience', 'Contact'];
const htmlFiles = ['index.html', 'about.html', 'contact.html', 'myexperience.html', 'timeline.html', 'cv.html'];

function validateNavigation() {
    let errors = [];
    
    htmlFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for old navigation items
            const oldItems = ['Services', 'ScopeIQ', 'Case Studies'];
            oldItems.forEach(item => {
                if (content.includes(`>${item}<`) || content.includes(`"${item}"`)) {
                    errors.push(`${file}: Found old navigation item '${item}'`);
                }
            });
            
            // Check for CV instead of Resume
            if (content.includes('>CV<') && !file.includes('cv.html')) {
                errors.push(`${file}: Found 'CV' instead of 'Resume' in navigation`);
            }
        }
    });
    
    if (errors.length > 0) {
        console.log('❌ Navigation validation failed:');
        errors.forEach(error => console.log(`  - ${error}`));
        process.exit(1);
    } else {
        console.log('✅ Navigation validation passed');
    }
}

validateNavigation();
```

### 4. Deployment Safety

#### Always Test Locally First
1. Start local server: `node simple-server.js`
2. Test at `http://localhost:8000/`
3. Navigate through all pages
4. Check mobile menu functionality
5. Only deploy if everything works

#### Backup Strategy
- Keep working backups of main pages
- Tag stable releases: `git tag -a v1.0 -m "Stable release"`
- Document major changes in commit messages

### 5. File Organization

#### Keep These Files Consistent:
- `index.html` - Homepage
- `about.html` - About page
- `contact.html` - Contact page
- `myexperience.html` - Experience page
- `timeline.html` - Timeline page
- `cv.html` - Resume page
- `brand/index.html` - Brand Page

#### Avoid Editing:
- Backup files (`*_backup.html`)
- Component files in `assets/Components/`
- Test files (`test*.html`)

### 6. Emergency Recovery

#### If Site Breaks:
1. Check git log: `git log --oneline -10`
2. Revert to last working commit: `git reset --hard <commit-hash>`
3. Test locally before pushing
4. Force push if necessary: `git push --force-with-lease`

#### Quick Navigation Fix:
If navigation is broken, search and replace:
```bash
# Find all navigation issues
grep -r "Services\|ScopeIQ\|Case Studies" *.html

# Replace CV with Resume (be careful with cv.html)
grep -r ">CV<" *.html | grep -v cv.html
```

### 7. Regular Maintenance

#### Weekly:
- [ ] Test all navigation links
- [ ] Check for broken images/videos
- [ ] Verify contact form functionality

#### Monthly:
- [ ] Run full site audit
- [ ] Update dependencies if any
- [ ] Check performance metrics
- [ ] Backup current working state

### 8. Contact Information Updates

When updating contact info, check these files:
- `contact.html` - Main contact page
- Footer sections in all pages
- `README.md` - If it contains contact info

---

## 🔧 Quick Commands

```bash
# Start local development
node simple-server.js

# Check navigation consistency
node scripts/validate-navigation.js

# Commit with validation
git add . && git commit -m "Your message"

# Deploy safely
git push
```

## 📞 Emergency Contacts

If you need help:
1. Check this guide first
2. Review recent git commits
3. Test changes locally before deploying
4. Keep backups of working versions

---

*Last updated: January 2025*
*Keep this guide updated as the site evolves*