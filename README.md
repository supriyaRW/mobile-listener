# Mobile Listener - Desktop to Mobile App Opener

This project enables opening Flutter app on mobile device from desktop web app.

## Features

- ✅ Click "Open App" button on desktop to open app on mobile
- ✅ QR code scanning to download/install APK
- ✅ Android App Links support (HTTP URLs open app)
- ✅ Real-time communication between desktop and mobile
- ✅ Automatic APK download if app not installed

## Setup

### Prerequisites

- Node.js 18+ installed
- Flutter app built and APK available

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_BASE_URL=http://192.168.1.210:3000
   NEXT_PUBLIC_APK_FILE_NAME=app-release.apk
   ```

3. **Start server with network access:**
   ```bash
   npm run dev:network
   ```

4. **Open mobile listener on phone:**
   ```
   http://192.168.1.210:3000/mobile-listener
   ```

## Usage

### Open App from Desktop

1. Open `http://192.168.1.210:3000` on desktop
2. Click green **"Open App"** button
3. App opens automatically on mobile device!

### QR Code Installation

1. Click **"Scan with App"** button
2. Scan QR code with phone
3. APK downloads automatically if app not installed

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── open-app/      # Desktop-to-mobile communication
│   │   │   └── apk/           # APK download endpoint
│   │   ├── mobile-listener/   # Mobile listener page
│   │   ├── scan/              # Scan page (opens app or downloads APK)
│   │   └── page.tsx          # Homepage with Open App button
│   └── lib/
│       ├── config.ts         # Configuration
│       └── qr-code-url.ts    # QR code URL generation
├── public/
│   └── app-release.apk       # Flutter APK file
└── .env                      # Environment variables
```

## API Endpoints

- `GET /api/apk` - Download APK file
- `POST /api/open-app` - Send command to open app (desktop)
- `GET /api/open-app?sessionId=...` - Check for open app command (mobile)
- `GET /mobile-listener` - Mobile listener page
- `GET /scan` - Scan page (opens app or downloads APK)

## Android App Links

The Flutter app is configured to handle:
- Custom scheme: `expiryanalyzer://scan`
- HTTP URLs: `http://192.168.1.210:3000/scan`

## Troubleshooting

See `FIX-PHONE-ACCESS.md` for network connectivity issues.

## License

MIT
