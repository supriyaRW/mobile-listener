@echo off
echo ========================================
echo Complete Git Push to GitHub
echo ========================================
echo Repository: https://github.com/supriyaRW/mobile-listener
echo.

cd /d "%~dp0"

echo Step 1: Adding all files...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Initial commit: Mobile listener with desktop-to-mobile app opening"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠ Commit failed or no changes to commit
    echo This is okay if files are already committed
)

echo.
echo Step 3: Setting up remote...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/supriyaRW/mobile-listener.git
echo ✓ Remote configured

echo.
echo Step 4: Setting branch to main...
git branch -M main
echo ✓ Branch set to main

echo.
echo Step 5: Pushing to GitHub...
echo.
echo ⚠ You will be prompted for GitHub credentials
echo   - Username: supriyaRW
echo   - Password: Use Personal Access Token (not your GitHub password)
echo.
echo To get Personal Access Token:
echo   1. Go to: https://github.com/settings/tokens
echo   2. Generate new token with 'repo' permissions
echo   3. Use token as password
echo.
pause

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo Repository: https://github.com/supriyaRW/mobile-listener
    echo.
    echo You can now view your code on GitHub!
) else (
    echo.
    echo ========================================
    echo ❌ Push failed
    echo ========================================
    echo.
    echo Common issues:
    echo   1. Repository doesn't exist - Create it first on GitHub
    echo   2. Authentication failed - Use Personal Access Token
    echo   3. Network error - Check internet connection
    echo.
    echo Try again or see GITHUB-PUSH-GUIDE.md for help
)

pause
