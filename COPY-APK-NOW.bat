@echo off
echo ========================================
echo Copying APK to Public Folder
echo ========================================
echo.

set "SOURCE=C:\Users\DereddySupriya\Desktop\New folder\exp_date_mob\exp_date\build\app\outputs\flutter-apk\app-release.apk"
set "DEST=C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend\public\app-release.apk"

echo Checking if source APK exists...
if not exist "%SOURCE%" (
    echo.
    echo ❌ APK not found at: %SOURCE%
    echo.
    echo Please build the APK first:
    echo   1. Open PowerShell
    echo   2. Run: cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date_mob\exp_date"
    echo   3. Run: flutter build apk --release
    echo.
    pause
    exit /b 1
)

echo ✅ Found APK at: %SOURCE%
echo.

echo Creating public folder if it doesn't exist...
if not exist "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend\public" (
    mkdir "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend\public"
)

echo Copying APK...
copy /Y "%SOURCE%" "%DEST%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ APK copied successfully!
    echo.
    echo 📱 Location: %DEST%
    echo 🌐 Available at: http://192.168.1.210:3000/api/apk
    echo.
    echo ✅ You can now scan the QR code!
    echo.
    echo Note: Restart your Next.js server if it's running.
) else (
    echo.
    echo ❌ Failed to copy APK!
    echo.
    echo Source: %SOURCE%
    echo Destination: %DEST%
)

pause
