import { prisma } from '@/lib/prisma';

/**
 * Validates if a user still exists in the database
 * This should be called from API routes or server components, not in middleware
 */
export async function validateUserExists(userId: string): Promise<boolean> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }, // Only select id for performance
    });

    return !!existingUser;
  } catch (error) {
    console.error('Error validating user existence:', error);
    return false;
  }
}

/**
 * Gets user data with role validation
 * Use this in protected API routes to ensure user still exists and has correct permissions
 */
export async function getUserWithValidation(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}
