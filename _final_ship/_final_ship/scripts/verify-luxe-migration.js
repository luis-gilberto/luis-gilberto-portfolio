const fs = require('fs');
const path = require('path');

const filesToVerify = [
    { path: 'myexperience-1.html', expectedActive: 'experience' },
    { path: 'about.html', expectedActive: 'about' },
    { path: 'contact.html', expectedActive: 'contact' },
    { path: 'index.html', expectedActive: 'home' },
    { path: 'insights/index.html', expectedActive: 'insights', expectedBase: '../' }
];

let hasErrors = false;

console.log('🔍 Verifying Luxe System Migration...');

filesToVerify.forEach(file => {
    const filePath = path.join(__dirname, '..', file.path);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${file.path}`);
        hasErrors = true;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for hook
    const hookRegex = new RegExp(`<div id="site-nav" data-active="${file.expectedActive}"`, 'i');
    if (!hookRegex.test(content)) {
        console.error(`❌ ${file.path}: Missing or incorrect #site-nav hook (expected data-active="${file.expectedActive}")`);
        hasErrors = true;
    } else {
        console.log(`✅ ${file.path}: Hook present`);
    }

    // Check for script
    if (!content.includes('nav-component.js')) {
        console.error(`❌ ${file.path}: Missing nav-component.js script`);
        hasErrors = true;
    } else {
        console.log(`✅ ${file.path}: Script present`);
    }

    // Check for base if required
    if (file.expectedBase) {
        if (!content.includes(`data-base="${file.expectedBase}"`)) {
            console.error(`❌ ${file.path}: Missing data-base="${file.expectedBase}"`);
            hasErrors = true;
        } else {
            console.log(`✅ ${file.path}: Base path present`);
        }
    }

    // Check for legacy nav removal (basic check)
    if (content.includes('<div class="desktop-nav">') || content.includes('<nav class="site-header">')) {
         console.warn(`⚠️  ${file.path}: Possible legacy navigation markup found (review manually if intended)`);
    }
});

if (hasErrors) {
    console.error('\n🚨 Verification FAILED. Please fix errors before deploying.');
    process.exit(1);
} else {
    console.log('\n🎉 Verification PASSED. Ready for deployment.');
    process.exit(0);
}
