import { ProductCard } from './product-card';
import { ProductCardList } from './product-card-list';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  freeShipping: boolean;
  category: {
    name: string;
    slug: string;
  };
}

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid-2' | 'grid-3' | 'grid-4' | 'list';
}

export function ProductGrid({
  products,
  viewMode = 'grid-3',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found</p>
      </div>
    );
  }

  // List view for future implementation
  if (viewMode === 'list') {
    return (
      <div>
        {products.map((product, index) => (
          <ProductCardList
            key={product.id}
            product={product}
            isFirst={index === 0}
          />
        ))}
      </div>
    );
  }

  // Determine grid columns based on view mode
  const gridCols = {
    'grid-2': 'grid-cols-1 sm:grid-cols-2',
    'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[viewMode];

  // Grid view (default)
  return (
    <div className={`grid ${gridCols} gap-2`}>
      {products.map((product) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <ProductCard
          key={product.id}
          product={product as any}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
