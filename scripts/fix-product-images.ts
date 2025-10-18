// scripts/fix-product-images.ts

import { prisma } from '../src/lib/prisma';

async function fixProductImages() {
  console.log('🔄 Updating product images to Cloudinary URLs...');

  const products = await prisma.product.findMany();

  for (const product of products) {
    // Skip if already a Cloudinary URL
    if (product.image.startsWith('http')) {
      console.log(`✅ ${product.name} - already has valid URL`);
      continue;
    }

    // Replace local path with placeholder Cloudinary URL
    // YOU NEED TO UPLOAD YOUR IMAGES TO CLOUDINARY FIRST
    const cloudinaryUrl = `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/products/${product.slug}.jpg`;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        image: cloudinaryUrl,
        images: [cloudinaryUrl], // Update images array too
      },
    });

    console.log(`✅ Updated ${product.name}`);
  }

  console.log('✅ All products updated!');
}

fixProductImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
