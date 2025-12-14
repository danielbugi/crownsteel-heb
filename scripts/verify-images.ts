import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Verifying Products with Multiple Images\n');

  // Get a sample of products to verify images
  const products = await prisma.product.findMany({
    take: 5,
    select: {
      name: true,
      slug: true,
      images: true,
    },
  });

  console.log('Sample Products with Image Counts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  products.forEach((product) => {
    console.log(`  ${product.name.padEnd(25)} ${product.images.length} images`);
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
