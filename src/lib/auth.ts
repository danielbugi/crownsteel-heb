import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // Fix for UntrustedHost error
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name!,
          image: user.image || undefined,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;

        session.needsWishlistSync = token.needsWishlistSync as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      // On sign in, add user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.needsWishlistSync = true;
      }

      // בדוק אם המשתמש עדיין קיים בבסיס הנתונים
      if (token.id) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: token.id as string },
          });

          if (!existingUser) {
            console.log('🚨 JWT user not found in DB, invalidating token');
            return {}; // מחזיר token ריק שיגרום ל-logout
          }
        } catch (error) {
          console.log('⚠️ Error checking user existence:', error);
        }
      }

      return token;
    },
  },
  pages: {
    signIn: '/',
  },
});
