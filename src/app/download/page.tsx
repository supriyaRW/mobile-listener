"use client";

import { useEffect, useState } from "react";
import { config } from "@/lib/config";

export default function DirectDownloadPage() {
  const [status, setStatus] = useState("Starting download...");
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Detect if Android device
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isAndroid) {
      // Use config to get APK download URL (uses BASE_URL from .env)
      const apkUrl = config.getApkApiUrl();
      
      console.log('🔗 Redirecting to APK download:', apkUrl);
      
      // Try programmatic download first
      const link = document.createElement("a");
      link.href = apkUrl;
      link.download = config.apk.fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Then redirect to ensure download (more reliable on mobile browsers)
      setTimeout(() => {
        setStatus("Downloading APK file...");
        console.log('📥 Starting download from:', apkUrl);
        window.location.href = apkUrl;
      }, 200);
      
      // Update status after redirect
      setTimeout(() => {
        setDownloaded(true);
        setStatus("Download started! Check your Downloads folder.");
      }, 1500);
    } else {
      // Not Android - show manual download option
      setStatus("This download is for Android devices only.");
      const apkUrl = config.getApkApiUrl();
      console.log('📱 Non-Android device. APK URL:', apkUrl);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-pulse">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {downloaded ? "✅ Download Started!" : "Downloading APK"}
          </h1>
          <p className="text-gray-600 mb-4" id="status-message">
            {status}
          </p>
          {!downloaded && (
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mb-2"></div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-4">
          <h3 className="font-semibold text-blue-800 mb-3">Installation Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Check your <strong>Downloads</strong> folder for <strong>app-release.apk</strong></li>
            <li>Enable <strong>"Install from Unknown Sources"</strong> in Android Settings → Security</li>
            <li>Tap the downloaded APK file to install</li>
            <li>Open the app after installation completes</li>
          </ol>
        </div>

        <div className="space-y-3">
          <a
            href={config.getApkApiUrl()}
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Download APK Again
          </a>
          <a
            href="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors text-sm"
          >
            Back to Home
          </a>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-left">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
