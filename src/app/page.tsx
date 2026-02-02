"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getDownloadUrlForQR } from "@/lib/qr-code-url";

type UploadedImage = {
  id: string;
  file: File;
  url: string;
  product: string;
  expiryDate: string; // YYYY-MM-DD
  status: "Valid" | "Expiring Soon" | "Expired";
};

type Product = {
  id: string;
  name: string;
  expiryDate: string;
  status: "Valid" | "Expiring Soon" | "Expired";
  imageUrl?: string;
};

function computeStatus(dateISO: string): UploadedImage["status"] {
  const today = new Date();
  const target = new Date(dateISO);
  if (isNaN(target.getTime())) return "Valid";
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Expired";
  if (diffDays <= 30) return "Expiring Soon";
  return "Valid";
}

// Helper function to get returnUrl with network IP instead of localhost
function getReturnUrl(): string {
  if (typeof window === 'undefined') return '';
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  if (baseUrl) {
    // Use BASE_URL from .env (already configured with network IP)
    return baseUrl;
  }
  
  // If accessing via localhost, replace with current hostname (should be network IP)
  const currentUrl = window.location.href;
  if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
    // Replace localhost with current hostname (which should be network IP when accessed correctly)
    return currentUrl.replace(/localhost|127\.0\.0\.1/, window.location.hostname);
  }
  
  return currentUrl;
}

export default function Home() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  // Listen for scanned data from mobile app
  useEffect(() => {
    const handleScanResult = (event: MessageEvent) => {
      // Handle postMessage from mobile app or deep link return
      if (event.data && event.data.type === 'SCAN_RESULT') {
        const { barcode, product, expiryDate } = event.data;
        addScannedProduct(barcode, product, expiryDate);
      }
    };

    window.addEventListener('message', handleScanResult);

    // Check URL params for scan result (when app redirects back from Flutter app)
    const params = new URLSearchParams(window.location.search);
    const barcode = params.get('barcode');
    const product = params.get('product');
    const expiryDate = params.get('expiryDate');

    // If product data exists (from Flutter app scan), add it
    if (product || barcode || expiryDate) {
      addScannedProduct(
        barcode || `scanned-${Date.now()}`, 
        decodeURIComponent(product || 'Scanned Product'), 
        expiryDate || ''
      );
      // Clean up URL after processing
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => window.removeEventListener('message', handleScanResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addScannedProduct = async (barcode: string, productName: string, expiryDate: string) => {
    // Product details come directly from mobile app scan
    const newProduct: Product = {
      id: `scanned-${Date.now()}`,
      name: productName || `Product ${barcode}`,
      expiryDate: expiryDate || '',
      status: computeStatus(expiryDate || ''),
    };

    setProducts(prev => [newProduct, ...prev]);
  };

  // Check if accessing via localhost
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1');
    }
  }, []);

  const handleOpenApp = async () => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;

    if (!isMobile) {
      // Desktop: Send command to server to open app on mobile
      const returnUrl = getReturnUrl();
      
      try {
        const response = await fetch('/api/open-app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ returnUrl }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert(
            "✅ Command sent!\n\n" +
            "Make sure:\n" +
            "1. Your mobile device has the page open at:\n" +
            `   http://192.168.1.210:3000/mobile-listener\n\n` +
            "2. Or open this link on your mobile:\n" +
            `   http://192.168.1.210:3000/mobile-listener\n\n` +
            "The app will open automatically on your phone!"
          );
          
          // Optionally open mobile listener page in new tab/window
          const mobileUrl = `${getReturnUrl()}/mobile-listener`;
          if (confirm("Would you like to open the mobile listener page?")) {
            window.open(mobileUrl, '_blank');
          }
        } else {
          alert("Failed to send command. Please try again.");
        }
      } catch (error) {
        console.error('Error sending open app command:', error);
        alert("Error sending command. Please make sure the server is running.");
      }
      return;
    }

    // Mobile: Open app directly
    const returnUrl = encodeURIComponent(getReturnUrl());
    const scheme = "expiryanalyzer://scan";
    const deepLink = `${scheme}?returnUrl=${returnUrl}`;

    // Track if app opened
    let appOpened = false;
    
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
    
    // Listen for app opening
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    if (isAndroid) {
      // Android: Try HTTP URL first (works with AndroidManifest.xml intent filters)
      // This will show app chooser, then open app
      const httpUrl = `${getReturnUrl()}/scan${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
      
      console.log('🔗 Opening Android app via HTTP URL:', httpUrl);
      window.location.href = httpUrl;
      
      // Fallback 1: Try Intent URL
      setTimeout(() => {
        if (!appOpened) {
          const intent = `intent://scan?returnUrl=${returnUrl}#Intent;scheme=expiryanalyzer;package=com.example.exp_date;end`;
          window.location.href = intent;
        }
      }, 500);
      
      // Fallback 2: Try custom scheme
      setTimeout(() => {
        if (!appOpened) {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = deepLink;
          document.body.appendChild(iframe);
          
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }
      }, 1000);
      
    } else if (isIOS) {
      // iOS: Use custom URL scheme
      console.log('🔗 Opening iOS app:', deepLink);
      window.location.href = deepLink;
    }

    // Show message if app doesn't open
    setTimeout(() => {
      if (!appOpened) {
        const message = isAndroid
          ? "App not found. Please install the app first:\n\n1. Scan the QR code using 'Scan with App' button\n2. Download and install the APK\n3. Then try again"
          : "App not found. Please install the app first.";
        
        if (confirm(message + "\n\nWould you like to download the APK?")) {
          // Redirect to download page
          window.location.href = '/scan';
        }
      }
      
      // Clean up listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    }, 2000);
  };

  const handleScanWithApp = () => {
    // Check if on mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (!isMobile) {
      // On desktop - show QR code
      setShowQRCode(true);
      return;
    }

    // On mobile - attempt to open app
    const scheme = "expiryanalyzer://scan";
    const returnUrl = encodeURIComponent(window.location.href);
    const deepLink = `${scheme}?returnUrl=${returnUrl}`;
    
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // Try to open the locally running app
    if (isIOS) {
      // iOS Custom URL Scheme approach
      window.location.href = deepLink;
      
      // Show helpful message if app doesn't open
      setTimeout(() => {
        alert(
          "If the app didn't open, make sure:\n" +
          "1. The Flutter app is installed on this device\n" +
          "2. Run: flutter run (from exp_date_mob/exp_date)\n" +
          "3. Or install via Xcode for iOS"
        );
      }, 2000);
    } else if (isAndroid) {
      // Android Intent approach for local app
      const intent = `intent://scan?returnUrl=${returnUrl}#Intent;scheme=expiryanalyzer;package=com.example.exp_date;end`;
      
      // Try intent first
      window.location.href = intent;
      
      // Fallback with iframe for older Android versions
      setTimeout(() => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = deepLink;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
      
      // Show helpful message if app doesn't open
      setTimeout(() => {
        alert(
          "If the app didn't open, make sure:\n" +
          "1. The Flutter app is installed on this device\n" +
          "2. Run: flutter run (from exp_date_mob/exp_date)\n" +
          "3. Or install the APK: flutter build apk && flutter install"
        );
      }, 2000);
    }
  };

  const onFilesSelected = useCallback((filesList: FileList | null) => {
    if (!filesList) return;
    const incoming = Array.from(filesList).slice(0, 10);
    const base = images.length;
    const nextItems: UploadedImage[] = incoming.map((file, idx) => {
      const url = URL.createObjectURL(file);
      const placeholderName = `product_${base + idx + 1}`;
      return {
        id: `${Date.now()}-${idx}`,
        file,
        url,
        product: placeholderName,
        expiryDate: "",
        status: "Valid",
      };
    });
    setImages((prev) => [...prev, ...nextItems]);
    void analyzeBatch(nextItems);
  }, [images.length]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onFilesSelected(e.dataTransfer.files);
  }, [onFilesSelected]);

  const handleBrowse = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const allProducts = useMemo(() => {
    // Combine scanned products and uploaded images
    const imageProducts = images.map(img => ({
      id: img.id,
      name: img.product,
      expiryDate: img.expiryDate,
      status: img.status,
      imageUrl: img.url,
    }));
    return [...products, ...imageProducts];
  }, [products, images]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allProducts;
    return allProducts.filter((p) => p.name.toLowerCase().includes(term));
  }, [allProducts, search]);

  const counts = useMemo(() => {
    return {
      total: allProducts.length,
      expiring: allProducts.filter((i) => i.status === "Expiring Soon").length,
      valid: allProducts.filter((i) => i.status === "Valid").length,
      expired: allProducts.filter((i) => i.status === "Expired").length,
    };
  }, [allProducts]);

  const downloadCSV = useCallback(() => {
    const headers = ["Product", "Expiry Date", "Status"];
    const rows = allProducts.map((p) => [p.name, p.expiryDate, p.status]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expiry-results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [allProducts]);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setImages((prev) => {
      const toRemove = prev.find((i) => i.id === id);
      if (toRemove) {
        try { URL.revokeObjectURL(toRemove.url); } catch { }
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  async function analyzeBatch(batch: UploadedImage[]) {
    setIsAnalyzing(true);
    try {
      const updates = await Promise.all(batch.map(async (item) => {
        const form = new FormData();
        form.append("image", item.file);
        form.append("manualProduct", item.product || "");
        form.append("manualDate", item.expiryDate || "");
        const res = await fetch("/api/analyze", { method: "POST", body: form });
        if (!res.ok) return null;
        const data = await res.json() as { product?: string; expiryDate?: string };
        const name = data.product && data.product.trim().length > 0 ? data.product.trim() : item.product;
        const expiry = data.expiryDate && data.expiryDate.length > 0 ? data.expiryDate : item.expiryDate;
        return {
          id: item.id,
          product: name,
          expiryDate: expiry,
          status: computeStatus(expiry),
        };
      }));

      setImages((prev) => prev.map((img) => {
        const u = updates.find((x) => x && x.id === img.id);
        return u ? { ...img, product: u.product, expiryDate: u.expiryDate, status: u.status } : img;
      }));
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen w-full soft-gradient bg-fixed p-6 sm:p-10">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 sm:p-10 text-white shadow-2xl">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-semibold">Expiry Date Analyzer</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleOpenApp}
              className="inline-flex items-center gap-2 h-11 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 font-semibold shadow-lg hover:from-green-600 hover:to-emerald-700 backdrop-blur transition-all active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Open App
            </button>
            <button
              type="button"
              onClick={handleScanWithApp}
              className="inline-flex items-center gap-2 h-11 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 backdrop-blur transition-all active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 2V6M16 2V6M8 18V22M16 18V22M2 8H6M2 16H6M18 8H22M18 16H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <rect x="10" y="10" width="4" height="4" fill="currentColor" />
              </svg>
              Scan with App
            </button>
          </div>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onFilesSelected(e.target.files)}
          />
        </div>

        {/* QR Code Modal for Desktop Users */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 rounded-2xl p-8 max-w-md w-full text-center relative">
              <button
                onClick={() => setShowQRCode(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Scan to Open App</h3>
              {isLocalhost && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
                  <p className="text-sm text-yellow-800 font-semibold mb-1">⚠️ Localhost Detected</p>
                  <p className="text-xs text-yellow-700">
                    QR code contains localhost URL and won&apos;t work on mobile devices.
                    <br />
                    <strong>Solution:</strong> Access this page via your network IP instead:
                    <br />
                    <code className="bg-yellow-100 px-1 rounded">http://YOUR_IP:3000</code>
                    <br />
                    Find your IP with: <code className="bg-yellow-100 px-1 rounded">ipconfig</code> (Windows) or <code className="bg-yellow-100 px-1 rounded">ifconfig</code> (Mac/Linux)
                  </p>
                </div>
              )}
              <p className="text-gray-600 mb-6">Scan this QR code with your phone to open the app. If the app is not installed, it will download automatically.</p>
              <div className="bg-white p-4 rounded-lg inline-block border-4 border-gray-200">
                <QRCodeSVG 
                  value={`${getDownloadUrlForQR()}?returnUrl=${encodeURIComponent(getReturnUrl())}`} 
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-500 mt-6">
                📱 <strong>Scan with your phone</strong>
                <br />
                <span className="text-xs text-gray-400 mt-2 block">
                  If the app is installed, it will open automatically.
                  <br />
                  If not installed, the APK will download automatically.
                </span>
                <span className="text-xs text-gray-500 mt-2 block font-mono">
                  QR URL: {`${getDownloadUrlForQR()}?returnUrl=${encodeURIComponent(getReturnUrl())}`}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Panel - 35% */}
          <section className="md:w-[35%] w-full">
            <h2 className="text-2xl font-semibold mb-4">Upload</h2>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="rounded-xl border border-white/25 bg-white/10 backdrop-blur-lg p-6 text-center shadow-lg"
            >
              <div className="h-48 grid place-items-center rounded-lg border border-dashed border-white/30 bg-white/5">
                <p className="max-w-[18rem] text-white/90">Drag and drop images here</p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleBrowse}
                  className="mx-auto inline-flex h-10 items-center justify-center rounded-md bg-white/20 text-white px-5 font-medium shadow hover:bg-white/30 backdrop-blur"
                >
                  Browse
                </button>
                <p className="mt-2 text-sm text-white/80">Up to 10 images</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
              />
            </div>

            {images.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-4 overflow-y-auto no-scrollbar styled-scrollbar md:max-h-[68vh] pr-1">
                {images.map((img) => (
                  <div key={img.id} className="relative size-24 overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur">
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => removeProduct(img.id)}
                      className="absolute left-1 top-1 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3H15M4 7H20M18 7L17.2 19.2C17.08 20.86 15.72 22 14.05 22H9.95C8.28 22 6.92 20.86 6.8 19.2L6 7M10 11V18M14 11V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.product} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Panel - 65% */}
          <section className="md:w-[65%] w-full">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Products</h2>
              <div className="text-sm text-white/85">
                {counts.total} products — {counts.expiring} expiring soon, {counts.valid} valid{counts.expired ? `, ${counts.expired} expired` : ""}
              </div>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg p-4 sm:p-6 flex flex-col md:h-[72vh] shadow-lg">
              <div className="mb-4 flex items-center justify-between gap-3 shrink-0 flex-wrap">
                <div className="relative w-60 max-w-full">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="w-full rounded-md border border-white/20 bg-white/10 px-9 py-2 placeholder-white/70 outline-none focus:ring-2 focus:ring-white/30 backdrop-blur"
                  />
                  <span className="absolute left-3 top-2.5 text-white/80">🔍</span>
                </div>
                <button
                  onClick={downloadCSV}
                  className="rounded-md bg-white/20 text-white px-4 py-2 text-sm font-medium shadow hover:bg-white/30 backdrop-blur"
                >
                  Download CSV
                </button>
                {isAnalyzing && (
                  <span className="ml-3 text-xs text-white/80">Analyzing...</span>
                )}
              </div>
              <div className="overflow-x-auto overflow-y-auto no-scrollbar styled-scrollbar flex-1">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-white/80">
                      <th className="py-2 pr-4 font-medium">Image</th>
                      <th className="py-2 pr-4 font-medium">Product</th>
                      <th className="py-2 pr-4 font-medium">Expiry Date</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                      <th className="py-2 pr-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => (
                      <tr key={product.id} className="border-t border-white/10">
                        <td className="py-3 pr-4">
                          <div className="size-12 overflow-hidden rounded-md border border-white/20 bg-white/10 backdrop-blur flex items-center justify-center">
                            {product.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/40">
                                <path d="M21 16V8C21 6.9 20.1 6 19 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 10H17M7 14H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-4 align-middle">
                          <div className="text-white/95 font-medium">{product.name}</div>
                        </td>
                        <td className="py-3 pr-4 align-middle">
                          <div className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-white/90 backdrop-blur inline-block">
                            {product.expiryDate || "-"}
                          </div>
                        </td>
                        <td className="py-3 pr-4 align-middle">
                          <span
                            className={
                              product.status === "Valid"
                                ? "inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200"
                                : product.status === "Expiring Soon"
                                  ? "inline-flex items-center rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200"
                                  : "inline-flex items-center rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200"
                            }
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 align-middle">
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="text-white/60 hover:text-red-400 transition-colors"
                            aria-label="Remove product"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <path d="M9 3H15M4 7H20M18 7L17.2 19.2C17.08 20.86 15.72 22 14.05 22H9.95C8.28 22 6.92 20.86 6.8 19.2L6 7M10 11V18M14 11V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td className="py-6 text-center text-white/70" colSpan={5}>
                          No products yet. Upload images or scan with the mobile app.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="mx-auto max-w-7xl mt-6 text-center text-xs text-white/80">
        Powered by Randomwalk.ai
      </div>
    </div>
  );
}