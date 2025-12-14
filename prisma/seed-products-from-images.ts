import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive product seeding from images...');

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
    console.log('✅ Default settings created');
  }

  // Create Categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'rings' },
      update: {},
      create: {
        name: 'Signature Rings',
        slug: 'rings',
        description: 'Bold statement pieces for the modern gentleman',
        image: '/images/category_rings.png',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'chains' },
      update: {},
      create: {
        name: 'Chains',
        slug: 'chains',
        description: 'Elegant chains and necklaces',
        image: '/images/category-necklaces.png',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bracelets' },
      update: {},
      create: {
        name: 'Bracelets',
        slug: 'bracelets',
        description: 'Sophisticated wrist accessories',
        image: '/images/categories/bracelets.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pendants' },
      update: {},
      create: {
        name: 'Pendants',
        slug: 'pendants',
        description: 'Symbolic pendant designs',
        image: '/images/categories/pendants.jpg',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Find categories for product creation
  const ringsCategory = categories.find((c) => c.slug === 'rings')!;
  const chainsCategory = categories.find((c) => c.slug === 'chains')!;
  const braceletsCategory = categories.find((c) => c.slug === 'bracelets')!;
  const pendantsCategory = categories.find((c) => c.slug === 'pendants')!;

  // Product names and descriptions for variety
  const ringNames = [
    'Obsidian Steel Ring',
    'Damascus Steel Band',
    'Carbon Fiber Elite',
    'Titanium Commander',
    'Black Tungsten Ring',
    'Silver Shadow Band',
    'Iron Warrior Ring',
    'Steel Guardian Band',
    'Midnight Forge Ring',
  ];

  const chainNames = [
    'Steel Chain Classic',
    'Cuban Link Chain',
    'Box Chain Premium',
    'Rope Chain Elite',
    'Snake Chain Refined',
    'Wheat Chain Design',
    'Figaro Chain Bold',
    'Curb Chain Heavy',
    'Byzantine Chain',
    'Franco Chain Style',
    'Spiga Chain Deluxe',
    'Ball Chain Modern',
  ];

  const braceletNames = [
    'Steel Link Bracelet',
    'Leather Steel Cuff',
    'Chain Bracelet Bold',
    'Magnetic Clasp Bracelet',
    'Braided Steel Wristband',
  ];

  const pendantNames = [
    'Cross Pendant Steel',
    'Anchor Symbol Pendant',
    'Shield Design Pendant',
    'Geometric Steel Pendant',
  ];

  const descriptions = [
    'A bold statement piece crafted from premium materials with a brushed matte finish. Perfect for the modern gentleman who values durability and style.',
    'Hand-forged design featuring a mesmerizing pattern created through ancient metalworking techniques.',
    'Cutting-edge design combining aerospace-grade materials with surgical steel. Ultra-lightweight yet incredibly strong.',
    'Classic design with a timeless comfort-fit. A symbol of everlasting commitment and sophisticated taste.',
    'Durable construction with a sophisticated design. Perfect for everyday wear and special occasions.',
    'Elegant piece featuring intricate details and premium finish. Designed for the discerning gentleman.',
    'Modern design with traditional craftsmanship. Built to last and made to impress.',
    'Timeless style meets contemporary design in this exceptional piece.',
  ];

  // Helper function to generate random price
  const getRandomPrice = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Helper function to get random description
  const getRandomDescription = () => {
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  console.log('💍 Creating ring products...');
  const ringProducts = [];
  for (let i = 1; i <= 9; i++) {
    const price = getRandomPrice(599, 1499);
    const comparePrice = Math.floor(price * 1.3);
    const mainImage = `/images/products/rings/ring-${i}.png`;
    const product = {
      name: ringNames[i - 1],
      slug: `ring-${i}`,
      description: getRandomDescription(),
      price,
      comparePrice,
      image: mainImage,
      images: [
        mainImage,
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
      ],
      inStock: true,
      featured: i <= 3, // First 3 are featured
      freeShipping: price > 500,
      inventory: getRandomPrice(5, 25),
      categoryId: ringsCategory.id,
      sku: `RING-${String(i).padStart(3, '0')}`,
      lowStockThreshold: 5,
      reorderPoint: 10,
      reorderQuantity: 20,
    };
    ringProducts.push(product);
  }

  console.log('⛓️ Creating chain products...');
  const chainProducts = [];
  for (let i = 1; i <= 12; i++) {
    const price = getRandomPrice(499, 1299);
    const comparePrice = Math.floor(price * 1.35);
    const extension =
      i === 1
        ? 'png'
        : i === 2
          ? 'png'
          : i === 3
            ? 'png'
            : i === 6
              ? 'png'
              : 'jpg';
    const mainImage = `/images/products/chains/chain-${i}.${extension}`;
    const product = {
      name: chainNames[i - 1],
      slug: `chain-${i}`,
      description: getRandomDescription(),
      price,
      comparePrice,
      image: mainImage,
      images: [
        mainImage,
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
      ],
      inStock: true,
      featured: i <= 4, // First 4 are featured
      freeShipping: price > 400,
      inventory: getRandomPrice(8, 30),
      categoryId: chainsCategory.id,
      sku: `CHAIN-${String(i).padStart(3, '0')}`,
      lowStockThreshold: 8,
      reorderPoint: 15,
      reorderQuantity: 30,
    };
    chainProducts.push(product);
  }

  console.log('📿 Creating bracelet products...');
  const braceletProducts = [];
  for (let i = 1; i <= 5; i++) {
    const price = getRandomPrice(399, 999);
    const comparePrice = Math.floor(price * 1.4);
    const extension =
      i === 1
        ? 'png'
        : i === 2
          ? 'jpeg'
          : i === 3
            ? 'jpg'
            : i === 4
              ? 'png'
              : 'png';
    const mainImage = `/images/products/bracelets/bracelet-${i}.${extension}`;
    const product = {
      name: braceletNames[i - 1],
      slug: `bracelet-${i}`,
      description: getRandomDescription(),
      price,
      comparePrice,
      image: mainImage,
      images: [
        mainImage,
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
      ],
      inStock: true,
      featured: i <= 2, // First 2 are featured
      freeShipping: price > 350,
      inventory: getRandomPrice(10, 20),
      categoryId: braceletsCategory.id,
      sku: `BRACELET-${String(i).padStart(3, '0')}`,
      lowStockThreshold: 5,
      reorderPoint: 10,
      reorderQuantity: 25,
    };
    braceletProducts.push(product);
  }

  console.log('🔱 Creating pendant products...');
  const pendantProducts = [];
  for (let i = 1; i <= 4; i++) {
    const price = getRandomPrice(299, 799);
    const comparePrice = Math.floor(price * 1.45);
    const mainImage = `/images/products/pendants/pendant-${i}.jpg`;
    const product = {
      name: pendantNames[i - 1],
      slug: `pendant-${i}`,
      description: getRandomDescription(),
      price,
      comparePrice,
      image: mainImage,
      images: [
        mainImage,
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
        '/images/products/demo-md.png',
      ],
      inStock: true,
      featured: i <= 2, // First 2 are featured
      freeShipping: price > 300,
      inventory: getRandomPrice(12, 25),
      categoryId: pendantsCategory.id,
      sku: `PENDANT-${String(i).padStart(3, '0')}`,
      lowStockThreshold: 6,
      reorderPoint: 12,
      reorderQuantity: 20,
    };
    pendantProducts.push(product);
  }

  // Combine all products
  const allProducts = [
    ...ringProducts,
    ...chainProducts,
    ...braceletProducts,
    ...pendantProducts,
  ];

  console.log(`📦 Creating ${allProducts.length} products...`);

  // Insert products
  let createdCount = 0;
  for (const productData of allProducts) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData,
    });
    createdCount++;
    if (createdCount % 10 === 0) {
      console.log(`   ✓ Created ${createdCount} products...`);
    }
  }

  console.log('\n✅ Seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Rings: ${ringProducts.length}`);
  console.log(`   - Chains: ${chainProducts.length}`);
  console.log(`   - Bracelets: ${braceletProducts.length}`);
  console.log(`   - Pendants: ${pendantProducts.length}`);
  console.log(`   - Total Products: ${allProducts.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
