import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const startTime = Date.now();
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    if (!session || !session.user) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const userRole = session.user.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  const response = NextResponse.next();

  // Add performance header for API routes (but don't save to DB here)
  if (pathname.startsWith('/api/')) {
    const duration = Date.now() - startTime;
    response.headers.set('X-Response-Time', `${duration}ms`);

    // Add custom header so API routes can save metrics themselves
    response.headers.set('X-Request-Start', startTime.toString());

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${req.method} ${pathname} - ${duration}ms`);
    }
  }

  return response;
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/products/:path*',
    '/api/search/:path*',
  ],
};
