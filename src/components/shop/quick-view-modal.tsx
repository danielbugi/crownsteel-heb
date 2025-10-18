'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ExternalLink, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  description?: string;
  inStock: boolean;
  featured: boolean;
  inventory?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewModal({
  product,
  open,
  onOpenChange,
}: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
    toast.success(`Added ${quantity} item(s) to cart!`);
    onOpenChange(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  const displayImages =
    product.images.length > 0 ? product.images : [product.image];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary/30">
              <Image
                src={displayImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.featured && (
                  <Badge className="bg-purple-600 text-white border-none">
                    Featured
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white border-none">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-gold-500 ring-2 ring-gold-500/50'
                        : 'border-border hover:border-gold-400'
                    }`}
                  >
                    <Image
                      src={img}
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

          {/* Right - Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-sm uppercase tracking-wider text-gold-600 font-semibold mb-2">
              {product.category.name}
            </p>

            {/* Product Name */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.inStock ? (
              <p className="text-sm text-green-600 mb-4 font-medium flex items-center gap-2">
                <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                In Stock
                {product.inventory && product.inventory <= 5 && (
                  <span className="text-orange-600 ml-2">
                    (Only {product.inventory} left)
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm text-red-600 mb-4 font-medium flex items-center gap-2">
                <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                Out of Stock
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>
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
                    setQuantity(
                      Math.min(product.inventory || 999, quantity + 1)
                    )
                  }
                  disabled={quantity >= (product.inventory || 999)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-auto">
              <Button
                size="lg"
                className="w-full bg-gold-600 hover:bg-gold-700 text-white font-semibold"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href={`/shop/${product.slug}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    toast.success('Added to wishlist!');
                  }}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
