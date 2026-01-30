# Fix: Phone Can't Access Server

## Problem
Phone browser shows "This site can't be reached" when accessing `http://192.168.1.210:3000`

## Step-by-Step Fix

### Step 1: Verify Server is Running with Network Access

**CRITICAL: Server MUST be started with network access!**

**Stop current server** (if running):
- Press `Ctrl+C` in terminal

**Start server correctly:**
```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev:network
```

**You MUST see this output:**
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.210:3000  ← MUST SEE THIS LINE!
```

**If you DON'T see the "Network" line, the server is NOT accessible from your phone!**

### Step 2: Verify IP Address

**Check your actual IP:**
```powershell
ipconfig
```

**Look for:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.XXX
```

**If it's NOT 192.168.1.210:**
1. Update `.env` file with correct IP
2. Restart server

### Step 3: Test on Computer First

**Before testing on phone, test on your computer:**

1. Open browser on computer
2. Go to: `http://192.168.1.210:3000`
   - Should show homepage ✅
   - If this doesn't work, phone won't work either!

### Step 4: Check Windows Firewall

**Windows Firewall is likely blocking connections!**

**Quick Fix (PowerShell as Administrator):**
```powershell
netsh advfirewall firewall add rule name="Node.js Server Port 3000" dir=in action=allow protocol=TCP localport=3000
```

**Or manually:**
1. Press `Win + R`
2. Type: `firewall.cpl` and press Enter
3. Click "Allow an app or feature through Windows Firewall"
4. Click "Change Settings" (if needed)
5. Click "Allow another app..."
6. Browse to: `C:\Program Files\nodejs\node.exe`
   - If not found, browse to where Node.js is installed
7. Click "Add"
8. Check both "Private" and "Public" checkboxes
9. Click OK

**OR temporarily disable firewall to test:**
- If it works with firewall off, then firewall is the issue
- Re-enable firewall and add Node.js exception

### Step 5: Verify Same WiFi Network

**CRITICAL: Both devices must be on SAME WiFi!**

**Check on computer:**
- WiFi network name: _______________

**Check on phone:**
- WiFi network name: _______________

**They MUST match!**

**Common mistakes:**
- ❌ Phone on mobile data (not WiFi)
- ❌ Phone on different WiFi network
- ❌ Phone on guest WiFi network
- ❌ Computer on Ethernet, phone on WiFi (might work, but verify)

### Step 6: Test Network Connectivity

**On your phone, try these tests:**

1. **Ping test** (if you have a network tool):
   - Ping: `192.168.1.210`
   - Should get responses

2. **Try different browser:**
   - Chrome
   - Firefox
   - Samsung Internet

3. **Try incognito/private mode:**
   - Sometimes cache causes issues

### Step 7: Check Router Settings

**Some routers block device-to-device communication:**

1. Check router admin panel
2. Look for "AP Isolation" or "Client Isolation"
3. **Disable** if enabled
4. Save and restart router if needed

### Step 8: Alternative - Use ngrok

**If network still doesn't work, use ngrok:**

1. **Install ngrok:**
   - Download: https://ngrok.com/download
   - Extract to a folder

2. **Start your server:**
   ```powershell
   npm run dev
   ```

3. **Start ngrok (in another terminal):**
   ```powershell
   ngrok http 3000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Update `.env` file:**
   ```
   NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
   ```

6. **Restart server**

7. **Use ngrok URL on phone:**
   - `https://abc123.ngrok.io`
   - `https://abc123.ngrok.io/mobile-listener`

**This works even if your network has issues!**

## Quick Diagnostic Commands

**Check if port 3000 is listening:**
```powershell
netstat -an | findstr :3000
```

**Should see:**
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING
```

**If you see `127.0.0.1:3000` instead, server is NOT accessible from network!**

**Test server response:**
```powershell
curl http://192.168.1.210:3000
```

**Should return HTML content, not an error.**

## Most Common Issues

### Issue 1: Server not started with network access
**Solution:** Use `npm run dev:network` (not just `npm run dev`)

### Issue 2: Firewall blocking
**Solution:** Allow Node.js through Windows Firewall

### Issue 3: Different WiFi networks
**Solution:** Ensure both devices on same WiFi network

### Issue 4: Router AP isolation
**Solution:** Disable AP isolation in router settings

## Success Checklist

- [ ] Server running with `npm run dev:network`
- [ ] Server shows "Network: http://192.168.1.210:3000"
- [ ] `netstat` shows `0.0.0.0:3000` (not `127.0.0.1:3000`)
- [ ] Can access `http://192.168.1.210:3000` from computer browser
- [ ] Firewall allows Node.js/port 3000
- [ ] Phone on same WiFi network as computer
- [ ] Router AP isolation disabled (if applicable)
- [ ] Can access `http://192.168.1.210:3000` from phone browser ✅

## Still Not Working?

**Try ngrok** - it bypasses all network issues and works from anywhere!

1. Install ngrok
2. Run: `ngrok http 3000`
3. Use the ngrok URL on your phone
4. Works even if network has issues!
