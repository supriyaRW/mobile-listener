import { NextResponse } from "next/server";

// Android App Links verification file
// This file should be accessible at: http://192.168.1.210:3000/.well-known/assetlinks.json
// For production, use HTTPS and proper domain

export async function GET() {
  // Note: For local development (HTTP), Android App Links won't auto-verify
  // But the intent filters will still work (user will see app chooser)
  // For production with HTTPS, you need to:
  // 1. Get your app's SHA256 fingerprint: keytool -list -v -keystore android/app/debug.keystore
  // 2. Replace REPLACE_WITH_YOUR_SHA256_FINGERPRINT below
  // 3. Host this file at https://yourdomain.com/.well-known/assetlinks.json
  
  const assetLinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.example.exp_date",
        sha256_cert_fingerprints: [
          "REPLACE_WITH_YOUR_SHA256_FINGERPRINT"
          // To get fingerprint, run:
          // keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
          // Look for "SHA256:" value
        ]
      }
    }
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
