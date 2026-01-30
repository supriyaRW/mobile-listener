@echo off
echo ========================================
echo Quick Push to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Pushing to: https://github.com/supriyaRW/mobile-listener
echo.
echo When prompted:
echo   Username: supriyaRW
echo   Password: Use Personal Access Token (not GitHub password!)
echo.
echo To get token: https://github.com/settings/tokens
echo.
pause

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Code pushed successfully!
    echo.
    echo View at: https://github.com/supriyaRW/mobile-listener
) else (
    echo.
    echo ❌ Push failed!
    echo.
    echo See PUSH-NOW.md for troubleshooting
)

pause
