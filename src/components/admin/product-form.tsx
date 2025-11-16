'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/image-upload';
import { ProductVariantManager } from '@/components/admin/product-variant-manager';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    comparePrice?: number | null;
    image: string;
    images: string[];
    categoryId: string;
    inStock: boolean;
    featured: boolean;
    freeShipping?: boolean;
    inventory?: number;
    lowStockThreshold?: number;
    reorderPoint?: number;
    reorderQuantity?: number;
    sku?: string | null;
  };
  productId?: string;
}

export function ProductForm({
  categories,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Hebrew fields
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );

  // Common fields
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [comparePrice, setComparePrice] = useState(
    initialData?.comparePrice?.toString() || ''
  );
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [inStock, setInStock] = useState(initialData?.inStock ?? true);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [freeShipping, setFreeShipping] = useState(
    initialData?.freeShipping ?? false
  );

  // Inventory fields
  const [inventory, setInventory] = useState(
    initialData?.inventory?.toString() || '0'
  );
  const [lowStockThreshold, setLowStockThreshold] = useState(
    initialData?.lowStockThreshold?.toString() || '10'
  );
  const [reorderPoint, setReorderPoint] = useState(
    initialData?.reorderPoint?.toString() || '20'
  );
  const [reorderQuantity, setReorderQuantity] = useState(
    initialData?.reorderQuantity?.toString() || '50'
  );
  const [sku, setSku] = useState(initialData?.sku || '');

  // Image management
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [mainImage, setMainImage] = useState<string>(initialData?.image || '');

  // Variant management
  const [hasVariants, setHasVariants] = useState(false);
  const [variantType, setVariantType] = useState('');
  const [variantLabel, setVariantLabel] = useState('');
  const [variants, setVariants] = useState<
    Array<{
      name: string;
      sku?: string;
      price?: number;
      inventory?: number;
    }>
  >([]);

  // Auto-generate slug from Hebrew name (transliteration for URL)
  const generateSlug = (hebrewName: string) => {
    // For Hebrew, we'll use a simple transliteration or just use the product ID
    // In practice, you might want to add a separate English slug field
    return hebrewName
      .toLowerCase()
      .replace(/[^a-z0-9\u0590-\u05FF]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!productId) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name) {
      toast.error('נא להזין שם מוצר');
      return;
    }

    if (!slug) {
      toast.error('נא להזין Slug');
      return;
    }

    if (!price || !categoryId) {
      toast.error('נא למלא את כל השדות הנדרשים');
      return;
    }

    if (!mainImage) {
      toast.error('נא להעלות לפחות תמונה אחת');
      return;
    }

    // Validate comparePrice is higher than price if provided
    if (comparePrice && parseFloat(comparePrice) <= parseFloat(price)) {
      toast.error('המחיר להשוואה חייב להיות גבוה מהמחיר הרגיל');
      return;
    }

    setIsLoading(true);

    try {
      const url = productId
        ? `/api/admin/products/${productId}`
        : '/api/admin/products';

      // Ensure main image is first in the images array
      const orderedImages = [
        mainImage,
        ...images.filter((img) => img !== mainImage),
      ];

      const payload = {
        name,
        slug,
        description: description || '',
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        image: mainImage,
        images: orderedImages,
        categoryId,
        inStock,
        featured,
        freeShipping,
        inventory: parseInt(inventory) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 10,
        reorderPoint: parseInt(reorderPoint) || 20,
        reorderQuantity: parseInt(reorderQuantity) || 50,
        sku: sku || null,

        hasVariants,
        variantType,
        variantLabel,
        variants: hasVariants ? variants : [],
      };

      console.log('Sending payload:', payload);

      const response = await fetch(url, {
        method: productId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save product');
      }

      toast.success(productId ? 'המוצר עודכן בהצלחה' : 'המוצר נוצר בהצלחה');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{productId ? 'Edit Product' : 'Create Product'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Sterling Silver Ring"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="sterling-silver-ring"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly name (auto-generated from product name)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handcrafted sterling silver ring..."
                rows={4}
              />
            </div>
          </div>

          {/* Price Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (₪) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299.99"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare Price (₪)</Label>
              <Input
                id="comparePrice"
                type="number"
                step="0.01"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="399.99"
              />
              <p className="text-xs text-muted-foreground">
                Original price to show discount (optional)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inventory Management Section */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="PROD-001"
                  />
                  <p className="text-xs text-muted-foreground">
                    מק"ט (אופציונלי)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inventory">
                    מלאי נוכחי <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="inventory"
                    type="number"
                    min="0"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    placeholder="100"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    סך כל הפריטים הזמינים במלאי
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">התראת מלאי נמוך</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    התראה כאשר המלאי יורד מתחת למספר זה
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">נקודת הזמנה מחדש</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    min="0"
                    value={reorderPoint}
                    onChange={(e) => setReorderPoint(e.target.value)}
                    placeholder="20"
                  />
                  <p className="text-xs text-muted-foreground">
                    רמת מלאי מומלצת להזמנה מחדש
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="reorderQuantity">כמות הזמנה מחדש</Label>
                  <Input
                    id="reorderQuantity"
                    type="number"
                    min="1"
                    value={reorderQuantity}
                    onChange={(e) => setReorderQuantity(e.target.value)}
                    placeholder="50"
                  />
                  <p className="text-xs text-muted-foreground">
                    כמה יחידות להזמין בעת חידוש מלאי
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants Section */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hasVariants" className="text-base">
                  גרסאות מוצר
                </Label>
                <p className="text-sm text-muted-foreground">
                  האם למוצר זה יש גדלים, אורכים או אפשרויות שונות?
                </p>
              </div>
              <Switch
                id="hasVariants"
                checked={hasVariants}
                onCheckedChange={setHasVariants}
              />
            </div>

            {hasVariants && (
              <ProductVariantManager
                productSku={slug}
                basePrice={parseFloat(price) || 0}
                variants={variants}
                onChange={setVariants}
              />
            )}
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>
              תמונות מוצר <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              העלה תמונות מוצר. התמונה המסומנת כ-&quot;ראשית&quot; תוצג ראשונה.
            </p>
            <ImageUpload
              images={images}
              mainImage={mainImage}
              onImagesChange={setImages}
              onMainImageChange={setMainImage}
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                checked={inStock}
                onCheckedChange={setInStock}
              />
              <Label htmlFor="inStock">במלאי</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="featured">מוצר מומלץ</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="freeShipping"
                checked={freeShipping}
                onCheckedChange={setFreeShipping}
              />
              <Label htmlFor="freeShipping">משלוח חינם</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'שומר...' : productId ? 'עדכן מוצר' : 'צור מוצר'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              ביטול
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
