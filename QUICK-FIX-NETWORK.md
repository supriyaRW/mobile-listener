# Quick Fix: Network Connection Error

## The Problem
Your mobile device shows: **"This site can't be reached"** for `http://192.168.1.210:3000/scan`

## Quick Fix Steps

### 1. Verify Server is Running
```bash
cd exp_date/frontend
npm run dev
```

**Look for this output:**
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.210:3000  ← Must see this!
```

If you **don't see** the Network line, run:
```bash
npm run dev -- -H 0.0.0.0
```

### 2. Check Your Actual IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" - it might be different from `192.168.1.210`

**Mac/Linux:**
```bash
ifconfig
```

### 3. Update .env File

Edit `exp_date/frontend/.env`:
```env
NEXT_PUBLIC_BASE_URL=http://YOUR_ACTUAL_IP:3000
```

**Example:** If your IP is `192.168.1.105`, use:
```env
NEXT_PUBLIC_BASE_URL=http://192.168.1.105:3000
```

### 4. Restart Server
```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

### 5. Test on Mobile

Open mobile browser and try:
- `http://YOUR_IP:3000` ← Should show homepage
- `http://YOUR_IP:3000/scan` ← Should show scan page

If these work, the QR code will work too!

### 6. Check Firewall

**Windows:**
- Windows Defender Firewall → Allow Node.js through firewall

**Mac:**
- System Preferences → Security → Firewall → Allow Node.js

### 7. Verify Same Network

- Computer and phone must be on **same Wi-Fi network**
- Mobile data won't work - must use Wi-Fi

## Still Not Working?

See detailed guide: `TROUBLESHOOTING-NETWORK.md`
