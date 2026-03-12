@echo off
echo.
echo ========================================
echo    STAGING ENVIRONMENT SERVER
echo ========================================
echo.
echo Starting staging server on port 8081...
echo.
echo STAGING URLS:
echo   Main Hub: http://localhost:8081/
echo   IMC Services: http://localhost:8081/IMCServices/
echo   Advisory: http://localhost:8081/advisory/
echo.
echo Press Ctrl+C to stop the server
echo.
node staging-server.js
pause