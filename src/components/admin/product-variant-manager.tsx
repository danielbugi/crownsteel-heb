// src/components/admin/product-variant-manager.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Variant {
  id?: string;
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
}

interface ProductVariantManagerProps {
  productSku?: string;
  basePrice: number;
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export function ProductVariantManager({
  productSku = '',
  basePrice,
  variants,
  onChange,
}: ProductVariantManagerProps) {
  const [variantType, setVariantType] = useState('');
  const [variantLabel, setVariantLabel] = useState('');
  const [variantLabelHe, setVariantLabelHe] = useState('');

  const addVariant = () => {
    const newVariant: Variant = {
      name: '',
      nameEn: '',
      nameHe: '',
      sku: `${productSku}-VAR-${variants.length + 1}`,
      inventory: 0,
      inStock: true,
      isDefault: variants.length === 0,
      sortOrder: variants.length,
    };
    onChange([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  const setAsDefault = (index: number) => {
    const updated = variants.map((v, i) => ({
      ...v,
      isDefault: i === index,
    }));
    onChange(updated);
  };

  const calculatePrice = (variant: Variant) => {
    if (variant.price) return variant.price;
    if (variant.priceAdjustment) return basePrice + variant.priceAdjustment;
    return basePrice;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Variant Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Variant Type</Label>
            <Input
              placeholder="e.g., Size, Length, Width"
              value={variantType}
              onChange={(e) => setVariantType(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              What varies? (Size, Length, etc.)
            </p>
          </div>
          <div>
            <Label>Display Label (English)</Label>
            <Input
              placeholder="e.g., Ring Size, Chain Length"
              value={variantLabel}
              onChange={(e) => setVariantLabel(e.target.value)}
            />
          </div>
          <div>
            <Label>Display Label (Hebrew)</Label>
            <Input
              placeholder="e.g., מידת טבעת, אורך שרשרת"
              value={variantLabelHe}
              onChange={(e) => setVariantLabelHe(e.target.value)}
            />
          </div>
        </div>

        {/* Variants List */}
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 cursor-move mt-8">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Variant Name */}
                    <div>
                      <Label>Variant Name *</Label>
                      <Input
                        placeholder="e.g., 50cm, Size 9"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(index, 'name', e.target.value)
                        }
                      />
                    </div>

                    {/* SKU */}
                    <div>
                      <Label>SKU *</Label>
                      <Input
                        placeholder="PRODUCT-VAR-1"
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(index, 'sku', e.target.value)
                        }
                      />
                    </div>

                    {/* Price Adjustment */}
                    <div>
                      <Label>Price Adjustment (₪)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.priceAdjustment || ''}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            'priceAdjustment',
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Final: ₪{calculatePrice(variant)}
                      </p>
                    </div>

                    {/* Inventory */}
                    <div>
                      <Label>Inventory *</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.inventory}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            'inventory',
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={variant.inStock}
                        onCheckedChange={(checked) =>
                          updateVariant(index, 'inStock', checked)
                        }
                      />
                      <Label className="text-xs">In Stock</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={variant.isDefault}
                        onCheckedChange={() => setAsDefault(index)}
                      />
                      <Label className="text-xs">Default</Label>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Preview Badge */}
                <div className="mt-4">
                  <Badge variant="outline">
                    {variant.name} - ₪{calculatePrice(variant)} - Stock:{' '}
                    {variant.inventory}
                    {variant.isDefault && ' (Default)'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Variant Button */}
        <Button
          type="button"
          onClick={addVariant}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>

        {/* Quick Add Helper */}
        {variants.length === 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">💡 Quick Examples:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ring Sizes: 8, 9, 10, 11, 12</li>
              <li>• Chain Lengths: 45cm, 50cm, 55cm, 60cm</li>
              <li>• Bracelet Sizes: Small, Medium, Large</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
