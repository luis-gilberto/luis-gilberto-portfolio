const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const HOST = 'localhost';

console.log('Starting quick server...');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    let filePath = req.url === '/' ? '/preview.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };
    
    const contentType = mimeTypes[ext] || 'text/plain';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error(`Error reading ${filePath}:`, err.message);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`\n=================================`);
    console.log(`Server is running!`);
    console.log(`URL: http://${HOST}:${PORT}/`);
    console.log(`=================================\n`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Try a different port.`);
    }
});

// Keep the process alive
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});