import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminApiRoute = pathname.startsWith('/api/admin');

  if (isAdminRoute || isAdminApiRoute) {
    const session = await auth();

    // Not logged in - redirect to home for pages, return 401 for API
    if (!session || !session.user) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Not an admin - redirect to home for pages, return 403 for API
    if (session.user.role !== 'ADMIN') {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
