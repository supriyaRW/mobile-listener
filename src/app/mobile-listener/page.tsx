"use client";

import { useEffect, useState } from "react";

export default function MobileListenerPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState("Waiting for command from desktop...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Generate or get session ID
    let currentSessionId = sessionStorage.getItem('open_app_session');
    
    if (!currentSessionId) {
      currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('open_app_session', currentSessionId);
    }
    
    setSessionId(currentSessionId);
    
    // Set cookie for server
    document.cookie = `open_app_session=${currentSessionId}; path=/; max-age=3600`;
    
    // Start polling for commands
    const pollInterval = setInterval(() => {
      checkForCommand(currentSessionId!);
    }, 1000); // Check every second
    
    setConnected(true);
    
    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const checkForCommand = async (sid: string) => {
    try {
      const response = await fetch(`/api/open-app?sessionId=${sid}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.command === 'open_app') {
        setStatus("Opening app...");
        
        // Open the app using deep link
        const returnUrl = data.returnUrl || '';
        const scheme = "expiryanalyzer://scan";
        const deepLink = returnUrl 
          ? `${scheme}?returnUrl=${encodeURIComponent(returnUrl)}`
          : scheme;
        
        const isAndroid = /Android/.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        
        if (isAndroid) {
          // Android: Use Intent URL
          const intent = `intent://scan${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}#Intent;scheme=expiryanalyzer;package=com.example.exp_date;end`;
          window.location.href = intent;
          
          // Fallback
          setTimeout(() => {
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = deepLink;
            document.body.appendChild(iframe);
            setTimeout(() => document.body.removeChild(iframe), 1000);
          }, 300);
        } else if (isIOS) {
          // iOS: Use custom URL scheme
          window.location.href = deepLink;
        }
        
        // Show success message
        setTimeout(() => {
          setStatus("App opened! If it didn't open, make sure the app is installed.");
        }, 2000);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Cannot connect to server';
      console.error('Error checking for command:', errorMessage);
      setStatus(`Error: ${errorMessage}`);
      setConnected(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${connected ? 'bg-green-100' : 'bg-gray-100'}`}>
            {connected ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Mobile Listener
          </h1>
          <p className="text-gray-600 mb-4">
            {status}
          </p>
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-3 text-left">
              <p className="text-xs text-gray-500 mb-1">Session ID:</p>
              <p className="text-sm font-mono text-gray-700 break-all">{sessionId}</p>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Keep this page open on your mobile device</li>
            <li>On your desktop, click &quot;Open App&quot; button</li>
            <li>The app will open automatically on your phone!</li>
          </ol>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{connected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
