const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;

// Removed device detection - now serving responsive about.html for all devices

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Serve about.html for all about page requests
    if (req.url === '/about.html' || req.url === '/about') {
        filePath = '/about.html';
        console.log('Serving responsive about.html for all devices');
    }
    
    filePath = path.join(__dirname, filePath);
    
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.pdf': 'application/pdf'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use`);
    } else {
        console.error('Server error:', err);
    }
});