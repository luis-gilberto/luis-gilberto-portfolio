const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
	const urlPath = req.url.split('?')[0];

	if (urlPath === '/case-study-teams-launch.html') {
		const caseStudyPath = path.join(__dirname, '..', 'case-study-teams-launch.html');
		fs.readFile(caseStudyPath, (error, content) => {
			if (error) {
				res.writeHead(500);
				res.end('Server error: ' + error.code);
			} else {
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end(content, 'utf-8');
			}
		});
		return;
	}

	if (urlPath === '/assets/css/case-study-theme.css') {
		const cssPath = path.join(__dirname, '..', 'assets', 'css', 'case-study-theme.css');
		fs.readFile(cssPath, (error, content) => {
			if (error) {
				res.writeHead(500);
				res.end('Server error: ' + error.code);
			} else {
				res.writeHead(200, { 'Content-Type': 'text/css' });
				res.end(content, 'utf-8');
			}
		});
		return;
	}

	if (
		urlPath === '/assets/videos/power_of_we_ultra_optimized.mp4' ||
		urlPath === '/assets/videos/power_of_we_web_optimized.mp4'
	) {
		const videoFile = urlPath.split('/').pop();
		const videoPath = path.join(__dirname, '..', 'assets', 'videos', videoFile);
		fs.readFile(videoPath, (error, content) => {
			if (error) {
				res.writeHead(500);
				res.end('Server error: ' + error.code);
			} else {
				res.writeHead(200, { 'Content-Type': 'video/mp4' });
				res.end(content);
			}
		});
		return;
	}

	if (urlPath === '/assets/js/theme-toggle.js') {
		const jsPath = path.join(__dirname, 'assets', 'js', 'theme-toggle.js');
		fs.readFile(jsPath, (error, content) => {
			if (error) {
				// Try root assets if not in deploy
				const rootJsPath = path.join(__dirname, '..', 'assets', 'js', 'theme-toggle.js');
				fs.readFile(rootJsPath, (err2, content2) => {
					if (err2) {
						res.writeHead(404);
						res.end('File not found');
					} else {
						res.writeHead(200, { 'Content-Type': 'text/javascript' });
						res.end(content2, 'utf-8');
					}
				});
			} else {
				res.writeHead(200, { 'Content-Type': 'text/javascript' });
				res.end(content, 'utf-8');
			}
		});
		return;
	}

	let filePath = urlPath === '/' ? '/index.html' : urlPath;
	
	// Handle specific routes
	if (urlPath === '/experimental' || urlPath === '/experimental/') {
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
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
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
