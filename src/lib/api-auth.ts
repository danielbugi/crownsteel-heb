// src/lib/api-auth.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Check if user is authenticated and has ADMIN role
 * Returns unauthorized response if not admin
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  const userRole = session.user.role;
  if (userRole !== 'ADMIN') {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}

/**
 * Check if user is authenticated (any role)
 */
export async function requireAuth() {
  const session = await auth();

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}
