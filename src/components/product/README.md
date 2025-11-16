# Product Badge Component

A consistent badge component for all product images and cards throughout the e-commerce platform.

## Features

- **Consistent Styling**: Black background, white text, white border
- **Customizable**: Extends the base Badge component with additional className support
- **Clean Design**: Rounded-none for sharp edges, shadow-lg for depth

## Usage

### Basic Usage

```tsx
import { ProductBadge } from '@/components/product/product-badge';

// Simple badge
<ProductBadge>New</ProductBadge>

// With discount
<ProductBadge>{discountPercentage}% OFF</ProductBadge>

// Featured product
<ProductBadge>Featured</ProductBadge>

// Multiple options
<ProductBadge>Multiple Options</ProductBadge>
```

### Custom Styling

You can override or extend the default styles using the `className` prop:

```tsx
// Smaller text
<ProductBadge className="text-xs">Sale</ProductBadge>

// Add margin
<ProductBadge className="mt-2">Out of Stock</ProductBadge>

// Custom size
<ProductBadge className="px-4 py-2">Premium</ProductBadge>
```

### In Product Cards

```tsx
<div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
  {discountPercentage > 0 && (
    <ProductBadge>{discountPercentage}% OFF</ProductBadge>
  )}

  {isNew && <ProductBadge>New</ProductBadge>}
</div>
```

## Default Styling

The component applies the following default classes:

- `bg-black` - Black background
- `text-white` - White text
- `border-white` - White border
- `shadow-lg` - Large shadow for depth
- `rounded-none` - Sharp corners (no border radius)

These can be overridden by passing custom classes via the `className` prop.

## Used In

- `product-card.tsx` - Grid/carousel view product cards
- `product-card-list.tsx` - List view product cards
- `quick-view-modal.tsx` - Quick view product modal
