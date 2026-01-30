# Step-by-Step Fix for Network Error

## 🚨 The Problem
Your phone shows: **"This site can't be reached"** when scanning QR code

## ✅ The Solution (Follow Exactly)

### STEP 1: Find Your Real IP Address

**Open PowerShell and type:**
```powershell
ipconfig
```

**Look for this line:**
```
IPv4 Address. . . . . . . . . . . : 192.168.1.XXX
```

**Write down this number!** (It might NOT be 192.168.1.210)

---

### STEP 2: Update .env File

1. Open file: `exp_date\frontend\.env`
2. Find this line:
   ```
   NEXT_PUBLIC_BASE_URL=http://192.168.1.210:3000
   ```
3. Replace `192.168.1.210` with YOUR IP from Step 1
4. **SAVE the file**

**Example:** If your IP is `192.168.1.105`, change to:
```
NEXT_PUBLIC_BASE_URL=http://192.168.1.105:3000
```

---

### STEP 3: Stop Current Server

**In the terminal where server is running:**
- Press `Ctrl+C` to stop

---

### STEP 4: Start Server Correctly

**Option A: Double-click this file:**
```
START-SERVER-NETWORK.bat
```

**Option B: Or run in PowerShell:**
```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev:network
```

**⚠️ CRITICAL: You MUST see this output:**
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.XXX:3000  ← MUST SEE THIS!
```

**If you DON'T see the "Network" line, the server won't work!**

---

### STEP 5: Test on Computer First

**Open browser on your computer:**
- Go to: `http://YOUR_IP:3000` (use your actual IP)
- Example: `http://192.168.1.105:3000`
- **Should show your homepage** ✅

**If this doesn't work, fix it before testing on phone!**

---

### STEP 6: Test on Phone

**On your phone:**
1. Make sure phone is on **SAME WiFi** as computer
2. Open phone browser
3. Type: `http://YOUR_IP:3000` (same IP from Step 1)
4. **Should show homepage** ✅

**If this works, QR code will work!**

---

### STEP 7: Fix Firewall (If Still Not Working)

**Windows Firewall:**
1. Press `Win + R`
2. Type: `firewall.cpl` and press Enter
3. Click "Allow an app or feature through Windows Firewall"
4. Click "Change Settings"
5. Click "Allow another app..."
6. Browse to: `C:\Program Files\nodejs\node.exe`
7. Click "Add"
8. Check both "Private" and "Public"
9. Click OK

**OR test with firewall off:**
- Temporarily disable firewall
- If it works, firewall is blocking
- Re-enable and add Node.js exception

---

## ✅ Success Checklist

- [ ] Found my actual IP address (`ipconfig`)
- [ ] Updated `.env` file with correct IP
- [ ] Started server with `npm run dev:network`
- [ ] Server shows "Network: http://X.X.X.X:3000"
- [ ] Can access `http://MY_IP:3000` from computer browser
- [ ] Phone on same WiFi network
- [ ] Can access `http://MY_IP:3000` from phone browser
- [ ] QR code works! 🎉

---

## 🔧 Still Not Working?

### Try ngrok (Bypasses Network Issues)

1. **Download ngrok:** https://ngrok.com/download
2. **Start your server:**
   ```powershell
   npm run dev
   ```
3. **In another terminal, start ngrok:**
   ```powershell
   ngrok http 3000
   ```
4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)
5. **Update `.env`:**
   ```
   NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
   ```
6. **Restart server**

**This works even if your network has issues!**

---

## 📞 Need More Help?

Check these files:
- `FIX-NETWORK-ERROR.md` - Detailed troubleshooting
- `TROUBLESHOOTING-NETWORK.md` - Complete guide
- `QUICK-FIX-NETWORK.md` - Quick reference
