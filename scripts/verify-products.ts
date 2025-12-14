import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Database Verification Report\n');

  // Get total counts
  const totalCategories = await prisma.category.count();
  const totalProducts = await prisma.product.count();

  console.log(`Total Categories: ${totalCategories}`);
  console.log(`Total Products: ${totalProducts}\n`);

  // Get products per category
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  console.log('Products per Category:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  categories.forEach((cat) => {
    console.log(`  ${cat.name.padEnd(20)} ${cat._count.products} products`);
  });

  console.log('\n✅ Verification complete!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
