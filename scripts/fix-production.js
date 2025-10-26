#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing production issues...');

  try {
    // Update any products in database that still reference ring-1.jpg
    console.log('📦 Updating product images in database...');

    const updateResult = await prisma.product.updateMany({
      where: {
        OR: [
          { image: '/images/ring-1.jpg' },
          { images: { has: '/images/ring-1.jpg' } },
        ],
      },
      data: {
        image: '/images/ring-4.jpg',
        images: [
          '/images/ring-4.jpg',
          '/images/ring-black-bg.png',
          '/images/rings.jpg',
        ],
      },
    });

    console.log(`✅ Updated ${updateResult.count} products`);

    // Clean up any build artifacts
    console.log('🧹 Cleaning build cache...');
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ Cleared .next directory');
    }

    console.log('✨ Production fixes completed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npm run build');
    console.log('2. Run: npm start');
    console.log('');
  } catch (error) {
    console.error('❌ Error fixing production issues:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
