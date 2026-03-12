// Dedicated preview server for The Hub main page with logging and metrics
// Usage: set environment variables and run:
//   $env:NODE_ENV="production"; $env:SERVE_ROOT="<repo-root>"; $env:PORT=64100; node hub-preview-server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = parseInt(process.env.PORT || '64100', 10);
const ROOT_DIR = process.env.SERVE_ROOT || __dirname;

// Ensure logs directory exists
const LOG_DIR = path.join(__dirname, 'logs');
try { if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR); } catch {}
const LOG_FILE = path.join(LOG_DIR, 'hub-preview.log');

function appendLog(line) {
  const stamp = new Date().toISOString();
  const output = `[${stamp}] ${line}\n`;
  try { fs.appendFileSync(LOG_FILE, output); } catch {}
  console.log(line);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

const compressible = new Set(['.html', '.css', '.js', '.svg', '.json']);

// Metrics
let reqCount = 0;
let bytesSentTotal = 0;
const durations = [];
const statusBuckets = { '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0 };

function recordMetrics(status, bytes, ms) {
  reqCount++;
  bytesSentTotal += bytes || 0;
  durations.push(ms);
  if (durations.length > 1000) durations.shift();
  const bucket = status >= 500 ? '5xx' : status >= 400 ? '4xx' : status >= 300 ? '3xx' : '2xx';
  statusBuckets[bucket]++;
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

setInterval(() => {
  const avg = durations.length ? (durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
  const p95 = percentile(durations, 95);
  const summary = `Metrics: requests=${reqCount}, bytes=${bytesSentTotal}, avgMs=${avg.toFixed(2)}, p95Ms=${p95.toFixed(2)}, buckets=${JSON.stringify(statusBuckets)}`;
  appendLog(summary);
}, 60000);

const server = http.createServer((req, res) => {
  const start = process.hrtime.bigint();
  const ua = req.headers['user-agent'] || '';
  const ref = req.headers['referer'] || req.headers['referrer'] || '';
  const acceptEncoding = (req.headers['accept-encoding'] || '').toLowerCase();

  // Map URL to file path, serving directories with index.html
  let urlPath = decodeURIComponent(req.url);
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  } else if (urlPath.endsWith('/')) {
    urlPath += 'index.html';
  }

  const filePath = path.join(ROOT_DIR, urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const type = mimeTypes[ext] || 'application/octet-stream';

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      const body = Buffer.from('404 - File Not Found');
      res.end(body);
      const durationMs = Number((process.hrtime.bigint() - start) / 1000000n);
      recordMetrics(404, body.length, durationMs);
      appendLog(`404 ${req.method} ${req.url} -> ${urlPath} [${durationMs}ms] UA="${ua}" Ref="${ref}"`);
      return;
    }

    // Read file
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        const body = Buffer.from('500 - Server Error');
        res.end(body);
        const durationMs = Number((process.hrtime.bigint() - start) / 1000000n);
        recordMetrics(500, body.length, durationMs);
        appendLog(`500 ${req.method} ${req.url} -> ${urlPath} [${durationMs}ms] UA="${ua}" Ref="${ref}" Err=${readErr.code}`);
        return;
      }

      const headers = {
        'Content-Type': type,
        'X-Env': NODE_ENV,
      };

      // Basic caching: long cache for assets, no-cache for HTML
      if (ext === '.html') {
        headers['Cache-Control'] = 'no-cache';
      } else {
        headers['Cache-Control'] = 'public, max-age=31536000, immutable';
      }

      // Compression (gzip) for text assets
      const shouldGzip = compressible.has(ext) && acceptEncoding.includes('gzip');
      if (shouldGzip) {
        zlib.gzip(content, (zipErr, zipped) => {
          if (zipErr) {
            // Fallback to uncompressed
            res.writeHead(200, headers);
            res.end(content);
            const durationMs = Number((process.hrtime.bigint() - start) / 1000000n);
            recordMetrics(200, content.length, durationMs);
            appendLog(`200 ${req.method} ${req.url} (${content.length}b) [${durationMs}ms] UA="${ua}" Ref="${ref}"`);
          } else {
            headers['Content-Encoding'] = 'gzip';
            headers['Vary'] = 'Accept-Encoding';
            res.writeHead(200, headers);
            res.end(zipped);
            const durationMs = Number((process.hrtime.bigint() - start) / 1000000n);
            recordMetrics(200, zipped.length, durationMs);
            appendLog(`200 ${req.method} ${req.url} (gz ${zipped.length}b) [${durationMs}ms] UA="${ua}" Ref="${ref}"`);
          }
        });
      } else {
        res.writeHead(200, headers);
        res.end(content);
        const durationMs = Number((process.hrtime.bigint() - start) / 1000000n);
        recordMetrics(200, content.length, durationMs);
        appendLog(`200 ${req.method} ${req.url} (${content.length}b) [${durationMs}ms] UA="${ua}" Ref="${ref}"`);
      }
    });
  });
});

server.listen(PORT, () => {
  appendLog(`Hub Preview Server running at http://localhost:${PORT}/`);
  appendLog(`NODE_ENV=${NODE_ENV} ROOT_DIR=${ROOT_DIR}`);
  appendLog(`Preview URL: http://localhost:${PORT}/TheHub/`);
});

