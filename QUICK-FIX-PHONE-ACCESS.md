# Quick Fix: Phone Can't Access Server

## ⚠️ CRITICAL: Follow These Steps Exactly

### Step 1: Stop Current Server

**In the terminal where server is running:**
- Press `Ctrl+C` to stop

### Step 2: Start Server with Network Access

**Double-click this file:**
```
START-SERVER-NETWORK.bat
```

**OR run in PowerShell:**
```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev:network
```

**⚠️ YOU MUST SEE THIS OUTPUT:**
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.210:3000  ← THIS LINE IS CRITICAL!
```

**If you DON'T see the "Network" line, the server is NOT accessible from your phone!**

### Step 3: Fix Windows Firewall

**Windows Firewall is likely blocking!**

**Quick Fix (PowerShell as Administrator):**
```powershell
netsh advfirewall firewall add rule name="Node.js Server Port 3000" dir=in action=allow protocol=TCP localport=3000
```

**Or manually:**
1. Press `Win + R`
2. Type: `firewall.cpl` and press Enter
3. Click "Allow an app or feature through Windows Firewall"
4. Click "Change Settings"
5. Click "Allow another app..."
6. Browse to: `C:\Program Files\nodejs\node.exe`
7. Click "Add"
8. Check both "Private" and "Public"
9. Click OK

### Step 4: Verify Same WiFi Network

**CRITICAL: Both devices must be on SAME WiFi!**

**On your computer:**
- WiFi name: _______________

**On your phone:**
- WiFi name: _______________

**They MUST match!**

**Common mistakes:**
- ❌ Phone on mobile data instead of WiFi
- ❌ Phone on different WiFi network
- ❌ Phone on guest network

### Step 5: Test on Computer First

**Before testing on phone:**

1. Open browser on your computer
2. Go to: `http://192.168.1.210:3000`
   - Should show homepage ✅
   - **If this doesn't work, phone won't work either!**

### Step 6: Test on Phone

**On your Android phone:**

1. Make sure phone is on **SAME WiFi** as computer
2. Open phone browser
3. Type: `http://192.168.1.210:3000`
4. Should show homepage ✅

## Quick Diagnostic

**Run this to check everything:**
```
Double-click: CHECK-SERVER-ACCESS.bat
```

This will tell you exactly what's wrong!

## Most Common Issue

**Server not started with network access!**

**Fix:**
1. Stop server (Ctrl+C)
2. Run: `npm run dev:network`
3. Verify you see "Network: http://192.168.1.210:3000"

## Alternative: Use ngrok (Bypasses Network Issues)

**If network still doesn't work:**

1. **Download ngrok:** https://ngrok.com/download
2. **Start server:** `npm run dev`
3. **Start ngrok:** `ngrok http 3000`
4. **Copy ngrok URL** (e.g., `https://abc123.ngrok.io`)
5. **Update `.env`:** `NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io`
6. **Restart server**
7. **Use ngrok URL on phone**

**This works even if your network has issues!**

## Checklist

- [ ] Server stopped
- [ ] Server started with `npm run dev:network`
- [ ] Server shows "Network: http://192.168.1.210:3000"
- [ ] Firewall allows Node.js/port 3000
- [ ] Phone on same WiFi network
- [ ] Can access `http://192.168.1.210:3000` from computer
- [ ] Can access `http://192.168.1.210:3000` from phone ✅
