# Production Setup - Vercel Deployment

## Production URL

Your application is deployed at:
```
https://mobile-nine-gold.vercel.app
```

## Configuration

### Production Environment

The `.env` file is configured for production:
```env
NEXT_PUBLIC_BASE_URL=https://mobile-nine-gold.vercel.app
```

### QR Code URLs

- **QR Code URL**: `https://mobile-nine-gold.vercel.app/download`
- **APK Download URL**: `https://mobile-nine-gold.vercel.app/api/apk`
- **Direct APK File**: `https://mobile-nine-gold.vercel.app/app-release.apk`

## How It Works

1. **User scans QR code** → Opens: `https://mobile-nine-gold.vercel.app/download`
2. **Page detects Android** → Redirects to: `https://mobile-nine-gold.vercel.app/api/apk`
3. **APK downloads** → File saved to phone's Downloads folder
4. **User installs APK** → App ready!

## Testing

### Test QR Code

1. Open: https://mobile-nine-gold.vercel.app
2. Click "Scan with App" button
3. QR code contains: `https://mobile-nine-gold.vercel.app/download` ✅
4. Scan with Android phone (works from anywhere!)
5. APK downloads automatically

### Verify APK is Available

Make sure the APK file is uploaded to Vercel:
- File should be at: `public/app-release.apk`
- Or use Vercel's file system
- Check: https://mobile-nine-gold.vercel.app/app-release.apk

## Local Development

For local development, you can:

### Option 1: Use Local Network IP
Update `.env` temporarily:
```env
NEXT_PUBLIC_BASE_URL=http://192.168.1.210:3000
```

### Option 2: Use Relative Paths
Set `.env` to empty:
```env
NEXT_PUBLIC_BASE_URL=
```
Then access via network IP: `http://192.168.1.210:3000`

## Vercel Environment Variables

Make sure these are set in Vercel dashboard:

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_BASE_URL` = `https://mobile-nine-gold.vercel.app`
   - `GEMINI_API_KEY` = (your API key)
   - `NEXT_PUBLIC_APK_FILE_NAME` = `app-release.apk`
   - `NEXT_PUBLIC_DOWNLOAD_ROUTE` = `/download`
   - `NEXT_PUBLIC_APK_API_ROUTE` = `/api/apk`

## Deploying APK to Vercel

### Method 1: Include in Git

1. Build APK: `cd exp_date_mob/exp_date && flutter build apk --release`
2. Copy to frontend: `cp build/app/outputs/flutter-apk/app-release.apk ../exp_date/frontend/public/`
3. Commit and push:
   ```bash
   git add frontend/public/app-release.apk
   git commit -m "Add APK file"
   git push
   ```
4. Vercel will automatically deploy

### Method 2: Upload via Vercel Dashboard

1. Go to Vercel Dashboard → Your Project → Settings → General
2. Upload `app-release.apk` to `public/` folder
3. Redeploy

## Benefits of Production URL

✅ **Works from anywhere** - No need for same WiFi network  
✅ **HTTPS support** - Secure connection  
✅ **Public access** - Anyone can scan and download  
✅ **No firewall issues** - Works on any network  
✅ **Professional** - Clean, shareable URL  

## Current Setup

- **Production URL**: https://mobile-nine-gold.vercel.app
- **QR Code**: https://mobile-nine-gold.vercel.app/download
- **APK Download**: https://mobile-nine-gold.vercel.app/api/apk
- **Status**: ✅ Configured and ready!

Your production setup is complete! 🚀
