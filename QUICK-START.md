# Quick Start Guide - QR Code with Ngrok

## Option 1: Using Ngrok (Recommended for Testing)

### Step 1: Start Ngrok

Open PowerShell and run:
```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
ngrok http 3000
```

**If ngrok doesn't start:**
- Make sure it's installed: https://ngrok.com/download
- Or use: `npx ngrok http 3000`

### Step 2: Copy Ngrok URL

You'll see output like:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

Copy the HTTPS URL.

### Step 3: Update .env

Edit `frontend/.env` and set:
```env
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok-free.app
```

### Step 4: Start Next.js

In a new terminal:
```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev
```

### Step 5: Access via Ngrok

Open browser: `https://abc123.ngrok-free.app`
- QR code will use ngrok URL ✅
- Works from anywhere ✅

---

## Option 2: Using Network IP (No Ngrok)

### Step 1: Find Your IP

```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

### Step 2: Start Next.js on All Interfaces

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev -- -H 0.0.0.0
```

### Step 3: Access via Network IP

Open browser: `http://192.168.1.100:3000` (your IP)
- QR code will automatically use network IP ✅
- Works on same WiFi network ✅

### Step 4: Keep .env Empty

Make sure `.env` has:
```env
NEXT_PUBLIC_BASE_URL=
```

---

## Troubleshooting Ngrok

### "ngrok: command not found"

**Solution 1:** Install ngrok
- Download: https://ngrok.com/download
- Extract and add to PATH

**Solution 2:** Use npx
```powershell
npx ngrok http 3000
```

### Ngrok Starts But No Output

**Check:** Open http://localhost:4040 in browser
- Ngrok web interface shows the URL

### Port 3000 Already in Use

**Solution:** Stop other services or use different port
```powershell
ngrok http 3001
# Then update Next.js to use port 3001
```

---

## Which Option to Use?

**Use Ngrok if:**
- ✅ Testing from different networks
- ✅ Need HTTPS
- ✅ Want public URL
- ✅ Don't want to configure firewall

**Use Network IP if:**
- ✅ Testing on same WiFi network
- ✅ Don't want external dependencies
- ✅ Faster setup
- ✅ No account needed

---

## Current Setup Check

1. **Check .env file:**
   ```powershell
   Get-Content .env
   ```

2. **If NEXT_PUBLIC_BASE_URL is empty:**
   - Use Network IP method ✅
   - Access via network IP

3. **If NEXT_PUBLIC_BASE_URL has URL:**
   - Use that URL to access
   - QR code will use that URL

---

## Quick Commands

```powershell
# Check if ngrok is installed
ngrok version

# Start ngrok
ngrok http 3000

# Check ngrok status (in browser)
# Open: http://localhost:4040

# Start Next.js
npm run dev

# Start Next.js on all interfaces (for network IP)
npm run dev -- -H 0.0.0.0
```
