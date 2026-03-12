const fs = require('fs');
const path = require('path');

const insightsDir = path.join(__dirname, '..', 'insights');
const faviconLinks = `
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/insights/assets/icons/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="/insights/assets/icons/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/insights/assets/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="64x64" href="/insights/assets/icons/favicon-64x64.png">
`;

function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file already has favicon links
  if (!content.includes('rel="icon"')) {
    // Split the content into lines
    const lines = content.split('\n');
    let headStartIndex = -1;
    let metaEndIndex = -1;
    
    // Find the head section and last meta tag
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<head>')) {
        headStartIndex = i;
      }
      if (lines[i].includes('<meta') || lines[i].includes('</title>')) {
        metaEndIndex = i;
      }
    }
    
    if (headStartIndex !== -1 && metaEndIndex !== -1) {
      // Insert favicon links after the last meta tag
      lines.splice(metaEndIndex + 1, 0, faviconLinks);
      content = lines.join('\n');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      return true;
    }
  }
  console.log(`Skipped ${filePath} - already has favicon links or invalid structure`);
  return false;
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  let updatedFiles = 0;
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      updatedFiles += processDirectory(fullPath);
    } else if (item.endsWith('.html')) {
      if (updateHtmlFile(fullPath)) {
        updatedFiles++;
      }
    }
  });
  
  return updatedFiles;
}

// Start processing from insights directory
const totalUpdated = processDirectory(insightsDir);
console.log(`\nTotal files updated: ${totalUpdated}`);