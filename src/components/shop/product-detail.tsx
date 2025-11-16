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
    variantLabelHe?: string;
    variants?: Array<{
      id: string;
      name: string;
      nameEn?: string;
      nameHe?: string;
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
      toast.error('אנא בחר גרסה לפני הוספה לעגלה');
      return;
    }

    const availableInventory =
      product.hasVariants && selectedVariant
        ? selectedVariant.inventory
        : product.inventory;

    if (!product.inStock || availableInventory === 0) {
      toast.error('פריט זה אינו זמין כרגע');
      return;
    }

    if (quantity > availableInventory) {
      toast.error(`רק ${availableInventory} זמינים`);
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
      toast.error('פריט זה אינו זמין כרגע');
      return;
    }

    if (quantity > availableInventory) {
      toast.error(`רק ${availableInventory} זמינים`);
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
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
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
                    'relative aspect-square overflow-hidden border-2 transition-all',
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
          {/* <div className="mb-4">
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-sm text-muted-foreground hover:text-accent"
            >
              {product.category.name}
            </Link>
          </div> */}

          <h1 className="text-xl font-light mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-light">
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
          <div className="mb-2">
            {product.hasVariants && selectedVariant ? (
              <Badge
                variant={
                  selectedVariant.inventory > 0 ? 'default' : 'destructive'
                }
              >
                {selectedVariant.inventory > 0
                  ? `${selectedVariant.inventory} במלאי`
                  : 'אזל מהמלאי'}
              </Badge>
            ) : (
              !product.hasVariants && (
                <Badge
                  variant={product.inventory > 0 ? 'default' : 'destructive'}
                >
                  {product.inventory > 0
                    ? `${product.inventory} במלאי`
                    : 'אזל מהמלאי'}
                </Badge>
              )
            )}
          </div>

          <Separator className="my-6" />

          {/* Add to Cart Button - BLOCKED if variants required but not selected */}
          <Button
            size="lg"
            className="w-full mb-3 font-light"
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled()}
          >
            {isAddToCartDisabled()
              ? product.hasVariants &&
                product.variants &&
                product.variants.length > 0 &&
                !selectedVariant
                ? `בחר ${product.variantLabelHe || product.variantLabel || 'גרסה'} תחילה`
                : 'אזל מהמלאי'
              : 'הוסף לעגלה'}
          </Button>

          {/* Buy Now Button - Instant Checkout */}
          <Button
            size="lg"
            variant="outline"
            className="w-full mb-6 border-2 border-black hover:bg-black hover:text-white font-light"
            onClick={handleBuyNow}
            disabled={isAddToCartDisabled()}
          >
            קנה עכשיו
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
              className="border-0 bg-gray-200 overflow-hidden "
            >
              <AccordionTrigger className="hover:text-gold-600 hover:no-underline px-4 py-3 hover:bg-muted/40 ">
                <span className="font-light text-left">פרטי המוצר</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up px-1 pb-1">
                <div className="bg-background p-4 space-y-4">
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">קטגוריה:</span>
                      <span className="font-medium">
                        {product.category.name}
                      </span>
                    </p>
                    {product.sku && (
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="font-mono text-xs">{product.sku}</span>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">זמינות:</span>
                      <span
                        className={
                          product.inStock
                            ? 'text-green-600 font-medium'
                            : 'text-red-600 font-medium'
                        }
                      >
                        {product.inStock
                          ? `במלאי (${product.inventory})`
                          : 'אזל מהמלאי'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-light mb-2 text-sm">תכונות</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        Premium handcrafted quality
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        Durable materials
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        Stylish modern design
                      </li>
                      {product.freeShipping && (
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span>
                          משלוח חינם כלול
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-light mb-2 text-sm">
                      Care Instructions
                    </h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        Clean with soft cloth
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        Avoid harsh chemicals
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
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
              className="border-0 bg-gray-200 overflow-hidden"
            >
              <AccordionTrigger className="hover:text-gold-600 hover:no-underline px-4 py-3 hover:bg-muted/40">
                <span className="font-light text-left">מדיניות משלוחים</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up px-1 pb-1">
                <div className="bg-background p-4 space-y-3 text-sm">
                  <div>
                    <h4 className="font-light mb-1.5">משלוחים בארץ</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>רגיל: 3-5 ימי עסקים (₪20)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>מהיר: 1-2 ימי עסקים (₪40)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          משלוח חינם להזמנות מעל ₪300
                          {product.freeShipping && ' - זכאי!'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                    <p className="text-xs">
                      <strong>הערה:</strong> הזמנות מעובדות תוך 1-2 ימי עסקים.
                      מספר מעקב מסופק עם המשלוח.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Payment Options */}
            <AccordionItem
              value="payment"
              className="border-0 bg-gray-200 overflow-hidden"
            >
              <AccordionTrigger className="hover:text-gold-600 hover:no-underline px-4 py-3 hover:bg-muted/40">
                <span className="font-light text-left">אפשרויות תשלום</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up px-1 pb-1">
                <div className="bg-background p-4 space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    אנו מקבלים את אמצעי התשלום הבאים:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border rounded-md p-3">
                      <h4 className="font-light mb-1.5 text-xs">
                        כרטיסי אשראי
                      </h4>
                      <ul className="space-y-0.5 text-xs text-muted-foreground">
                        <li>• Visa</li>
                        <li>• Mastercard</li>
                        <li>• American Express</li>
                      </ul>
                    </div>

                    <div className="border rounded-md p-3">
                      <h4 className="font-light mb-1.5 text-xs">
                        ארנקים דיגיטליים
                      </h4>
                      <ul className="space-y-0.5 text-xs text-muted-foreground">
                        <li>• PayPal</li>
                        <li>• Apple Pay</li>
                        <li>• Google Pay</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                      <p className="text-xs">
                        <strong>תשלום מאובטח:</strong> כל העסקאות מוצפנות
                        בטכנולוגיית SSL.
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Guarantee */}
            <AccordionItem
              value="guarantee"
              className="border-0 bg-gray-200 overflow-hidden"
            >
              <AccordionTrigger className="hover:text-gold-600 hover:no-underline px-4 py-3 hover:bg-muted/40">
                <span className="font-light text-left">אחריות איכות</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up px-1 pb-1">
                <div className="bg-background p-4 space-y-3 text-sm">
                  <div>
                    <h4 className="font-light mb-1.5">
                      אחריות החזר כספי ל30 יום
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      לא מרוצה? החזר תוך 30 יום להחזר כספי מלא - ללא שאלות.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-light mb-1.5">אחריות לכל החיים</h4>
                    <p className="text-muted-foreground text-xs">
                      אנו מכסים ליקויי ייצור לכל החיים. אם המוצר נשבר עקב עבודת
                      יד פגומה, נתקן או נחליף אותו בחינם.
                    </p>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                    <p className="text-xs">
                      <strong>איך לתבוע:</strong> צור קשר עם מספר ההזמנה
                      ותמונות. נספק תווית משלוח מראש.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Product Features */}
          <div className="space-y-4">
            {product.freeShipping && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-accent" />
                <span>משלוח חינם על פריט זה</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-accent" />
              <span>תשלום מאובטח</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
