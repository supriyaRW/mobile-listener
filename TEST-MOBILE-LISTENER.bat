@echo off
echo ========================================
echo Testing Mobile Listener Setup
echo ========================================
echo.

echo Step 1: Checking if server is running...
netstat -an | findstr :3000 >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Server is running on port 3000
) else (
    echo ✗ Server is NOT running
    echo.
    echo Please start server:
    echo   npm run dev:network
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Checking server network access...
netstat -an | findstr "0.0.0.0:3000" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Server is accessible from network
) else (
    echo ⚠ Server might not be accessible from network
    echo.
    echo Make sure you started with: npm run dev:network
)

echo.
echo Step 3: Testing server endpoints...
echo.
echo Testing homepage...
curl -s -o nul -w "Homepage: %%{http_code}\n" http://192.168.1.210:3000

echo Testing mobile-listener...
curl -s -o nul -w "Mobile Listener: %%{http_code}\n" http://192.168.1.210:3000/mobile-listener

echo Testing API endpoint...
curl -s -o nul -w "Open App API: %%{http_code}\n" http://192.168.1.210:3000/api/open-app

echo.
echo ========================================
echo Test Complete
echo ========================================
echo.
echo Next steps:
echo 1. Open http://192.168.1.210:3000/mobile-listener on your phone
echo 2. Make sure phone is on same WiFi network
echo 3. Click "Open App" button on desktop
echo.
pause
