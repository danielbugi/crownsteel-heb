import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create default settings if they don't exist
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        siteName: 'Forge & Steel',
        siteDescription: "Premium Men's Jewelry",
        contactEmail: 'contact@forgesteel.com',
        contactPhone: '+972-50-123-4567',
        address: 'Online E-commerce Store',
        currency: 'ILS',
        currencySymbol: '₪',
        taxRate: 18,

        // Email Settings
        smtpFromEmail: 'contact@forgesteel.com',
        smtpReplyToEmail: null,
        emailNotificationsEnabled: true,
        adminNotificationEmail: 'admin@forgesteel.com',

        // Shipping Settings
        shippingCost: 20,
        freeShippingThreshold: 350,
        shippingDescription: 'Standard shipping within Israel',
        processingTime: '2-3 business days',
      },
    });
    console.log('Default settings created');
  }

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'signature-rings' },
      update: {},
      create: {
        name: 'Signature Rings',
        slug: 'signature-rings',
        description: 'Bold statement pieces for the modern gentleman',
        image: '/images/category_rings.png',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'wedding-bands' },
      update: {},
      create: {
        name: 'Wedding Bands',
        slug: 'wedding-bands',
        description: 'Timeless symbols of commitment',
        image: '/images/wedding-rings.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'necklaces' },
      update: {},
      create: {
        name: 'Necklaces',
        slug: 'necklaces',
        description: 'Elegant chains and pendants',
        image: '/images/category-necklaces.png',
      },
    }),
  ]);

  console.log('Categories created:', categories.length);

  // Create 5 products
  const products = [
    {
      name: 'Obsidian Steel Ring',
      slug: 'obsidian-steel-ring',
      description:
        'A bold statement piece crafted from premium tungsten carbide with a brushed matte finish. Perfect for the modern gentleman who values durability and style.',
      price: 899,
      comparePrice: 1299,
      image: '/images/product-1.jpg',
      images: [
        '/images/product-1.jpg',
        '/images/rings.jpg',
        '/images/ring-4.jpg',
      ],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 15,
      categoryId: categories[0].id,
      sku: 'OSR-001',
      lowStockThreshold: 5,
      reorderPoint: 10,
      reorderQuantity: 20,
    },
    {
      name: 'Damascus Steel Band',
      slug: 'damascus-steel-band',
      description:
        'Hand-forged Damascus steel ring featuring a mesmerizing wave pattern created through ancient metalworking techniques.',
      price: 1299,
      comparePrice: 1799,
      image: '/images/product-2.jpg',
      images: ['/images/product-2.jpg', '/images/rings.jpg'],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 8,
      categoryId: categories[0].id,
      sku: 'DSB-001',
      lowStockThreshold: 3,
      reorderPoint: 8,
      reorderQuantity: 15,
    },
    {
      name: 'Carbon Fiber Elite',
      slug: 'carbon-fiber-elite',
      description:
        'Cutting-edge design combining aerospace-grade carbon fiber with surgical steel. Ultra-lightweight yet incredibly strong.',
      price: 799,
      comparePrice: 999,
      image: '/images/product-3.jpg',
      images: ['/images/product-3.jpg', '/images/ring-4.jpg'],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 20,
      categoryId: categories[0].id,
      sku: 'CFE-001',
      lowStockThreshold: 8,
      reorderPoint: 15,
      reorderQuantity: 30,
    },
    {
      name: 'Eternal Gold Band',
      slug: 'eternal-gold-band',
      description:
        'Classic 14K yellow gold wedding band with a timeless comfort-fit design. A symbol of everlasting commitment.',
      price: 2499,
      comparePrice: 3199,
      image: '/images/wedding-rings.jpg',
      images: ['/images/wedding-rings.jpg', '/images/rings.jpg'],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 12,
      categoryId: categories[1].id,
      sku: 'EGB-001',
      lowStockThreshold: 5,
      reorderPoint: 10,
      reorderQuantity: 20,
    },
    {
      name: 'Steel Chain Classic',
      slug: 'steel-chain-classic',
      description:
        'Durable stainless steel chain necklace with a sophisticated box link design. Perfect for everyday wear.',
      price: 599,
      comparePrice: 899,
      image: '/images/category-necklaces.png',
      images: ['/images/category-necklaces.png'],
      inStock: true,
      featured: false,
      freeShipping: true,
      inventory: 25,
      categoryId: categories[2].id,
      sku: 'SCC-001',
      lowStockThreshold: 10,
      reorderPoint: 20,
      reorderQuantity: 40,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }

  console.log('Products created:', products.length);
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
