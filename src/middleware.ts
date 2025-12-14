import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware is currently disabled for admin auth
// TODO: Re-enable when ready to protect admin routes
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match routes that require auth checks
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
