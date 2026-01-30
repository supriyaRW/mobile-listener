/**
 * Application configuration from environment variables
 * All paths and URLs are centralized here for easy management
 */

export const config = {
  // Base URL - leave empty for relative paths
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  
  // APK configuration
  apk: {
    fileName: process.env.NEXT_PUBLIC_APK_FILE_NAME || 'app-release.apk',
    apiRoute: process.env.NEXT_PUBLIC_APK_API_ROUTE || '/api/apk',
    downloadRoute: process.env.NEXT_PUBLIC_DOWNLOAD_ROUTE || '/download',
  },
  
  // Helper function to get full URL (uses relative path if baseUrl is empty)
  getUrl: (path: string): string => {
    if (config.baseUrl) {
      return `${config.baseUrl}${path}`;
    }
    // Return relative path - browser will use current origin
    return path;
  },
  
  // Get download URL for QR code
  getDownloadUrl: (): string => {
    return config.getUrl(config.apk.downloadRoute);
  },
  
  // Get APK API URL (for downloading APK file)
  getApkApiUrl: (): string => {
    // Priority: Use BASE_URL from .env if set
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').trim();
    if (baseUrl) {
      const cleanBaseUrl = baseUrl.replace(/\/$/, '');
      const apiUrl = `${cleanBaseUrl}${config.apk.apiRoute}`;
      console.log('📥 APK Download URL (from .env):', apiUrl);
      return apiUrl;
    }
    
    // Fallback: Use current origin (client-side only)
    if (typeof window !== 'undefined') {
      const apiUrl = `${window.location.origin}${config.apk.apiRoute}`;
      console.log('📥 APK Download URL (from current origin):', apiUrl);
      return apiUrl;
    }
    
    // Server-side: return relative path
    return config.apk.apiRoute;
  },
};
