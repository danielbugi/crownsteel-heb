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

  const addVariant = () => {
    const newVariant: Variant = {
      name: '',
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
        <CardTitle>גרסאות מוצר</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6" dir="rtl">
        {/* Variant Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>סוג גרסה</Label>
            <Input
              placeholder="לדוגמה: גודל, אורך, רוחב"
              value={variantType}
              onChange={(e) => setVariantType(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              מה משתנה? (גודל, אורך וכו')
            </p>
          </div>
          <div className="md:col-span-2">
            <Label>תווית תצוגה</Label>
            <Input
              placeholder="לדוגמה: מידת טבעת, אורך שרשרת"
              value={variantLabel}
              onChange={(e) => setVariantLabel(e.target.value)}
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
                      <Label>שם גרסה *</Label>
                      <Input
                        placeholder="לדוגמה: 50ס״מ, מידה 9"
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
                      <Label>התאמת מחיר (₪)</Label>
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
                        סופי: ₪{calculatePrice(variant)}
                      </p>
                    </div>

                    {/* Inventory */}
                    <div>
                      <Label>מלאי *</Label>
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
                      <Label className="text-xs">במלאי</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={variant.isDefault}
                        onCheckedChange={() => setAsDefault(index)}
                      />
                      <Label className="text-xs">ברירת מחדל</Label>
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
                    {variant.name} - ₪{calculatePrice(variant)} - מלאי:{' '}
                    {variant.inventory}
                    {variant.isDefault && ' (ברירת מחדל)'}
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
          הוסף גרסה
        </Button>

        {/* Quick Add Helper */}
        {variants.length === 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">💡 דוגמאות מהירות:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• מידות טבעות: 8, 9, 10, 11, 12</li>
              <li>• אורכי שרשרת: 45ס״מ, 50ס״מ, 55ס״מ, 60ס״מ</li>
              <li>• גדלי צמידים: קטן, בינוני, גדול</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
