// import { auth } from '@/lib/auth';
// import { NextResponse } from 'next/server';

// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   const session = req.auth;

//   // Check if the route is an admin route
//   if (pathname.startsWith('/admin')) {
//     // If no session, redirect to home
//     if (!session || !session.user) {
//       return NextResponse.redirect(new URL('/', req.url));
//     }

//     // Check if user has ADMIN role
//     const userRole = (session.user as any)?.role;
//     if (userRole !== 'ADMIN') {
//       return NextResponse.redirect(new URL('/', req.url));
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ['/admin/:path*'],
// };

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const startTime = Date.now();
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    // If no session, redirect to home
    if (!session || !session.user) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Check if user has ADMIN role
    const userRole = (session.user as any)?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  const response = NextResponse.next();

  // Add performance monitoring for API routes
  if (pathname.startsWith('/api/')) {
    const duration = Date.now() - startTime;
    response.headers.set('X-Response-Time', `${duration}ms`);

    // Log API performance in development
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
