const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('Starting server...');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // If the URL ends with a slash or is a directory, append index.html
    if (req.url.endsWith('/') && req.url !== '/') {
        filePath = req.url + 'index.html';
    }
    
    filePath = path.join(__dirname, filePath);
    
    // Check if the path is a directory and append index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }
    
    const extname = path.extname(filePath).toLowerCase();
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
        '.mp4': 'video/mp4',
        '.pdf': 'application/pdf'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            console.log(`Error reading file ${filePath}: ${error.message}`);
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error: ' + error.code);
            }
        } else {
            console.log(`Serving file: ${filePath}`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(8000, 'localhost', () => {
    console.log('Server running at http://localhost:8000/');
    console.log('Press Ctrl+C to stop the server');
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server stopped.');
        process.exit(0);
    });
});