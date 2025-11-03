// scripts/check-users.ts
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking database users...');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    console.log(`📊 Found ${users.length} users in database:`);
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ID: ${user.id}, Email: ${user.email}, Name: ${user.name}`
      );
    });

    if (users.length === 0) {
      console.log(
        '⚠️ No users found! This explains the foreign key constraint error.'
      );
      console.log('💡 Solution: Create a user account or run the seed script.');
    }

    const wishlists = await prisma.wishlist.findMany({
      select: {
        userId: true,
        productId: true,
      },
    });

    console.log(`📊 Found ${wishlists.length} wishlist items in database`);
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
