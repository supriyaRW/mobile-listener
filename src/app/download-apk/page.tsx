"use client";

import { useEffect } from "react";

export default function DownloadAPKPage() {
  useEffect(() => {
    // Immediately redirect to APK download
    const apkUrl = `${window.location.origin}/api/apk`;
    
    // Try multiple methods to ensure download works on mobile
    // Method 1: Direct link click
    const link = document.createElement("a");
    link.href = apkUrl;
    link.download = "app-release.apk";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Method 2: Direct redirect after short delay
    setTimeout(() => {
      window.location.href = apkUrl;
    }, 300);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-green-600"
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
            Downloading APK...
          </h1>
          <p className="text-gray-600 mb-4">
            The APK file should start downloading automatically.
          </p>
          <p className="text-sm text-gray-500">
            If download doesn't start, check your browser's download settings or try the link below.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">Installation Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Check your Downloads folder for <strong>app-release.apk</strong></li>
            <li>Enable &quot;Install from Unknown Sources&quot; in Android Settings</li>
            <li>Tap the APK file to install</li>
            <li>Open the app after installation</li>
          </ol>
        </div>

        <div className="mt-6">
          <a
            href="/api/apk"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Download APK Again
          </a>
        </div>
      </div>
    </div>
  );
}
