"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { config } from "@/lib/config";

function ScanRedirectContent() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get return URL from params or use current origin
    const returnUrlParam = searchParams.get("returnUrl");
    const finalReturnUrl = returnUrlParam || (typeof window !== 'undefined' ? window.location.origin : '');
    
    // Detect platform
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    const messageEl = document.getElementById("status-message");
    const instructions = document.getElementById("instructions");
    
    if (isAndroid) {
      // For Android: Immediately try to open app using deep link scheme
      const deepLink = `expiryanalyzer://scan?returnUrl=${encodeURIComponent(finalReturnUrl)}`;
      const intentLink = `intent://scan?returnUrl=${encodeURIComponent(finalReturnUrl)}#Intent;scheme=expiryanalyzer;package=com.example.exp_date;end`;
      
      console.log('🔗 QR Scan - Attempting to open app');
      console.log('   Deep Link:', deepLink);
      console.log('   Intent Link:', intentLink);
      console.log('   Return URL:', finalReturnUrl);
      
      if (messageEl) {
        messageEl.textContent = "Opening app...";
      }
      
      // Track if app opened (page becomes hidden)
      let appOpened = false;
      let downloadTriggered = false;
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          appOpened = true;
          console.log('✅ App opened successfully!');
        }
      };
      
      const handlePageHide = () => {
        appOpened = true;
        console.log('✅ App opened (page hidden)!');
      };
      
      // Listen for page visibility changes (app opening)
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('pagehide', handlePageHide);
      
      // Strategy 1: Try Intent URL first (most reliable on Android)
      console.log('📱 Strategy 1: Trying Intent URL');
      window.location.href = intentLink;
      
      // Strategy 2: Try custom scheme deep link via iframe
      setTimeout(() => {
        if (!appOpened) {
          console.log('📱 Strategy 2: Trying deep link via iframe');
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = deepLink;
          document.body.appendChild(iframe);
          
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }
      }, 300);
      
      // Strategy 3: Try direct deep link redirect
      setTimeout(() => {
        if (!appOpened) {
          console.log('📱 Strategy 3: Trying direct deep link redirect');
          window.location.href = deepLink;
        }
      }, 600);
      
      // If app doesn't open within 2 seconds, download APK
      setTimeout(() => {
        if (!appOpened && !downloadTriggered) {
          downloadTriggered = true;
          console.log('📱 App not installed, downloading APK...');
          
          if (messageEl) {
            messageEl.textContent = "App not found. Downloading APK...";
          }
          
          const apkUrl = config.getApkApiUrl();
          
          // Trigger download
          const link = document.createElement("a");
          link.href = apkUrl;
          link.download = config.apk.fileName;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Also try direct redirect as fallback
          setTimeout(() => {
            window.location.href = apkUrl;
          }, 500);
          
          // Show instructions after a delay
          setTimeout(() => {
            if (instructions) {
              instructions.style.display = "block";
            }
            if (messageEl) {
              messageEl.textContent = "APK download started. Check your downloads folder.";
            }
          }, 2000);
        }
        
        // Clean up listeners
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pagehide', handlePageHide);
      }, 2000);
      
    } else if (isIOS) {
      // iOS: Try to open app first
      const deepLink = `expiryanalyzer://scan?returnUrl=${encodeURIComponent(finalReturnUrl)}`;
      
      console.log('🔗 QR Scan - Attempting to open iOS app:', deepLink);
      console.log('   Return URL:', finalReturnUrl);
      
      if (messageEl) {
        messageEl.textContent = "Opening app...";
      }
      
      // Track if app opened
      let appOpened = false;
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          appOpened = true;
          console.log('✅ iOS app opened successfully!');
        }
      };
      
      const handlePageHide = () => {
        appOpened = true;
        console.log('✅ iOS app opened (page hidden)!');
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('pagehide', handlePageHide);
      
      // Try to open app
      window.location.href = deepLink;
      
      // Show instructions if app doesn't open
      setTimeout(() => {
        if (!appOpened && instructions) {
          instructions.style.display = "block";
        }
        if (!appOpened && messageEl) {
          messageEl.textContent = "If the app didn't open, make sure it's installed.";
        }
        
        // Clean up listeners
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pagehide', handlePageHide);
      }, 1500);
      
    } else {
      // Desktop - show instructions and download button
      if (instructions) {
        instructions.style.display = "block";
      }
      if (messageEl) {
        messageEl.textContent = "Scan this QR code with your mobile device.";
      }
    }
  }, [searchParams]);

  const handleDownloadAPK = async () => {
    // Use config to get correct APK download URL (uses BASE_URL from .env)
    const apkUrl = config.getApkApiUrl();
    
    console.log('🔗 Manual download - Using URL:', apkUrl);
    
    // Try programmatic download
    const link = document.createElement("a");
    link.href = apkUrl;
    link.download = config.apk.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Fallback: open in new tab
    setTimeout(() => {
      window.open(apkUrl, "_blank");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Opening App...
          </h1>
          <p id="status-message" className="text-gray-600">
            Attempting to open the app...
          </p>
        </div>

        <div
          id="instructions"
          className="hidden text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6"
        >
          <h3 className="font-semibold text-blue-800 mb-2">
            Installation Instructions
          </h3>
          
          {/* APK Download Button (for manual download if needed) */}
          <button
            onClick={handleDownloadAPK}
            className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download APK Again (if needed)
          </button>

          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 mb-4">
            <li>Check your device&apos;s Downloads folder for <strong>app-release.apk</strong></li>
            <li>Enable &quot;Install from Unknown Sources&quot; in Android Settings → Security</li>
            <li>Tap on the downloaded APK file to install</li>
            <li>After installation, scan the QR code again to open the app</li>
          </ol>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-600">
              <strong>APK File:</strong> <code className="bg-blue-100 px-1 rounded">{config.apk.fileName}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScanRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ScanRedirectContent />
    </Suspense>
  );
}
