// Simple local backend for ScopeIQ wizard testing
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'submissions.json');

// Ensure submissions file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
    }

    // Handle POST to scopeiq-results
    if (method === 'POST' && parsedUrl.pathname === '/.netlify/functions/scopeiq-results') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                
                // Add timestamp
                data.submittedAt = new Date().toISOString();
                
                // Read existing submissions
                const submissions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
                
                // Add new submission
                submissions.push(data);
                
                // Save to file
                fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
                
                console.log('\n=== NEW SCOPEIQ SUBMISSION ===');
                console.log(`Name: ${data.name}`);
                console.log(`Email: ${data.email}`);
                console.log(`Company: ${data.company}`);
                console.log(`Recommendation: ${data.recommendation?.name || 'N/A'}`);
                console.log(`Timestamp: ${data.submittedAt}`);
                console.log('Full data saved to submissions.json');
                console.log('================================\n');
                
                // Send success response
                res.writeHead(200, corsHeaders);
                res.end(JSON.stringify({ 
                    ok: true, 
                    message: 'Assessment data received successfully!',
                    submissionId: submissions.length
                }));
                
            } catch (error) {
                console.error('Error processing submission:', error);
                res.writeHead(400, corsHeaders);
                res.end(JSON.stringify({ 
                    error: 'Invalid JSON data',
                    details: error.message 
                }));
            }
        });
        
        return;
    }

    // Handle GET to view submissions
    if (method === 'GET' && parsedUrl.pathname === '/submissions') {
        try {
            const submissions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            res.writeHead(200, corsHeaders);
            res.end(JSON.stringify(submissions, null, 2));
        } catch (error) {
            res.writeHead(500, corsHeaders);
            res.end(JSON.stringify({ error: 'Could not read submissions' }));
        }
        return;
    }

    // 404 for other routes
    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`\n🚀 ScopeIQ Local Backend running on http://localhost:${PORT}`);
    console.log(`📊 View submissions at: http://localhost:${PORT}/submissions`);
    console.log(`💾 Data saved to: ${DATA_FILE}\n`);
});

process.on('SIGINT', () => {
    console.log('\n👋 ScopeIQ Backend shutting down...');
    process.exit(0);
});