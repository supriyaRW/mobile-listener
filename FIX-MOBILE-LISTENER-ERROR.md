# Fix: "Site Can't Be Reached" Error for Mobile Listener

## The Problem

When trying to access `http://192.168.1.210:3000/mobile-listener` on your phone, you get "This site can't be reached" error.

## Quick Fix Steps

### Step 1: Verify Server is Running

**On your computer, check if server is running:**

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev:network
```

**You MUST see this output:**
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.210:3000  ← THIS LINE IS CRITICAL!
```

**If you DON'T see the "Network" line, the server won't be accessible from your phone!**

### Step 2: Test Server Accessibility

**On your computer browser, try:**
- `http://192.168.1.210:3000` → Should show homepage ✅
- `http://192.168.1.210:3000/mobile-listener` → Should show mobile listener page ✅

**If these don't work on your computer, they won't work on your phone either!**

### Step 3: Test on Phone

**On your Android phone browser:**
1. Make sure phone is on **SAME WiFi network** as computer
2. Try: `http://192.168.1.210:3000`
   - Should show homepage ✅
3. Try: `http://192.168.1.210:3000/mobile-listener`
   - Should show mobile listener page ✅

### Step 4: Check Firewall

**Windows Firewall might be blocking:**

1. Open PowerShell as Administrator
2. Run:
```powershell
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
```

**OR manually:**
1. Press `Win + R`, type `firewall.cpl`, press Enter
2. Click "Allow an app or feature through Windows Firewall"
3. Click "Change Settings"
4. Find "Node.js" or click "Allow another app..."
5. Browse to: `C:\Program Files\nodejs\node.exe`
6. Check both "Private" and "Public"
7. Click OK

### Step 5: Verify IP Address

**Make sure IP is correct:**

```powershell
ipconfig
```

Look for "IPv4 Address" - should be `192.168.1.210`

**If different, update `.env` file:**
```
NEXT_PUBLIC_BASE_URL=http://YOUR_ACTUAL_IP:3000
```

Then restart server.

## Common Issues

### Issue: Server only shows "Local" address

**Solution:**
```powershell
npm run dev:network
```

Must use `--hostname 0.0.0.0` flag!

### Issue: Can access homepage but not mobile-listener

**Solution:**
1. Restart server
2. Clear browser cache on phone
3. Try incognito/private mode

### Issue: Works on computer but not phone

**Possible causes:**
1. Different WiFi networks
2. Firewall blocking
3. Router AP isolation

**Solutions:**
- Verify same WiFi network
- Check firewall settings
- Try disabling firewall temporarily to test

### Issue: "Network" line not showing

**Solution:**
```powershell
npm run dev:network
```

Or:
```powershell
npm run dev -- --hostname 0.0.0.0
```

## Step-by-Step Test

1. ✅ Server running: `npm run dev:network`
2. ✅ Server shows "Network: http://192.168.1.210:3000"
3. ✅ Can access `http://192.168.1.210:3000` from computer
4. ✅ Phone on same WiFi network
5. ✅ Can access `http://192.168.1.210:3000` from phone
6. ✅ Can access `http://192.168.1.210:3000/mobile-listener` from phone

## Alternative: Use Direct IP

If `192.168.1.210` doesn't work, try:

1. Find your actual IP: `ipconfig`
2. Use that IP instead: `http://YOUR_IP:3000/mobile-listener`
3. Update `.env` with correct IP
4. Restart server

## Still Not Working?

**Try ngrok (bypasses network issues):**

1. Install ngrok: https://ngrok.com/download
2. Start server: `npm run dev`
3. Start ngrok: `ngrok http 3000`
4. Copy ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Update `.env`: `NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io`
6. Restart server
7. Use ngrok URL on phone: `https://abc123.ngrok.io/mobile-listener`

This works even if your network has issues!
