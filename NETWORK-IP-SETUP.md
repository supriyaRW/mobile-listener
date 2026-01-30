# Network IP Setup - 192.168.1.210

## Configuration Complete ✅

Your `.env` file has been configured to use your network IP: **192.168.1.210**

## How to Use

### Step 1: Start Next.js Server

Make sure your server is accessible on all interfaces:

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev -- -H 0.0.0.0
```

**Or** if your server is already running, restart it after updating `.env`.

### Step 2: Access via Network IP

Open your browser and go to:
```
http://192.168.1.210:3000
```

**Important:** Don't use `localhost:3000` - use the network IP instead!

### Step 3: Test QR Code

1. Click "Scan with App" button
2. QR code will contain: `http://192.168.1.210:3000/download` ✅
3. Scan with your Android phone (must be on same WiFi network)
4. APK will download automatically!

## Requirements

✅ Phone and computer must be on **same WiFi network**  
✅ Firewall must allow port 3000  
✅ Server must be accessible on network IP  

## Troubleshooting

### Can't Access via Network IP

**Check 1: Is server running on all interfaces?**
```powershell
npm run dev -- -H 0.0.0.0
```

**Check 2: Is firewall blocking port 3000?**
- Windows Firewall might block incoming connections
- Allow Node.js through firewall or add rule for port 3000

**Check 3: Are devices on same network?**
- Phone and computer must be on same WiFi
- Check WiFi network name matches

### QR Code Still Shows Localhost

1. Make sure you accessed page via `http://192.168.1.210:3000` (not localhost)
2. Clear browser cache
3. Restart Next.js server after changing `.env`

### Phone Can't Download APK

1. Check phone can access: `http://192.168.1.210:3000` in phone browser
2. If that works, QR code should work too
3. Make sure APK file exists in `frontend/public/app-release.apk`

## Current Configuration

- **Network IP**: 192.168.1.210
- **Port**: 3000
- **QR Code URL**: http://192.168.1.210:3000/download
- **APK Download URL**: http://192.168.1.210:3000/api/apk

## Quick Test

1. Start server: `npm run dev -- -H 0.0.0.0`
2. Open: `http://192.168.1.210:3000`
3. Click "Scan with App"
4. Scan QR code with phone
5. APK downloads! ✅

Your setup is ready! 🎉
