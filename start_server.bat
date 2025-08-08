@echo off
echo Starting HTTP Server...
echo.
echo Open your browser and go to: http://localhost:8080/brand-guide.html
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8080 2>nul || (
    echo Python not found, trying Node.js...
    npx serve . -p 8080 2>nul || (
        echo Node.js not found either.
        echo Please install Python or Node.js to run a local server.
        echo.
        echo Alternative: Open the HTML file directly in your browser,
        echo but some images may not load due to browser security restrictions.
        pause
    )
)
pause