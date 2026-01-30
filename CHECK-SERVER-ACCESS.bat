@echo off
echo ========================================
echo Server Access Diagnostic Tool
echo ========================================
echo.

echo Step 1: Checking if server is running...
netstat -an | findstr ":3000" | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Server is running on port 3000
    echo.
    echo Checking network accessibility...
    netstat -an | findstr "0.0.0.0:3000" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Server is accessible from network (0.0.0.0:3000)
    ) else (
        echo ✗ Server is ONLY accessible locally (127.0.0.1:3000)
        echo.
        echo ⚠ CRITICAL: Server must be started with network access!
        echo.
        echo Solution:
        echo   1. Stop current server (Ctrl+C)
        echo   2. Run: npm run dev:network
        echo   3. Verify you see "Network: http://192.168.1.210:3000"
        echo.
        pause
        exit /b 1
    )
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
echo Step 2: Testing server endpoints...
echo.

echo Testing homepage...
curl -s -o nul -w "   Status: %%{http_code}\n" http://192.168.1.210:3000 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   ✓ Homepage accessible
) else (
    echo   ✗ Homepage NOT accessible
)

echo.
echo Testing mobile-listener...
curl -s -o nul -w "   Status: %%{http_code}\n" http://192.168.1.210:3000/mobile-listener 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   ✓ Mobile listener accessible
) else (
    echo   ✗ Mobile listener NOT accessible
)

echo.
echo Step 3: Checking firewall...
echo.
netsh advfirewall firewall show rule name=all | findstr "3000" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Firewall rules found for port 3000
) else (
    echo ⚠ No firewall rules found for port 3000
    echo.
    echo You may need to allow Node.js through firewall
)

echo.
echo Step 4: Network IP check...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo Your IP address: !IP!
)

echo.
echo ========================================
echo Diagnostic Complete
echo ========================================
echo.
echo Next steps for phone access:
echo.
echo 1. Make sure server shows "Network: http://192.168.1.210:3000"
echo 2. Verify phone is on SAME WiFi network
echo 3. Try accessing http://192.168.1.210:3000 on phone browser
echo 4. If still not working, check firewall settings
echo.
pause
