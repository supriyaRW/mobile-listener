# Fix: "This site can't be reached" Error

## ⚠️ CRITICAL: You Must Follow These Steps Exactly

### Step 1: Stop Current Server
Press `Ctrl+C` in the terminal where the server is running to stop it.

### Step 2: Start Server with Network Access

**Open PowerShell and run:**

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev:network
```

**OR if that doesn't work:**

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev -- --hostname 0.0.0.0
```

**You MUST see this output:**
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.210:3000  ← THIS LINE IS CRITICAL!
```

**If you DON'T see the "Network" line, the server won't be accessible from your phone!**

### Step 3: Verify Your Actual IP Address

**Open a NEW PowerShell window and run:**

```powershell
ipconfig
```

**Look for "IPv4 Address"** - it might NOT be `192.168.1.210`

**Example output:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.105  ← YOUR ACTUAL IP
```

### Step 4: Update .env File

**If your IP is different from 192.168.1.210, update `.env`:**

1. Open: `exp_date\frontend\.env`
2. Change this line:
   ```env
   NEXT_PUBLIC_BASE_URL=http://192.168.1.210:3000
   ```
   To your actual IP:
   ```env
   NEXT_PUBLIC_BASE_URL=http://192.168.1.105:3000
   ```
   (Replace `192.168.1.105` with YOUR actual IP from Step 3)

3. **SAVE the file**

### Step 5: Restart Server

**Go back to the server terminal:**
1. Press `Ctrl+C` to stop
2. Run again: `npm run dev:network`
3. Verify you see the "Network" line with your correct IP

### Step 6: Test on Your Computer First

**Open browser on your computer:**
- Try: `http://192.168.1.210:3000` (or your actual IP)
- Should show your homepage ✅
- If this doesn't work, the phone won't work either!

### Step 7: Test on Mobile Device

**On your phone browser:**
1. Make sure phone is on **SAME WiFi network** as computer
2. Open: `http://192.168.1.210:3000` (or your actual IP)
3. Should show homepage ✅

**If this works, the QR code will work!**

### Step 8: Check Firewall (If Still Not Working)

**Windows Firewall:**
1. Open "Windows Defender Firewall"
2. Click "Allow an app or feature through Windows Firewall"
3. Click "Change Settings" (if needed)
4. Find "Node.js" or click "Allow another app"
5. Browse to: `C:\Program Files\nodejs\node.exe`
6. Check both "Private" and "Public"
7. Click OK

**OR temporarily disable firewall to test:**
- If it works with firewall off, then firewall is the issue
- Re-enable firewall and add Node.js exception

## Common Mistakes

❌ **Starting server with just `npm run dev`**  
✅ **Must use `npm run dev:network` or `npm run dev -- --hostname 0.0.0.0`**

❌ **Using localhost in browser**  
✅ **Must use network IP: `http://192.168.1.210:3000`**

❌ **Not restarting server after changing .env**  
✅ **Must restart server after any .env changes**

❌ **Phone on different WiFi network**  
✅ **Phone and computer must be on SAME WiFi**

❌ **Wrong IP address in .env**  
✅ **Use actual IP from `ipconfig` command**

## Quick Checklist

- [ ] Server running with `npm run dev:network`
- [ ] Server shows "Network: http://X.X.X.X:3000" line
- [ ] `.env` file has correct IP address
- [ ] Server restarted after .env changes
- [ ] Can access `http://YOUR_IP:3000` from computer browser
- [ ] Phone on same WiFi network
- [ ] Can access `http://YOUR_IP:3000` from phone browser
- [ ] Firewall allows Node.js

## Still Not Working?

**Try ngrok (works even if network doesn't):**

```powershell
# Install ngrok (if not installed)
# Download from: https://ngrok.com/download

# In one terminal, start your server:
npm run dev

# In another terminal, start ngrok:
ngrok http 3000

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Update .env:
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io

# Restart server
```

This will work even if your network has issues!
