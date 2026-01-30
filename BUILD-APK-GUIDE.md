# Build and Copy APK - Quick Guide

## The Problem
You're seeing: `{"error":"APK not found"}`

This means the APK file doesn't exist in `exp_date/frontend/public/app-release.apk`

## Quick Fix: Build and Copy APK

### Option 1: Use the Batch Script (Easiest)

**Double-click this file:**
```
exp_date\frontend\BUILD-AND-COPY-APK.bat
```

This will:
1. Build the Flutter APK
2. Copy it to the frontend public folder
3. Make it available for download

---

### Option 2: Manual Steps

#### Step 1: Build the APK

**Open PowerShell and run:**

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date_mob\exp_date"
flutter build apk --release
```

**Wait for build to complete** - you should see:
```
✓ Built build\app\outputs\flutter-apk\app-release.apk
```

#### Step 2: Copy APK to Frontend Public Folder

**Run this command:**

```powershell
copy "C:\Users\DereddySupriya\Desktop\New folder\exp_date_mob\exp_date\build\app\outputs\flutter-apk\app-release.apk" "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend\public\app-release.apk"
```

**OR manually:**
1. Navigate to: `exp_date_mob\exp_date\build\app\outputs\flutter-apk\`
2. Copy `app-release.apk`
3. Paste into: `exp_date\frontend\public\`
4. Make sure it's named exactly: `app-release.apk`

#### Step 3: Verify APK Exists

**Check that file exists:**
```
exp_date\frontend\public\app-release.apk
```

**Test the API endpoint:**
- Open browser: `http://192.168.1.210:3000/api/apk`
- Should download the APK file ✅

---

## Verify It Works

### Test 1: Check File Exists
```powershell
Test-Path "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend\public\app-release.apk"
```
Should return: `True`

### Test 2: Test API Endpoint
Open browser: `http://192.168.1.210:3000/api/apk`
- Should download APK file ✅
- Should NOT show error message ✅

### Test 3: Test Scan Page
Open browser: `http://192.168.1.210:3000/scan`
- Should try to open app
- If app not installed, should download APK ✅

---

## File Locations

**APK Source (after build):**
```
exp_date_mob\exp_date\build\app\outputs\flutter-apk\app-release.apk
```

**APK Destination (for frontend):**
```
exp_date\frontend\public\app-release.apk
```

**API Endpoint:**
```
http://192.168.1.210:3000/api/apk
```

---

## Troubleshooting

### Error: "flutter: command not found"

**Solution:** Make sure Flutter is installed and in PATH
```powershell
flutter doctor
```

### Error: Build fails

**Solution:** Check Flutter setup
```powershell
cd exp_date_mob\exp_date
flutter clean
flutter pub get
flutter build apk --release
```

### Error: Copy fails

**Solution:** Make sure public folder exists
```powershell
New-Item -ItemType Directory -Force -Path "exp_date\frontend\public"
```

### Error: APK still not found after copying

**Solution:**
1. Verify file exists: Check `exp_date\frontend\public\app-release.apk`
2. Restart Next.js server after copying
3. Check file name matches exactly: `app-release.apk` (case-sensitive)

---

## Quick Commands

**Build APK:**
```powershell
cd exp_date_mob\exp_date
flutter build apk --release
```

**Copy APK:**
```powershell
copy "exp_date_mob\exp_date\build\app\outputs\flutter-apk\app-release.apk" "exp_date\frontend\public\app-release.apk"
```

**Or use the batch script:**
```
Double-click: BUILD-AND-COPY-APK.bat
```

---

## After Building

Once the APK is in place:
1. ✅ Server can serve it at `/api/apk`
2. ✅ Scan page can download it if app not installed
3. ✅ QR code will work!

**Test it:**
- Scan QR code → App opens (if installed) OR APK downloads (if not installed) ✅
