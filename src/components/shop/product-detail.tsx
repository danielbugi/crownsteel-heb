'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'react-hot-toast';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    image: string;
    images: string[];
    inStock: boolean;
    featured: boolean;
    freeShipping: boolean;
    inventory: number;
    hasVariants?: boolean;
    variantLabel?: string;
    variantLabelHe?: string;
    variants?: any[];
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = () => {
    if (product.hasVariants && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    const availableInventory = product.hasVariants
      ? selectedVariant?.inventory
      : product.inventory;

    if (quantity > availableInventory) {
      toast.error(`Only ${availableInventory} available`);
      return;
    }

    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      variantId: selectedVariant?.id || null, // ADD THIS
      name:
        product.name + (selectedVariant ? ` - ${selectedVariant.name}` : ''),
      price: selectedVariant
        ? selectedVariant.price ||
          product.price + (selectedVariant.priceAdjustment || 0)
        : product.price,
      image: product.image,
      quantity,
    });

    toast.success(`Added ${quantity} item(s) to cart`);
    toggleCart();
  };
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  // Ensure main image is first in the array
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/shop"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-lg px-3 py-1">
                Save {discount}%
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-lg border-2 transition-all',
                    selectedImage === image
                      ? 'border-accent ring-2 ring-accent'
                      : 'border-border hover:border-accent/50'
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-sm text-muted-foreground hover:text-accent"
            >
              {product.category.name}
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          <Separator className="my-6" />

          {product.hasVariants &&
            product.variants &&
            product.variants.length > 0 && (
              <div className="mb-6">
                <ProductVariantSelector
                  variants={product.variants}
                  basePrice={product.price}
                  variantLabel={product.variantLabel}
                  variantLabelHe={product.variantLabelHe}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="text-lg font-medium w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(Math.min(product.inventory, quantity + 1))
                }
                disabled={quantity >= product.inventory}
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                ({product.inventory} available)
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-4"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          {/* Product Features */}
          <div className="space-y-3 mt-6">
            {product.freeShipping && (
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-accent" />
                <span>Free shipping on this item</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-accent" />
              <span>Lifetime warranty on craftsmanship</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
