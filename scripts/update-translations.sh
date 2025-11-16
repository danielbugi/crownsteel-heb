#!/bin/bash

# Script to replace useLanguage imports and usage with the new translation system

# Files to process
files=(
  "src/components/layout/navbar.tsx"
  "src/components/layout/footer.tsx"
  "src/components/layout/navigation-sidebar.tsx"
  "src/components/layout/user-menu-sidebar.tsx"
  "src/components/layout/shop-dropdown.tsx"
  "src/components/layout/breadcrumb.tsx"
  "src/components/layout/announcement-bar.tsx"
  "src/components/layout/cookie-consent.tsx"
  "src/components/cart/cart-sheet.tsx"
  "src/components/wishlist/wishlist-sheet.tsx"
  "src/components/auth/auth-sidebar.tsx"
  "src/components/search/search-bar.tsx"
  "src/components/search/search-filters.tsx"
  "src/components/search/search-sort.tsx"
  "src/components/shop/product-sort.tsx"
  "src/components/shop/product-filters.tsx"
  "src/components/shop/related-products.tsx"
  "src/components/shop/category-filter.tsx"
  "src/components/shop/product-carousel.tsx"
  "src/components/product/review-form.tsx"
  "src/components/product/product-variant-selector.tsx"
  "src/components/footer/newsletter-signup.tsx"
  "src/app/shop/page.tsx"
  "src/app/search/page.tsx"
  "src/app/wishlist/page.tsx"
  "src/app/about/page.tsx"
  "src/app/contact/page.tsx"
  "src/app/privacy/page.tsx"
  "src/app/faq/page.tsx"
)

# Function to update a file
update_file() {
  local file="$1"
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Replace useLanguage import with our new translation system
    sed -i "s|import { useLanguage } from '@/contexts/language-context';|import { t, direction } from '@/lib/translations';|g" "$file"
    
    # Replace common useLanguage patterns
    sed -i "s|const { t } = useLanguage();||g" "$file"
    sed -i "s|const { t, direction } = useLanguage();||g" "$file"
    sed -i "s|const { t, language } = useLanguage();||g" "$file"
    sed -i "s|const { t, language, direction } = useLanguage();||g" "$file"
    sed -i "s|const { language } = useLanguage();||g" "$file"
    sed -i "s|const { direction } = useLanguage();||g" "$file"
    
    # Update API calls to use Hebrew
    sed -i "s|fetch('/api/categories')|fetch('/api/categories?lang=he')|g" "$file"
    sed -i "s|fetch('/api/products')|fetch('/api/products?lang=he')|g" "$file"
    
    # Fix language-specific logic to prioritize Hebrew
    sed -i "s|language === 'he' && category.nameHe|category.nameHe|g" "$file"
    sed -i "s|language === 'he' && product.nameHe|product.nameHe|g" "$file"
    
    echo "Updated $file"
  else
    echo "File $file not found"
  fi
}

# Update all files
for file in "${files[@]}"; do
  update_file "$file"
done

echo "All files updated!"