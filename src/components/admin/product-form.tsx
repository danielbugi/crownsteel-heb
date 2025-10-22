'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  nameEn?: string | null;
  nameHe?: string | null;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    nameEn?: string | null;
    nameHe?: string | null;
    description?: string | null;
    descriptionEn?: string | null;
    descriptionHe?: string | null;
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

  // English fields
  const [nameEn, setNameEn] = useState(
    initialData?.nameEn || initialData?.name || ''
  );
  const [descriptionEn, setDescriptionEn] = useState(
    initialData?.descriptionEn || initialData?.description || ''
  );

  // Hebrew fields
  const [nameHe, setNameHe] = useState(initialData?.nameHe || '');
  const [descriptionHe, setDescriptionHe] = useState(
    initialData?.descriptionHe || ''
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
  const [variantLabelHe, setVariantLabelHe] = useState('');
  const [variants, setVariants] = useState<any[]>([]);

  // Auto-generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameEnChange = (value: string) => {
    setNameEn(value);
    if (!productId) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!nameEn || !nameHe) {
      toast.error('Please provide both English and Hebrew names');
      return;
    }

    if (!slug) {
      toast.error('Slug is required');
      return;
    }

    if (!price || !categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!mainImage) {
      toast.error('Please upload at least one image');
      return;
    }

    // Validate comparePrice is higher than price if provided
    if (comparePrice && parseFloat(comparePrice) <= parseFloat(price)) {
      toast.error('Compare price must be higher than regular price');
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
        name: nameEn,
        nameEn,
        nameHe,
        slug,
        description: descriptionEn || '',
        descriptionEn: descriptionEn || '',
        descriptionHe: descriptionHe || '',
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
        variantLabelHe,
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

      toast.success(
        productId
          ? 'Product updated successfully'
          : 'Product created successfully'
      );
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
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="he">עברית</TabsTrigger>
            </TabsList>

            {/* English Tab */}
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">
                  Product Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameEn"
                  value={nameEn}
                  onChange={(e) => handleNameEnChange(e.target.value)}
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
                <Label htmlFor="descriptionEn">Description (English)</Label>
                <Textarea
                  id="descriptionEn"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Handcrafted sterling silver ring..."
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Hebrew Tab */}
            <TabsContent value="he" className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="nameHe">
                  שם המוצר (עברית) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameHe"
                  value={nameHe}
                  onChange={(e) => setNameHe(e.target.value)}
                  placeholder="טבעת כסף סטרלינג"
                  required
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionHe">תיאור (עברית)</Label>
                <Textarea
                  id="descriptionHe"
                  value={descriptionHe}
                  onChange={(e) => setDescriptionHe(e.target.value)}
                  placeholder="טבעת כסף סטרלינג בעבודת יד..."
                  rows={4}
                  dir="rtl"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Fields - Price Section with Compare Price */}
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
              <Label htmlFor="comparePrice">Compare At Price (₪)</Label>
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
                      {category.nameEn || category.name}
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
                    Stock Keeping Unit (optional)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inventory">
                    Current Stock <span className="text-red-500">*</span>
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
                    Total items available in stock
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when stock falls below this number
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">Reorder Point</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    min="0"
                    value={reorderPoint}
                    onChange={(e) => setReorderPoint(e.target.value)}
                    placeholder="20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Suggested inventory level to reorder
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="reorderQuantity">Reorder Quantity</Label>
                  <Input
                    id="reorderQuantity"
                    type="number"
                    min="1"
                    value={reorderQuantity}
                    onChange={(e) => setReorderQuantity(e.target.value)}
                    placeholder="50"
                  />
                  <p className="text-xs text-muted-foreground">
                    How many units to order when restocking
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
                  Product Variants
                </Label>
                <p className="text-sm text-muted-foreground">
                  Does this product have different sizes, lengths, or options?
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
              Product Images <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Upload product images. The image marked as &quot;Main&quot; will
              be displayed first.
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
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="freeShipping"
                checked={freeShipping}
                onCheckedChange={setFreeShipping}
              />
              <Label htmlFor="freeShipping">Free Shipping</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : productId
                  ? 'Update Product'
                  : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
