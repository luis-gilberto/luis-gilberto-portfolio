const fs = require('fs');
const path = require('path');

// Expected navigation structure
const expectedNavItems = ['Home', 'About Me', 'Resume', 'Timeline', 'Experience', 'Contact'];

// Function to discover HTML files recursively
function discoverHtmlFiles(dir = '.', relativePath = '') {
    const files = [];
    const fullPath = path.join(__dirname, '..', dir);
    
    if (!fs.existsSync(fullPath)) return files;
    
    const items = fs.readdirSync(fullPath);
    
    items.forEach(item => {
        const itemPath = path.join(fullPath, item);
        const relativeItemPath = relativePath ? path.join(relativePath, item) : item;
        
        if (fs.statSync(itemPath).isDirectory()) {
            // Recursively check subdirectories
            files.push(...discoverHtmlFiles(path.join(dir, item), relativeItemPath));
        } else if (item.endsWith('.html')) {
            files.push(relativeItemPath.replace(/\\/g, '/'));
        }
    });
    
    return files;
}

// Discover all HTML files
const htmlFiles = discoverHtmlFiles();

// Files to exclude from validation (backups, temp files, etc.)
const excludeFiles = [
    'temp-latest-portfolio.html',
    'contact-clean.html',
    'dual-approach-video-new.html',
    'caseStudy_edge_mobile.html',
    'brand-guide-old.html',
    'sitemap-visual.html',
    'brand-guide-backup.html',
    'cv-onepager.html',
    'download-cv.html',
    'preview.html',
    'test.html',
    'thank-you.html',
    'video-test-simple.html',
    'visual_cv.html',
    'how-to-content.html',
    'slowdowntospeedup.html'
];

// Filter discovered files to exclude unwanted ones
const validHtmlFiles = htmlFiles.filter(file => {
    const fileName = path.basename(file);
    const isExcluded = excludeFiles.includes(fileName);
    
    // Exclude specific directories and patterns
    const isInExcludedDir = file.includes('backup') || 
                           file.includes('temp') || 
                           file.includes('Users/') ||
                           file.includes('editorial-project/') ||
                           file.includes('immersive-portfolio/') ||
                           file.includes('homepage-circular-test/') ||
                           file.includes('scope-intelligence') ||
                           file.includes('planning-hub/') ||
                           file.includes('IMCServices/') ||
                           file.includes('IMCPartnership/') ||
                           file.includes('node_modules/') ||
                           file.includes('netlify/') ||
                           file.includes('timeline/') ||
                           fileName.startsWith('test-') ||
                           fileName.includes('test') ||
                           fileName.includes('debug') ||
                           fileName.includes('signature_') ||
                           // Exclude individual insights articles (immersive experiences accessed via insights landing page)
                           file.includes('insights/ai-with-soul-unlocking-blank-page/') ||
                           file.includes('insights/move-at-speed-of-what-matters/');
    
    // Only include main content pages, insights landing page, and thoughts articles
    const isMainContent = !file.includes('/') || 
                         file === 'insights/index.html' || 
                         file.startsWith('thoughts/') ||
                         file.startsWith('case-study');
    
    return !isExcluded && !isInExcludedDir && isMainContent;
});

// Items that should NOT appear in navigation
const deprecatedItems = ['Services', 'ScopeIQ', 'Case Studies', 'CV'];

function validateNavigation() {
    console.log('🔍 Validating navigation consistency...');
    let errors = [];
    let warnings = [];
    
    validHtmlFiles.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for deprecated navigation items (only in actual navigation contexts)
            deprecatedItems.forEach(item => {
                // More specific patterns for navigation links only
                const navPatterns = [
                    `<a[^>]*>${item}</a>`,
                    `<a[^>]*href[^>]*>${item}</a>`,
                    `class="[^"]*nav[^"]*"[^>]*>${item}<`,
                    `class="[^"]*menu[^"]*"[^>]*>${item}<`
                ];
                
                navPatterns.forEach(pattern => {
                    const regex = new RegExp(pattern, 'i');
                    if (regex.test(content)) {
                        // Special case: CV is allowed in cv.html file
                        if (item === 'CV' && file === 'cv.html') {
                            return;
                        }
                        errors.push(`${file}: Found deprecated navigation item '${item}' in navigation context`);
                    }
                });
                
                // Also check for simple navigation patterns but exclude descriptive content
                if (content.includes(`>${item}</a>`)) {
                    // Special case: CV is allowed in cv.html file
                    if (item === 'CV' && file === 'cv.html') {
                        return;
                    }
                    errors.push(`${file}: Found deprecated navigation item '${item}' (likely navigation link)`);
                }
                
                // For "Case Studies" specifically, allow descriptive text in Experience page
                if (item === 'Case Studies' && file === 'myexperience.html') {
                    // Allow descriptive mentions in Experience page content
                    return;
                }
                
                // Check for navigation-like patterns but exclude descriptive content
                if (content.includes(`>${item}<`) && 
                    !content.includes(`<span class="metric-label">${item}</span>`) &&
                    !content.includes(`class="card-description"`) &&
                    !content.includes(`<p class="card-description">`) &&
                    !(item === 'Case Studies' && file === 'myexperience.html')) {
                    // Special case: CV is allowed in cv.html file
                    if (item === 'CV' && file === 'cv.html') {
                        return;
                    }
                    errors.push(`${file}: Found deprecated navigation item '${item}' (likely navigation link)`);
                }
            });
            
            // Check for missing Resume link (should be present in most files)
            if (!content.includes('>Resume<') && !content.includes('"Resume"') && file !== 'cv.html') {
                warnings.push(`${file}: Missing 'Resume' navigation link`);
            }
            
            // Check for consistent navigation structure (less strict for case study pages)
            const navSections = content.match(/<nav[^>]*>.*?<\/nav>/gs) || [];
            const desktopNavs = content.match(/desktop-nav/g) || [];
            const mobileNavs = content.match(/mobile-menu-nav|mobile-menu-links/g) || [];
            
            // Only warn about missing navigation for main pages
            const isMainPage = ['index.html', 'about.html', 'contact.html', 'myexperience.html', 'timeline.html'].includes(file);
            
            if (isMainPage && desktopNavs.length === 0) {
                warnings.push(`${file}: No desktop navigation found`);
            }
            
            if (isMainPage && mobileNavs.length === 0) {
                warnings.push(`${file}: No mobile navigation found`);
            }
            
            console.log(`✓ Checked ${file}`);
        } else {
            warnings.push(`File not found: ${file}`);
        }
    });
    
    // Report results
    console.log('\n📊 Validation Results:');
    console.log(`Files checked: ${validHtmlFiles.length}`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
        console.log('\n❌ ERRORS (must fix):');
        errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS (should review):');
        warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (errors.length === 0 && warnings.length === 0) {
        console.log('\n✅ All navigation checks passed!');
    }
    
    // Exit with error code if there are errors
    if (errors.length > 0) {
        console.log('\n🚨 Navigation validation FAILED. Please fix errors before deploying.');
        process.exit(1);
    } else {
        console.log('\n🎉 Navigation validation PASSED.');
        process.exit(0);
    }
}

// Run validation
validateNavigation();