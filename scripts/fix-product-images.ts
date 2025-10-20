// scripts/update-product-images.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cloudinary base URL with your cloud name
const CLOUDINARY_BASE =
  'https://res.cloudinary.com/diergd8rm/image/upload/v1/forge-steel';

// Using a placeholder image URL that will work for all products
const PLACEHOLDER_IMAGE = `${CLOUDINARY_BASE}/products/placeholder-ring.jpg`;

async function updateProductImages() {
  console.log('🔄 Starting to update product images...\n');

  try {
    // Get all products from database
    const products = await prisma.product.findMany();

    console.log(`Found ${products.length} products to update\n`);

    // Update each product
    for (const product of products) {
      console.log(`Updating: ${product.name}`);

      // Update with same Cloudinary URL for main image and all images in array
      await prisma.product.update({
        where: { id: product.id },
        data: {
          image: PLACEHOLDER_IMAGE,
          images: [
            PLACEHOLDER_IMAGE,
            PLACEHOLDER_IMAGE,
            PLACEHOLDER_IMAGE,
            PLACEHOLDER_IMAGE,
            PLACEHOLDER_IMAGE,
          ],
        },
      });

      console.log(`✅ Updated: ${product.name}`);
    }

    console.log('\n✅ All products updated successfully!');
    console.log(`\nAll products now use: ${PLACEHOLDER_IMAGE}`);
  } catch (error) {
    console.error('❌ Error updating products:', error);
    throw error;
  }
}

updateProductImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🔌 Disconnected from database');
  });
