# Troubleshooting Network Connectivity Issues

## Problem: "This site can't be reached" Error

If you see an error like:
```
This site can't be reached
http://192.168.1.210:3000/scan is unreachable
```

This means your mobile device cannot connect to your development server.

## Step-by-Step Troubleshooting

### Step 1: Verify Server is Running

**On your computer (where the server runs):**

```bash
cd exp_date/frontend
npm run dev
```

You should see:
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.210:3000
```

**Important:** Make sure the server shows a Network address. If it only shows `localhost`, the server might not be accessible from other devices.

### Step 2: Verify Server is Accessible on Network

**Option A: Start server with explicit host binding**

```bash
cd exp_date/frontend
npm run dev -- -H 0.0.0.0
```

This makes the server listen on all network interfaces.

**Option B: Check Next.js config**

Create or update `next.config.js`:

```javascript
module.exports = {
  // ... other config
  // Ensure server is accessible from network
}
```

### Step 3: Verify IP Address

**On your computer, find your network IP:**

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually Wi-Fi or Ethernet).

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```

**Verify:** The IP should match `192.168.1.210` (or whatever is in your `.env` file).

### Step 4: Check Firewall Settings

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Firewall"
3. Find Node.js or your terminal/command prompt
4. Ensure both "Private" and "Public" are checked
5. Or temporarily disable firewall to test

**Mac Firewall:**
1. System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Ensure Node.js is allowed, or temporarily disable to test

### Step 5: Verify Both Devices on Same Network

**Check Wi-Fi:**
- Both your computer and mobile device must be on the **same Wi-Fi network**
- Mobile data won't work - must use Wi-Fi
- Some networks have "Guest Mode" isolation - ensure both devices are on the main network

**Test connectivity:**
- On your mobile device, open a browser
- Try accessing: `http://192.168.1.210:3000` (without `/scan`)
- You should see your Next.js app homepage

### Step 6: Update .env File

Make sure your `.env` file has the correct IP:

```env
NEXT_PUBLIC_BASE_URL=http://192.168.1.210:3000
```

**Important:** 
- Use your actual network IP (not `192.168.1.210` unless that's your IP)
- Don't use `localhost` or `127.0.0.1`
- Include `http://` prefix
- Don't include trailing slash

### Step 7: Restart Server After .env Changes

After updating `.env`, you **must restart** the Next.js server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 8: Test Direct Access

**On your mobile device browser:**

1. Try: `http://192.168.1.210:3000`
   - Should show homepage ✅

2. Try: `http://192.168.1.210:3000/scan`
   - Should show scan page ✅

3. Try: `http://192.168.1.210:3000/api/apk`
   - Should download APK ✅

If all three work, the QR code should work too!

## Common Issues & Solutions

### Issue: Server only shows "Local" address

**Solution:** Start with explicit host:
```bash
npm run dev -- -H 0.0.0.0
```

### Issue: IP address changed

**Solution:** 
1. Find new IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update `.env` file with new IP
3. Restart server

### Issue: Firewall blocking

**Solution:**
- Temporarily disable firewall to test
- If it works, add Node.js to firewall exceptions
- Re-enable firewall

### Issue: Different Wi-Fi networks

**Solution:**
- Ensure both devices on same network
- Check router settings for "AP Isolation" or "Client Isolation"
- Disable isolation if enabled

### Issue: Router blocking local connections

**Solution:**
- Some routers block device-to-device communication
- Check router admin panel for "AP Isolation" settings
- Disable if found

## Quick Test Checklist

- [ ] Server is running (`npm run dev`)
- [ ] Server shows Network address (not just Local)
- [ ] IP address matches `.env` file
- [ ] `.env` file has `NEXT_PUBLIC_BASE_URL=http://YOUR_IP:3000`
- [ ] Server restarted after `.env` changes
- [ ] Firewall allows Node.js
- [ ] Both devices on same Wi-Fi network
- [ ] Can access `http://YOUR_IP:3000` from mobile browser
- [ ] QR code URL shows correct IP (not localhost)

## Still Not Working?

1. **Try ngrok** for external access:
   ```bash
   npx ngrok http 3000
   ```
   Then use the ngrok URL in `.env`

2. **Check router logs** for blocked connections

3. **Try different port** (e.g., 3001):
   ```bash
   npm run dev -- -p 3001
   ```
   Update `.env` accordingly

4. **Use USB tethering** instead of Wi-Fi

5. **Check mobile browser console** for detailed error messages
