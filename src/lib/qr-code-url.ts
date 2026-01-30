/**
 * Utility to get the correct URL for QR code generation
 * Uses network IP address instead of localhost for better mobile scanning
 */

export function getQRCodeUrl(path: string = '/download'): string {
  // If base URL is set in env, use it
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl) {
    return `${baseUrl}${path}`;
  }

  // Client-side: detect network IP or use current origin
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If already using IP address (not localhost), use it
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${window.location.protocol}//${hostname}${window.location.port ? `:${window.location.port}` : ''}${path}`;
    }
    
    // For localhost, try to get network IP
    // Note: This requires the server to be accessible via network IP
    // User should access via network IP (e.g., http://192.168.1.100:3000) instead of localhost
    // Return relative path - browser will resolve it
    // But for QR codes, we need full URL, so we'll use a placeholder that user can configure
    return path; // Relative path - will be resolved by browser when scanned
  }

  // Server-side: return relative path
  return path;
}

/**
 * Get the download URL with full network address for QR code
 * This ensures QR codes work when scanned from mobile devices
 * 
 * Uses NEXT_PUBLIC_BASE_URL from .env file (e.g., http://192.168.1.210:3000)
 */
export function getDownloadUrlForQR(): string {
  // Changed to /scan route - this will try to open app first, then download APK if not installed
  const scanRoute = '/scan';
  
  // Priority 1: Use BASE_URL from environment variable (set in .env file)
  // This is the preferred method - ensures consistent URL regardless of how page is accessed
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').trim();
  if (baseUrl) {
    // Ensure baseUrl doesn't end with slash
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const qrUrl = `${cleanBaseUrl}${scanRoute}`;
    console.log('📱 QR Code URL (from .env):', qrUrl);
    return qrUrl;
  }

  // Priority 2: Client-side - use current origin (fallback if BASE_URL not set)
  // CRITICAL: User must access page via network IP for QR code to work on mobile!
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    
    // Warn if using localhost (QR code won't work on mobile)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.warn(
        '⚠️ QR Code Warning: You are accessing via localhost. ' +
        'Set NEXT_PUBLIC_BASE_URL in .env file or access via network IP instead. ' +
        'Example: http://192.168.1.210:3000'
      );
    }
    
    const qrUrl = `${origin}${scanRoute}`;
    console.log('📱 QR Code URL (from current origin):', qrUrl);
    return qrUrl;
  }

  // Fallback: relative path (won't work in QR codes, but better than error)
  console.warn('⚠️ QR Code: Using relative path - may not work. Set NEXT_PUBLIC_BASE_URL in .env');
  return scanRoute;
}
