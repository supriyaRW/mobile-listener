@echo off
echo ========================================
echo Push Code to GitHub
echo ========================================
echo Repository: https://github.com/supriyaRW/mobile-listener
echo.

cd /d "%~dp0"

echo Step 1: Initializing git repository...
if not exist .git (
    git init
    echo ✓ Git initialized
) else (
    echo ✓ Git already initialized
)

echo.
echo Step 2: Creating README.md...
(
echo # Mobile Listener - Desktop to Mobile App Opener
echo.
echo This project enables opening Flutter app on mobile device from desktop web app.
echo.
echo ## Features
echo.
echo - Click "Open App" button on desktop to open app on mobile
echo - QR code scanning to download/install APK
echo - Android App Links support
echo - Real-time communication between desktop and mobile
echo.
echo ## Setup
echo.
echo 1. Install dependencies: `npm install`
echo 2. Create `.env` file with your configuration
echo 3. Start server: `npm run dev:network`
echo 4. Open mobile listener: `http://YOUR_IP:3000/mobile-listener`
echo.
) > README.md
echo ✓ README.md created

echo.
echo Step 3: Adding all files...
git add .

echo.
echo Step 4: Committing changes...
git commit -m "Initial commit: Mobile listener with desktop-to-mobile app opening"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠ No changes to commit or commit failed
    echo Continuing anyway...
)

echo.
echo Step 5: Setting up remote repository...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/supriyaRW/mobile-listener.git
echo ✓ Remote added

echo.
echo Step 6: Setting branch to main...
git branch -M main
echo ✓ Branch set to main

echo.
echo Step 7: Pushing to GitHub...
echo.
echo ⚠ You may be prompted for GitHub credentials
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ Code pushed successfully!
    echo ========================================
    echo.
    echo Repository: https://github.com/supriyaRW/mobile-listener
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ Push failed!
    echo ========================================
    echo.
    echo Possible issues:
    echo   1. Repository doesn't exist on GitHub
    echo   2. Authentication required (use Personal Access Token)
    echo   3. Network issues
    echo.
    echo Solutions:
    echo   1. Create repository at: https://github.com/supriyaRW/mobile-listener
    echo   2. Use GitHub Personal Access Token as password
    echo   3. Or use: gh auth login (if GitHub CLI installed)
    echo.
)

pause
