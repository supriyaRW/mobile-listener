import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET() {
  try {
    // Get APK file name from environment variable or use default
    const apkFileName = process.env.NEXT_PUBLIC_APK_FILE_NAME || "app-release.apk";
    
    // Path to APK in public folder
    const apkPath = join(process.cwd(), "public", apkFileName);
    
    // Check if APK exists
    if (!existsSync(apkPath)) {
      return NextResponse.json(
        { 
          error: "APK not found",
          message: `Please build the APK first using: flutter build apk --release and place it as ${apkFileName} in the public folder`,
          path: apkPath,
          expectedFileName: apkFileName
        },
        { status: 404 }
      );
    }

    // Read the APK file
    const apkBuffer = await readFile(apkPath);
    
    // Convert Buffer to a proper ArrayBuffer by creating a new one
    // This avoids SharedArrayBuffer type issues
    const arrayBuffer = apkBuffer.buffer.slice(
      apkBuffer.byteOffset,
      apkBuffer.byteOffset + apkBuffer.byteLength
    ) as ArrayBuffer;
    
    // Create Blob from ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: "application/vnd.android.package-archive" });
    
    // Create Response with proper headers for mobile download
    return new Response(blob, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="${apkFileName}"`,
        "Content-Length": apkBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        // Additional headers for mobile browsers
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error serving APK:", errorMessage);
    return NextResponse.json(
      { error: "Failed to serve APK", message: errorMessage },
      { status: 500 }
    );
  }
}
