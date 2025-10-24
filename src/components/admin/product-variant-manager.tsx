// src/components/admin/product-variant-manager.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const updateVariant = (index: number, field: keyof Variant, value: string | number | boolean | undefined) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <p className="text-sm text-muted-foreground">
            Add different options like sizes, colors, or lengths
          </p>
        </div>
      </div>

      {/* Variant Configuration - Simplified */}
      {variants.length === 0 && (
        <div className="bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg p-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">No variants yet</h4>
              <p className="text-sm text-muted-foreground">
                Add variants to offer different options like sizes or colors
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="bg-background rounded p-2">Ring Sizes</div>
              <div className="bg-background rounded p-2">Chain Lengths</div>
              <div className="bg-background rounded p-2">Bracelet Sizes</div>
            </div>
          </div>
        </div>
      )}

      {/* Variants List */}
      {variants.length > 0 && (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="group bg-background border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Drag Handle */}
                <div className="flex-shrink-0 cursor-move pt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  {/* Main Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Variant Name
                      </Label>
                      <Input
                        placeholder="e.g., 50cm, Size 9"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(index, 'name', e.target.value)
                        }
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        SKU
                      </Label>
                      <Input
                        placeholder="AUTO"
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(index, 'sku', e.target.value)
                        }
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Price Adjustment (₪)
                      </Label>
                      <div className="relative">
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
                          className="h-9"
                        />
                        <div className="absolute -bottom-5 left-0 text-xs text-muted-foreground">
                          = ₪{calculatePrice(variant)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Stock
                      </Label>
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
                        className="h-9"
                      />
                    </div>
                  </div>

                  {/* Status Row */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={variant.inStock}
                          onCheckedChange={(checked) =>
                            updateVariant(index, 'inStock', checked)
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          In Stock
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={variant.isDefault}
                          onCheckedChange={() => setAsDefault(index)}
                        />
                        <span className="text-sm text-muted-foreground">
                          Default
                        </span>
                      </div>

                      {variant.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default Option
                        </Badge>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Variant Button */}
      <Button
        type="button"
        onClick={addVariant}
        variant="outline"
        className="w-full h-11 border-dashed hover:border-solid hover:bg-accent/50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Variant
      </Button>
    </div>
  );
}
