# How to Start Server for Network Access

## Quick Start

### Option 1: Use Network Script (Recommended)

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev:network
```

This will start the server accessible on your network IP (192.168.1.210).

### Option 2: Use Hostname Flag

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
npm run dev -- --hostname 0.0.0.0
```

### Option 3: Set Environment Variable

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
$env:HOSTNAME="0.0.0.0"; npm run dev
```

## After Starting Server

1. **Access via Network IP:**
   ```
   http://192.168.1.210:3000
   ```

2. **Don't use localhost:**
   ```
   ❌ http://localhost:3000  (won't work for QR codes)
   ✅ http://192.168.1.210:3000  (works for QR codes)
   ```

3. **Test QR Code:**
   - Click "Scan with App"
   - QR code will contain: `http://192.168.1.210:3000/download`
   - Scan with phone on same WiFi network
   - APK downloads! ✅

## Troubleshooting

### Server Not Accessible on Network

**Check 1: Is server running on 0.0.0.0?**
- Use `npm run dev:network` command
- Or check if you see: `- Local: http://localhost:3000` AND `- Network: http://192.168.1.210:3000`

**Check 2: Windows Firewall**
- Allow Node.js through firewall
- Or add rule for port 3000

**Check 3: Same Network**
- Phone and computer must be on same WiFi
- Check WiFi network name matches

### QR Code Still Shows Localhost

1. Make sure you accessed page via `http://192.168.1.210:3000`
2. Check `.env` file has: `NEXT_PUBLIC_BASE_URL=http://192.168.1.210:3000`
3. Restart server after changing `.env`

## Current Configuration

- **Network IP**: 192.168.1.210
- **Port**: 3000
- **Access URL**: http://192.168.1.210:3000
- **QR Code URL**: http://192.168.1.210:3000/download

## Quick Commands

```powershell
# Start server for network access
npm run dev:network

# Start server normally (localhost only)
npm run dev

# Check if server is running
# Open: http://192.168.1.210:3000
```

Your server is ready! 🚀
