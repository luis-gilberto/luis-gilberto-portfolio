const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8081;
const STAGING_DIR = path.join(__dirname, 'staging-brand-refresh');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Default to index.html if pathname is root
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Construct file path within staging directory
    const filePath = path.join(STAGING_DIR, pathname);
    
    // Security check - ensure file is within staging directory
    if (!filePath.startsWith(STAGING_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Try to serve index.html for SPA routing
            const indexPath = path.join(STAGING_DIR, 'index.html');
            fs.access(indexPath, fs.constants.F_OK, (indexErr) => {
                if (indexErr) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found');
                } else {
                    serveFile(indexPath, res);
                }
            });
        } else {
            // Check if it's a directory
            fs.stat(filePath, (statErr, stats) => {
                if (statErr) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else if (stats.isDirectory()) {
                    // Try to serve index.html from directory
                    const indexPath = path.join(filePath, 'index.html');
                    fs.access(indexPath, fs.constants.F_OK, (indexErr) => {
                        if (indexErr) {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('Directory index not found');
                        } else {
                            serveFile(indexPath, res);
                        }
                    });
                } else {
                    serveFile(filePath, res);
                }
            });
        }
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(data);
        }
    });
}

server.listen(PORT, () => {
    console.log(`🚀 STAGING SERVER RUNNING`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📁 Serving: ${STAGING_DIR}`);
    console.log(`🔄 Auto-refresh: Disabled (manual refresh needed)`);
    console.log(`\n🎯 STAGING URLS:`);
    console.log(`   Main Hub: http://localhost:${PORT}/`);
    console.log(`   IMC Services: http://localhost:${PORT}/IMCServices/`);
    console.log(`   Advisory: http://localhost:${PORT}/advisory/`);
    console.log(`\n⚡ Ready for brand refresh development!`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Staging server shutting down...');
    server.close(() => {
        console.log('✅ Staging server stopped');
        process.exit(0);
    });
});