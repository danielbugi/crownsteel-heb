// scripts/check-inventory-fields.ts
// Run this to verify the migration worked correctly

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkInventoryFields() {
  try {
    console.log('🔍 Checking inventory fields in products...\n');

    // Get a sample of products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        inventory: true,
        lowStockThreshold: true,
        reorderPoint: true,
        reorderQuantity: true,
        sku: true,
      },
      take: 10,
    });

    if (products.length === 0) {
      console.log('⚠️  No products found in database');
      return;
    }

    console.log(`✅ Found ${products.length} products\n`);
    console.log('📦 Sample products with inventory fields:\n');

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Current Stock: ${product.inventory}`);
      console.log(`   Low Stock Threshold: ${product.lowStockThreshold}`);
      console.log(`   Reorder Point: ${product.reorderPoint}`);
      console.log(`   Reorder Quantity: ${product.reorderQuantity}`);
      console.log(`   SKU: ${product.sku || 'Not set'}\n`);
    });

    // Check for products with low stock
    const lowStockProducts = products.filter(
      (p) => p.inventory <= p.lowStockThreshold && p.inventory > 0
    );

    const outOfStockProducts = products.filter((p) => p.inventory === 0);

    console.log('📊 Stock Status Summary:');
    console.log(`   Total products checked: ${products.length}`);
    console.log(`   Low stock: ${lowStockProducts.length}`);
    console.log(`   Out of stock: ${outOfStockProducts.length}`);
    console.log(
      `   In stock: ${products.length - lowStockProducts.length - outOfStockProducts.length}\n`
    );

    console.log('✅ All inventory fields are present and working!');
    console.log('🎉 You can now use the inventory management system!');
  } catch (error) {
    console.error('❌ Error checking inventory fields:', error);
    console.log('\n💡 This might mean:');
    console.log("   1. The migration hasn't been run yet");
    console.log('   2. Prisma Client needs to be regenerated');
    console.log('\n🔧 Try running:');
    console.log('   npx prisma generate');
    console.log('   npx prisma migrate dev --name add_inventory_management');
  } finally {
    await prisma.$disconnect();
  }
}

checkInventoryFields();
