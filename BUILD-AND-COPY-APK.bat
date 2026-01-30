@echo off
echo ========================================
echo Building and Copying APK
echo ========================================
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0

REM Navigate to Flutter project
cd /d "%SCRIPT_DIR%..\..\exp_date_mob\exp_date"

echo Current directory: %CD%
echo.

echo Step 1: Building Flutter APK (Release)...
echo This may take a few minutes...
echo.
flutter build apk --release

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Build failed! Check errors above.
    echo.
    echo Troubleshooting:
    echo   1. Make sure Flutter is installed: flutter doctor
    echo   2. Make sure you're in the Flutter project directory
    echo   3. Try: flutter clean && flutter pub get
    pause
    exit /b 1
)

echo.
echo ✅ APK built successfully!
echo.

REM Check if APK exists
set APK_SOURCE=%CD%\build\app\outputs\flutter-apk\app-release.apk
if not exist "%APK_SOURCE%" (
    echo ❌ APK not found at: %APK_SOURCE%
    echo.
    echo Checking for alternative locations...
    dir /s /b build\app\outputs\flutter-apk\*.apk
    pause
    exit /b 1
)

echo Found APK at: %APK_SOURCE%
echo.

echo Step 2: Copying APK to frontend public folder...
echo.

REM Frontend public folder (relative to frontend folder)
set FRONTEND_PUBLIC=%SCRIPT_DIR%public

REM Create public folder if it doesn't exist
if not exist "%FRONTEND_PUBLIC%" (
    echo Creating public folder...
    mkdir "%FRONTEND_PUBLIC%"
)

REM Copy APK
echo Copying from: %APK_SOURCE%
echo Copying to: %FRONTEND_PUBLIC%\app-release.apk
echo.
copy /Y "%APK_SOURCE%" "%FRONTEND_PUBLIC%\app-release.apk"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ APK copied successfully!
    echo.
    echo 📱 APK location: %FRONTEND_PUBLIC%\app-release.apk
    echo 🌐 Available at: http://192.168.1.210:3000/api/apk
    echo.
    echo ✅ You can now scan the QR code!
    echo.
    echo Note: If your Next.js server is running, you may need to restart it.
) else (
    echo.
    echo ❌ Failed to copy APK!
    echo.
    echo Source: %APK_SOURCE%
    echo Destination: %FRONTEND_PUBLIC%\app-release.apk
    pause
    exit /b 1
)

pause
