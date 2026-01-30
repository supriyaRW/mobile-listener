# Verify Server is Running Correctly

## ✅ Your IP Address is Correct: 192.168.1.210

Your `.env` file already has the correct IP address!

## Step 1: Check if Server is Running

**Open PowerShell and run:**

```powershell
netstat -an | findstr :3000
```

**You should see something like:**
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING
```

**If you see `127.0.0.1:3000` instead of `0.0.0.0:3000`, the server is NOT accessible from network!**

---

## Step 2: Start Server Correctly

**Stop current server** (if running):
- Press `Ctrl+C` in the terminal

**Start server with network access:**

**Option A: Double-click**
```
START-SERVER-NETWORK.bat
```

**Option B: PowerShell**
```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev:network
```

**You MUST see this output:**
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.210:3000  ← MUST SEE THIS!
```

---

## Step 3: Test Server Accessibility

### Test 1: On Your Computer

**Open browser and go to:**
```
http://192.168.1.210:3000
```

**Should show:** Your homepage ✅

**If this doesn't work:**
- Server might not be running
- Try `http://localhost:3000` instead
- If localhost works but IP doesn't, server isn't listening on network

### Test 2: On Your Phone

**Make sure:**
- Phone is on **SAME WiFi network** as computer
- WiFi name matches on both devices

**Open phone browser and go to:**
```
http://192.168.1.210:3000
```

**Should show:** Your homepage ✅

**If this doesn't work:**
- Check firewall (see Step 4)
- Verify same WiFi network
- Try disabling firewall temporarily to test

---

## Step 4: Check Windows Firewall

**Open PowerShell as Administrator and run:**

```powershell
netsh advfirewall firewall show rule name="Node.js"
```

**If no rules found, add one:**

```powershell
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
```

**OR manually:**
1. Press `Win + R`
2. Type: `firewall.cpl` and press Enter
3. Click "Allow an app or feature through Windows Firewall"
4. Click "Change Settings"
5. Click "Allow another app..."
6. Browse to: `C:\Program Files\nodejs\node.exe`
7. Click "Add"
8. Check both "Private" and "Public"
9. Click OK

---

## Step 5: Test Specific Endpoints

### Test Homepage:
```
http://192.168.1.210:3000
```

### Test Scan Page:
```
http://192.168.1.210:3000/scan
```

### Test APK Download:
```
http://192.168.1.210:3000/api/apk
```

**All three should work from both computer and phone!**

---

## Quick Diagnostic Commands

**Check if port 3000 is listening:**
```powershell
netstat -an | findstr :3000
```

**Test if server responds:**
```powershell
curl http://192.168.1.210:3000
```

**Check firewall rules:**
```powershell
netsh advfirewall firewall show rule name=all | findstr 3000
```

---

## Common Issues

### Issue: Server shows only "Local" address

**Solution:**
```powershell
npm run dev:network
```
Must use `--hostname 0.0.0.0` flag!

### Issue: Can access from computer but not phone

**Possible causes:**
1. Firewall blocking
2. Different WiFi networks
3. Router AP isolation enabled

**Solutions:**
- Disable firewall temporarily to test
- Verify same WiFi network
- Check router settings

### Issue: "Connection refused" or "Timeout"

**Possible causes:**
1. Server not running
2. Wrong IP address
3. Firewall blocking

**Solutions:**
- Verify server is running
- Check IP with `ipconfig`
- Check firewall settings

---

## Success Checklist

- [ ] IP address is 192.168.1.210 ✅
- [ ] `.env` file has correct IP ✅
- [ ] Server started with `npm run dev:network`
- [ ] Server shows "Network: http://192.168.1.210:3000"
- [ ] Can access `http://192.168.1.210:3000` from computer
- [ ] Phone on same WiFi network
- [ ] Can access `http://192.168.1.210:3000` from phone
- [ ] Firewall allows Node.js/port 3000
- [ ] QR code works! 🎉
