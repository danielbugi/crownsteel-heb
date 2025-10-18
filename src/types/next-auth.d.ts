import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
    } & DefaultSession['user'];
    needsWishlistSync?: boolean; // ✅ Add this
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    needsWishlistSync?: boolean;
  }
}
