const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Strip query strings (e.g., ?v=1.2.3 or ide_webview_request_time)
    const urlPath = req.url.split('?')[0];
    console.log(`${req.method} ${urlPath}`);
    
    // Ignore Vite client requests common in some IDE previews
    if (urlPath === '/@vite/client') {
        res.writeHead(204);
        res.end();
        return;
    }

    let filePath = urlPath === '/' ? '/index.html' : urlPath;
    
    // Handle specific routes
    if (req.url === '/experimental' || req.url === '/experimental/') {
        filePath = '/Experimental-HP.html';
    }
    
    // If the path ends with '/', try to serve index.html from that directory
    if (filePath.endsWith('/')) {
        filePath += 'index.html';
    }
    
    filePath = path.join(__dirname, filePath);
    
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Check if the path is a directory and try to serve index.html
    fs.stat(filePath, (statError, stats) => {
        if (statError) {
            if (statError.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + statError.code);
            }
            return;
        }
        
        if (stats.isDirectory()) {
            // If it's a directory, try to serve index.html from it
            const indexPath = path.join(filePath, 'index.html');
            fs.readFile(indexPath, (error, content) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        res.writeHead(404);
                        res.end('File not found');
                    } else {
                        res.writeHead(500);
                        res.end('Server error: ' + error.code);
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        } else {
            // If it's a file, serve it normally
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    res.writeHead(500);
                    res.end('Server error: ' + error.code);
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        }
    });
});

server.listen(3002, () => {
    console.log('Server running at http://localhost:3002/');
});