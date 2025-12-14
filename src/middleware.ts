import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Enable Edge Runtime for faster cold starts and lower latency
export const runtime = 'experimental-edge';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Early return for non-admin routes to minimize processing
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Fast path: Check session existence first (most common case)
    if (!session?.user) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Only check role if session exists
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Return response without additional headers for better performance
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Only match routes that require auth checks
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
