@echo off
echo ========================================
echo   Luis Gilberto Portfolio Deployment
echo ========================================
echo.

echo Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed!
echo.

echo Initializing Git repository...
git init

echo Adding all files to Git...
git add .

echo Creating initial commit...
git commit -m "Initial portfolio commit - ready for Cloudflare Pages"

echo.
echo ========================================
echo   🎉 Git Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create GitHub repository at: https://github.com/new
echo 2. Repository name: luis-gilberto-portfolio
echo 3. Set to Public
echo 4. Don't initialize with README
echo 5. Run these commands (replace YOUR_USERNAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/luis-gilberto-portfolio.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 6. Then follow DEPLOYMENT_GUIDE.md for Cloudflare Pages setup
echo.
pause