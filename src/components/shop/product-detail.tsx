// src/components/shop/product-detail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShoppingCart,
  Truck,
  Shield,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
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
    // CRITICAL: Block checkout if product has variants but none is selected
    if (
      product.hasVariants &&
      product.variants &&
      product.variants.length > 0 &&
      !selectedVariant
    ) {
      toast.error('Please select a variant before adding to cart');
      return;
    }

    const availableInventory =
      product.hasVariants && selectedVariant
        ? selectedVariant.inventory
        : product.inventory;

    if (!product.inStock || availableInventory === 0) {
      toast.error('This item is currently out of stock');
      return;
    }

    if (quantity > availableInventory) {
      toast.error(`Only ${availableInventory} available`);
      return;
    }

    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      variantId: selectedVariant?.id || null,
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

  // Check if add to cart button should be disabled
  const isAddToCartDisabled = () => {
    if (!product.inStock) return true;
    if (
      product.hasVariants &&
      product.variants &&
      product.variants.length > 0 &&
      !selectedVariant
    )
      return true;
    const availableInventory =
      product.hasVariants && selectedVariant
        ? selectedVariant.inventory
        : product.inventory;
    if (availableInventory === 0) return true;
    return false;
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
              {formatPrice(
                selectedVariant
                  ? selectedVariant.price ||
                      product.price + (selectedVariant.priceAdjustment || 0)
                  : product.price
              )}
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

          {/* Variants Section - CRITICAL UI ELEMENT */}
          {product.hasVariants &&
            product.variants &&
            product.variants.length > 0 && (
              <div className="mb-6 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="font-medium text-sm text-muted-foreground">
                    {product.variantLabel || 'Variant'} selection required
                  </span>
                </div>

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
              <span className="w-16 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const maxQty =
                    product.hasVariants && selectedVariant
                      ? selectedVariant.inventory
                      : product.inventory;
                  setQuantity(Math.min(maxQty, quantity + 1));
                }}
                disabled={
                  quantity >=
                  (product.hasVariants && selectedVariant
                    ? selectedVariant.inventory
                    : product.inventory)
                }
              >
                +
              </Button>
            </div>
          </div>

          {/* Stock Info */}
          <div className="mb-6">
            {product.hasVariants && selectedVariant ? (
              <Badge
                variant={
                  selectedVariant.inventory > 0 ? 'default' : 'destructive'
                }
              >
                {selectedVariant.inventory > 0
                  ? `${selectedVariant.inventory} in stock`
                  : 'Out of stock'}
              </Badge>
            ) : (
              !product.hasVariants && (
                <Badge
                  variant={product.inventory > 0 ? 'default' : 'destructive'}
                >
                  {product.inventory > 0
                    ? `${product.inventory} in stock`
                    : 'Out of stock'}
                </Badge>
              )
            )}
          </div>

          {/* Add to Cart Button - BLOCKED if variants required but not selected */}
          <Button
            size="lg"
            className="w-full mb-6"
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled()}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isAddToCartDisabled()
              ? product.hasVariants &&
                product.variants &&
                product.variants.length > 0 &&
                !selectedVariant
                ? `Choose ${product.variantLabel || 'Variant'} First`
                : 'Out of Stock'
              : 'Add to Cart'}
          </Button>

          {/* Product Features */}
          <div className="space-y-4">
            {product.freeShipping && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-accent" />
                <span>Free shipping on this item</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-accent" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
