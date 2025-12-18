// src/components/shop/product-detail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Truck, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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
    sku?: string;
    hasVariants?: boolean;
    variantLabel?: string;
    variants?: Array<{
      id: string;
      name: string;
      sku: string;
      price?: number;
      priceAdjustment?: number;
      inventory: number;
      inStock: boolean;
      isDefault: boolean;
      sortOrder: number;
    }>;
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
  type VariantType = NonNullable<ProductDetailProps['product']['variants']>[0];
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(
    null
  );
  const { addItem, addItemSilently } = useCartStore();
  const router = useRouter();

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
      toast.error('This item is currently unavailable');
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
  };

  const handleBuyNow = () => {
    // CRITICAL: Block checkout if product has variants but none is selected
    if (
      product.hasVariants &&
      product.variants &&
      product.variants.length > 0 &&
      !selectedVariant
    ) {
      toast.error('Please select a variant before proceeding');
      return;
    }

    const availableInventory =
      product.hasVariants && selectedVariant
        ? selectedVariant.inventory
        : product.inventory;

    if (!product.inStock || availableInventory === 0) {
      // translate it to english
      toast.error('This item is currently unavailable');
      return;
    }

    if (quantity > availableInventory) {
      toast.error(`Only ${availableInventory} available`);
      return;
    }

    // Add item to cart without opening sidebar
    addItemSilently({
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

    // Navigate to checkout immediately
    router.push('/checkout');
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
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 font-medium"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-200  shadow-lg">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1 shadow-md">
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
                    'relative aspect-square overflow-hidden border-2 transition-all rounded-md shadow-sm',
                    selectedImage === image
                      ? 'border-gray-800 ring-2 ring-gray-800'
                      : 'border-gray-200 hover:border-gray-400'
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
          {/* <div className="mb-4">
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-sm text-muted-foreground hover:text-accent"
            >
              {product.category.name}
            </Link>
          </div> */}

          <h1 className="text-2xl md:text-2xl font-semibold font-figtree mb-4 text-gray-900">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(
                selectedVariant
                  ? selectedVariant.price ||
                      product.price + (selectedVariant.priceAdjustment || 0)
                  : product.price
              )}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          <Separator className="my-6" />

          {/* Variants Section - CRITICAL UI ELEMENT */}
          {product.hasVariants &&
            product.variants &&
            product.variants.length > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 ">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-sm text-gray-700">
                    {product.variantLabel || 'Variant'} selection required
                  </span>
                </div>

                <ProductVariantSelector
                  variants={product.variants}
                  basePrice={product.price}
                  variantLabel={product.variantLabel}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900"
              >
                -
              </Button>
              <span className="w-16 text-center font-medium text-gray-900">
                {quantity}
              </span>
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
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900"
              >
                +
              </Button>
            </div>
          </div>

          {/* Stock Info */}
          <div className="mb-2">
            {product.hasVariants && selectedVariant ? (
              <Badge
                variant={
                  selectedVariant.inventory > 0 ? 'default' : 'destructive'
                }
              >
                {selectedVariant.inventory > 0
                  ? `${selectedVariant.inventory} In Stock`
                  : 'Out of Stock'}
              </Badge>
            ) : (
              !product.hasVariants && (
                <Badge
                  variant={product.inventory > 0 ? 'default' : 'destructive'}
                >
                  {product.inventory > 0
                    ? `${product.inventory} In Stock`
                    : 'Out of Stock'}
                </Badge>
              )
            )}
          </div>

          <Separator className="my-6" />

          {/* Add to Cart Button - BLOCKED if variants required but not selected */}
          <Button
            size="lg"
            className="w-full mb-3 bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-md"
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled()}
          >
            {isAddToCartDisabled()
              ? product.hasVariants &&
                product.variants &&
                product.variants.length > 0 &&
                !selectedVariant
                ? `Select ${product.variantLabel || 'Variant'} First`
                : 'Out of Stock'
              : 'Add to Cart'}
          </Button>

          {/* Buy Now Button - Instant Checkout */}
          <Button
            size="lg"
            variant="outline"
            className="w-full mb-6 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-medium shadow-sm"
            onClick={handleBuyNow}
            disabled={isAddToCartDisabled()}
          >
            Buy Now
          </Button>

          <Separator className="my-2" />

          {/* Product Information Accordion */}
          <Accordion
            type="single"
            collapsible
            className="w-full mb-6 space-y-2"
          >
            {/* Product Details */}
            <AccordionItem
              value="details"
              className="border border-gray-200  overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-gray-50 bg-gray-100 text-gray-900">
                <span className="font-medium text-left">Product Details</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up px-1 pb-1">
                <div className="bg-white p-4 space-y-4">
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">
                        {product.category.name}
                      </span>
                    </p>
                    {product.sku && (
                      <p className="flex justify-between">
                        <span className="text-gray-600">SKU:</span>
                        <span className="font-mono text-xs text-gray-900">
                          {product.sku}
                        </span>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span className="text-gray-600">Availability:</span>
                      <span
                        className={
                          product.inStock
                            ? 'text-green-600 font-medium'
                            : 'text-red-600 font-medium'
                        }
                      >
                        {product.inStock
                          ? `In Stock (${product.inventory})`
                          : 'Out of Stock'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm text-gray-900">
                      Features
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        Premium handcrafted quality
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        Durable materials
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        Stylish modern design
                      </li>
                      {product.freeShipping && (
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          Free shipping included
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm text-gray-900">
                      Care Instructions
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        Clean with soft cloth
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        Avoid harsh chemicals
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        Store in dry place
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Shipping Policy */}
            <AccordionItem
              value="shipping"
              className="border border-gray-200  overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-gray-50 bg-gray-100 text-gray-900">
                <span className="font-medium text-left">Shipping Policy</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up px-1 pb-1">
                <div className="bg-white p-4 space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1.5 text-gray-900">
                      Domestic Shipping
                    </h4>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Standard: 3-5 business days (₪20)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Express: 1-2 business days (₪40)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          Free shipping on orders over ₪300
                          {product.freeShipping && ' - Eligible!'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-xs text-gray-700">
                      <strong>Note:</strong> Orders processed within 1-2
                      business days. Tracking number provided with shipment.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Payment Options */}
            <AccordionItem
              value="payment"
              className="border border-gray-200  overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-gray-50 bg-gray-100 text-gray-900">
                <span className="font-medium text-left">Payment Options</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up px-1 pb-1">
                <div className="bg-white p-4 space-y-3 text-sm">
                  <p className="text-gray-600">
                    We accept the following payment methods:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <h4 className="font-medium mb-1.5 text-xs text-gray-900">
                        Credit Cards
                      </h4>
                      <ul className="space-y-0.5 text-xs text-gray-600">
                        <li>• Visa</li>
                        <li>• Mastercard</li>
                        <li>• American Express</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <h4 className="font-medium mb-1.5 text-xs text-gray-900">
                        Digital Wallets
                      </h4>
                      <ul className="space-y-0.5 text-xs text-gray-600">
                        <li>• PayPal</li>
                        <li>• Apple Pay</li>
                        <li>• Google Pay</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-xs text-gray-700">
                        <strong>Secure Payment:</strong> All transactions
                        encrypted with SSL technology.
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Guarantee */}
            <AccordionItem
              value="guarantee"
              className="border border-gray-200  overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-gray-50 bg-gray-100 text-gray-900">
                <span className="font-medium text-left">Quality Guarantee</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up px-1 pb-1">
                <div className="bg-white p-4 space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1.5 text-gray-900">
                      30-Day Money Back Guarantee
                    </h4>
                    <p className="text-gray-600 text-xs">
                      Not satisfied? Return within 30 days for a full refund -
                      no questions asked.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1.5 text-gray-900">
                      Lifetime Warranty
                    </h4>
                    <p className="text-gray-600 text-xs">
                      We cover manufacturing defects for life. If the product
                      breaks due to faulty craftsmanship, we&apos;ll repair or
                      replace it for free.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <p className="text-xs text-gray-700">
                      <strong>How to Claim:</strong> Contact us with order
                      number and photos. We&apos;ll provide a prepaid shipping
                      label.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Product Features */}
          <div className="space-y-4">
            {product.freeShipping && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Free shipping on this item</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
