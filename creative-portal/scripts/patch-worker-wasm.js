
const fs = require('fs');
const path = require('path');

const filesToPatch = [
  path.join(process.cwd(), '.open-next', 'server-functions', 'default', 'handler.mjs'),
  path.join(process.cwd(), '.open-next', 'middleware', 'handler.mjs')
];

// Regex to find absolute paths to .wasm files in imports
// Matches: "C:/.../file.wasm?module" or "C:/.../file.wasm"
const absoluteRegex = /"([a-zA-Z]:\/[^"]+\/([^/]+\.wasm))(\?module)?"/g;

// Regex to find relative paths with ?module (which might be causing issues on Windows)
// Matches: "./file.wasm?module"
const relativeRegex = /"(\.\/([^"]+\.wasm))\?module"/g;

filesToPatch.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}, skipping...`);
    return;
  }

  console.log(`Processing ${filePath}...`);
  const targetDir = path.dirname(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Handle Absolute Paths
  let newContent = content.replace(absoluteRegex, (match, fullPath, filename, query) => {
    console.log(`Found Absolute WASM reference: ${fullPath}${query || ''}`);
    
    // Check if file exists at absolute path
    if (fs.existsSync(fullPath)) {
      console.log(`Copying ${filename} to ${targetDir}`);
      try {
        fs.copyFileSync(fullPath, path.join(targetDir, filename));
        modified = true;
        // Replace absolute path with relative path AND remove ?module
        const newImport = `"./${filename}"`;
        console.log(`Replaced import: ${match} -> ${newImport}`);
        return newImport;
      } catch (e) {
        console.error(`Error copying file: ${e.message}`);
        return match;
      }
    } else {
       // ... existing fallback logic ...
      console.warn(`File not found at ${fullPath}, skipping copy.`);
      if (fs.existsSync(path.join(targetDir, filename))) {
        console.log(`File already exists in target dir, updating path.`);
        modified = true;
        return `"./${filename}"`; // Remove ?module here too
      }
      return match;
    }
  });

  // 2. Handle Relative Paths with ?module (Cleanup from previous runs or existing relative imports)
  newContent = newContent.replace(relativeRegex, (match, relativePath, filename) => {
      console.log(`Found Relative WASM reference with ?module: ${match}`);
      const newImport = `"${relativePath}"`; // relativePath includes ./filename.wasm but NOT ?module
      console.log(`Stripping ?module: ${match} -> ${newImport}`);
      modified = true;
      return newImport;
  });

  if (modified) {
    console.log(`Writing modified ${filePath}`);
    fs.writeFileSync(filePath, newContent);
  } else {
    console.log(`No WASM references modified in ${filePath}`);
  }
});
