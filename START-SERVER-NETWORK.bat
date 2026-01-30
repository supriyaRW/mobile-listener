@echo off
echo ========================================
echo Starting Next.js Server for Network Access
echo ========================================
echo.
echo This will start the server accessible from your phone
echo.
echo CRITICAL: You must see "Network: http://192.168.1.210:3000" in output!
echo.
echo Make sure:
echo   1. Your IP address matches .env file
echo   2. Phone and computer are on same WiFi
echo   3. Firewall allows Node.js
echo.
pause

cd /d "%~dp0"

echo.
echo Starting server with network access...
echo.
npm run dev:network

echo.
echo ========================================
echo Server stopped
echo ========================================
pause
