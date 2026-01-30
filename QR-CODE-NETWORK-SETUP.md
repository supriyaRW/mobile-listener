# QR Code Network Setup Guide

## Problem

When scanning QR codes, if the server is accessed via `localhost:3000`, the QR code will contain `http://localhost:3000/download`, which won't work when scanned from a mobile device on a different network.

## Solution

Access your development server using your **network IP address** instead of `localhost`.

## Steps to Fix

### Step 1: Find Your Network IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.100
```

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
# Look for your network interface (usually wlan0 or eth0)
# Example: 192.168.1.100
```

### Step 2: Start Server with Network Access

**Option A: Use Network IP in URL**
```bash
cd exp_date/frontend
npm run dev
# Then access via: http://192.168.1.100:3000
# (Replace 192.168.1.100 with your actual IP)
```

**Option B: Configure Next.js to listen on all interfaces**
```bash
cd exp_date/frontend
npm run dev -- -H 0.0.0.0
# Then access via: http://192.168.1.100:3000
```

### Step 3: Access via Network IP

Instead of:
```
http://localhost:3000
```

Use:
```
http://192.168.1.100:3000
```
(Replace with your actual network IP)

### Step 4: Scan QR Code

Now when you scan the QR code:
- It will contain: `http://192.168.1.100:3000/download`
- Mobile device can access it (if on same network)
- APK downloads successfully!

## Alternative: Use Environment Variable

### Option 1: Set BASE_URL in .env

Edit `frontend/.env`:
```env
NEXT_PUBLIC_BASE_URL=http://192.168.1.100:3000
```

Then restart server:
```bash
npm run dev
```

### Option 2: Use Relative Paths (Current Implementation)

The current code uses `window.location.origin`, which means:
- If you access via `localhost:3000` → QR code has `localhost`
- If you access via `192.168.1.100:3000` → QR code has network IP ✅

**Best Practice:** Always access your dev server via network IP when testing QR codes!

## Production Deployment

For production, set in `.env`:
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Troubleshooting

### QR Code Still Shows localhost

**Problem:** QR code contains `http://localhost:3000/download`

**Solution:**
1. Access server via network IP: `http://192.168.1.100:3000`
2. Or set `NEXT_PUBLIC_BASE_URL` in `.env`
3. Restart server after changing `.env`

### Mobile Can't Access Server

**Problem:** Mobile device can't reach the server

**Solutions:**
1. **Same Network:** Ensure phone and computer are on same WiFi network
2. **Firewall:** Allow port 3000 in Windows Firewall/iptables
3. **Router:** Some routers block device-to-device communication - check router settings
4. **VPN:** Disable VPN if active

### Firewall Configuration

**Windows Firewall:**
```bash
# Allow Node.js through firewall
# Or manually add rule for port 3000
```

**Linux (iptables):**
```bash
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

## Quick Test

1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Start server: `npm run dev -- -H 0.0.0.0`
3. Access: `http://YOUR_IP:3000`
4. Scan QR code with phone
5. Should work! ✅

## Summary

✅ **Always access dev server via network IP when testing QR codes**  
✅ **QR code will automatically use the correct URL**  
✅ **Mobile devices can access and download APK**  
✅ **No localhost URLs in QR codes!**
