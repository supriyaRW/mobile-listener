# Ngrok Setup for QR Code

## Problem
When using ngrok, you need to update the QR code to use the ngrok URL instead of localhost.

## Solution

### Step 1: Start Ngrok

In PowerShell, run:
```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
ngrok http 3000
```

**Note:** If ngrok command doesn't work:
1. Make sure ngrok is installed: Download from https://ngrok.com/download
2. Add ngrok to PATH or use full path
3. Or use: `npx ngrok http 3000` (if you have npm)

### Step 2: Get Ngrok URL

After starting ngrok, you'll see output like:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### Step 3: Update .env File

Edit `frontend/.env`:
```env
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok-free.app
```

Replace `abc123.ngrok-free.app` with your actual ngrok URL.

### Step 4: Restart Next.js Server

Stop your Next.js server (Ctrl+C) and restart:
```powershell
npm run dev
```

### Step 5: Test QR Code

1. Open your app via ngrok URL: `https://abc123.ngrok-free.app`
2. Click "Scan with App"
3. QR code will now contain: `https://abc123.ngrok-free.app/download`
4. Scan with mobile device - works from anywhere! ✅

## Troubleshooting

### Ngrok Not Starting

**Check 1: Is ngrok installed?**
```powershell
ngrok version
```

**Check 2: Is port 3000 already in use?**
```powershell
netstat -ano | findstr :3000
```

**Check 3: Try with npx (if npm available)**
```powershell
npx ngrok http 3000
```

### Ngrok Shows "Session Expired"

- Free ngrok accounts have session limits
- Restart ngrok to get a new URL
- Update `.env` with new URL
- Restart Next.js server

### QR Code Still Shows Localhost

1. Make sure `.env` has `NEXT_PUBLIC_BASE_URL` set to ngrok URL
2. Restart Next.js server after changing `.env`
3. Clear browser cache
4. Access page via ngrok URL (not localhost)

## Alternative: Use Network IP (No Ngrok Needed)

If you don't want to use ngrok:

1. Find your network IP: `ipconfig`
2. Access via: `http://192.168.1.100:3000` (your IP)
3. QR code will automatically use network IP
4. Works on same WiFi network

## Benefits of Ngrok

✅ Works from anywhere (not just same network)  
✅ HTTPS support  
✅ Public URL for testing  
✅ No firewall configuration needed  

## Quick Start Commands

```powershell
# Terminal 1: Start Next.js
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev

# Terminal 2: Start Ngrok
ngrok http 3000

# Then update .env with ngrok URL and restart Next.js
```
