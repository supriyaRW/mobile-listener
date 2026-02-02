@echo off
echo ========================================
echo Final Push to GitHub
echo ========================================
echo Repository: https://github.com/supriyaRW/mobile-listener
echo.

cd /d "%~dp0"

echo ✅ All linting errors fixed!
echo.

echo Pushing to GitHub...
echo.
echo When prompted:
echo   Username: supriyaRW
echo   Password: Use Personal Access Token
echo.
echo Get token: https://github.com/settings/tokens
echo.
pause

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo View your code at:
    echo https://github.com/supriyaRW/mobile-listener
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ Push failed
    echo ========================================
    echo.
    echo See PUSH-NOW.md for troubleshooting
)

pause
