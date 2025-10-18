import { prisma } from '@/lib/prisma';
import { ProductGrid } from '@/components/shop/product-grid';
import { CategoryFilter } from '@/components/shop/category-filter';
import { serializeProducts } from '@/lib/serialize';

export const metadata = {
  title: "Shop - Premium Men's Rings",
  description: 'Browse our collection of handcrafted rings and jewelry',
};

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Serialize Decimal to number
  return serializeProducts(products);
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  return categories;
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className=" text-white py-20">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 ">
            Our Collection
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover handcrafted rings that define your style
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:w-64 flex-shrink-0">
              <CategoryFilter categories={categories} />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {products.length} products
                </p>
              </div>
              <ProductGrid products={products} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
