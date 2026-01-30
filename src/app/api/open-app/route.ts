import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for open app commands
// In production, you might want to use Redis or a database
const openAppCommands = new Map<string, { timestamp: number; returnUrl?: string }>();

// Clean up old commands (older than 30 seconds)
function cleanupOldCommands() {
  const now = Date.now();
  for (const [sessionId, command] of openAppCommands.entries()) {
    if (now - command.timestamp > 30000) {
      openAppCommands.delete(sessionId);
    }
  }
}

// Generate or get session ID from request
function getSessionId(req: NextRequest): string {
  // Try to get from cookie first
  const cookieSessionId = req.cookies.get('open_app_session')?.value;
  if (cookieSessionId) {
    return cookieSessionId;
  }
  
  // Generate new session ID
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return newSessionId;
}

// POST: Desktop triggers "open app" command
export async function POST(req: NextRequest) {
  try {
    cleanupOldCommands();
    
    const sessionId = getSessionId(req);
    const body = await req.json().catch(() => ({}));
    const returnUrl = body.returnUrl || '';
    
    // Store the command
    openAppCommands.set(sessionId, {
      timestamp: Date.now(),
      returnUrl: returnUrl
    });
    
    console.log(`📱 Open app command triggered for session: ${sessionId}`);
    
    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      message: 'Open app command sent. Make sure your mobile device has the page open.'
    });
  } catch (error: any) {
    console.error('Error in POST /api/open-app:', error);
    return NextResponse.json(
      { error: 'Failed to trigger open app', message: error.message },
      { status: 500 }
    );
  }
}

// GET: Mobile checks for "open app" command
export async function GET(req: NextRequest) {
  try {
    cleanupOldCommands();
    
    const sessionId = req.nextUrl.searchParams.get('sessionId') || 
                     req.cookies.get('open_app_session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({
        command: null,
        sessionId: null
      });
    }
    
    const command = openAppCommands.get(sessionId);
    
    if (command) {
      // Delete command after reading (one-time use)
      openAppCommands.delete(sessionId);
      
      return NextResponse.json({
        command: 'open_app',
        returnUrl: command.returnUrl || '',
        timestamp: command.timestamp
      });
    }
    
    return NextResponse.json({
      command: null,
      sessionId: sessionId
    });
  } catch (error: any) {
    console.error('Error in GET /api/open-app:', error);
    return NextResponse.json(
      { error: 'Failed to check open app command', message: error.message },
      { status: 500 }
    );
  }
}
