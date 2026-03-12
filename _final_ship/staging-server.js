const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
// Serve the 'deploy' directory as the root for staging
const ROOT_DIR = path.join(__dirname, 'deploy');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.url}`);
    
    // Basic security: prevent directory traversal
    let safeUrl = req.url.split('?')[0]; // Remove query string
    if (safeUrl.includes('..')) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // Default to index.html for root
    if (safeUrl === '/') {
        safeUrl = '/index.html';
    }

    let filePath = path.join(ROOT_DIR, safeUrl);

    // Check if path exists
    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
            return;
        }

        // If directory, try to serve index.html
        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        // Read and serve the file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found (index.html missing in directory)');
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                const extname = path.extname(filePath).toLowerCase();
                const contentType = mimeTypes[extname] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`   STAGING ENVIRONMENT RESTORED`);
    console.log(`========================================`);
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Serving content from: ${ROOT_DIR}`);
    console.log(`Press Ctrl+C to stop`);
});
