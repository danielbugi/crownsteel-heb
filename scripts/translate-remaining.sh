#!/bin/bash

# Script to systematically replace common English text with Hebrew translations

# Define replacement patterns
declare -A replacements=(
    # Common English words that need translation
    ["'Home'"]="'דף הבית'"
    ["'Shop'"]="'חנות'"
    ["'About'"]="'אודות'"
    ["'Contact'"]="'צור קשר'"
    ["'Cart'"]="'עגלת קניות'"
    ["'Search'"]="'חיפוש'"
    ["'Products'"]="'מוצרים'"
    ["'Categories'"]="'קטגוריות'"
    ["'Menu'"]="'תפריט'"
    ["'Total'"]="'סה\"כ'"
    ["'Subtotal'"]="'סכום ביניים'"
    ["'Shipping'"]="'משלוח'"
    ["'Free'"]="'חינם'"
    ["'Add to Cart'"]="'הוסף לעגלה'"
    ["'Buy Now'"]="'קנה עכשיו'"
    ["'Continue Shopping'"]="'המשך קניות'"
    ["'Proceed to Checkout'"]="'המשך לתשלום'"
    ["'Sign in'"]="'התחבר'"
    ["'Sign up'"]="'הרשמה'"
    ["'Loading'"]="'טוען...'"
    ["'Save'"]="'שמור'"
    ["'Cancel'"]="'ביטול'"
    ["'Delete'"]="'מחק'"
    ["'Edit'"]="'ערוך'"
    ["'Add'"]="'הוסף'"
    ["'Remove'"]="'הסר'"
    ["'Clear'"]="'נקה'"
    ["'Close'"]="'סגור'"
    ["'Confirm'"]="'אשר'"
    ["'Yes'"]="'כן'"
    ["'No'"]="'לא'"
    
    # Hardcoded strings that appear without translation
    ['"Home"']='"דף הבית"'
    ['"Shop"']='"חנות"'
    ['"About"']='"אודות"'
    ['"Contact"']='"צור קשר"'
    ['"Cart"']='"עגלת קניות"'
    ['"Search"']='"חיפוש"'
    ['"Products"']='"מוצרים"'
    ['"Categories"']='"קטגוריות"'
    ['"Menu"']='"תפריט"'
    ['"Total"']='"סה\"כ"'
    ['"Subtotal"']='"סכום ביניים"'
    ['"Shipping"']='"משלוח"'
    ['"Free"']='"חינם"'
    ['"Loading..."']='"טוען..."'
)

# Function to update a file
update_file() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Apply all replacements
        for english in "${!replacements[@]}"; do
            hebrew="${replacements[$english]}"
            sed -i "s|$english|$hebrew|g" "$file"
        done
        
        echo "Updated $file"
    else
        echo "File $file not found"
    fi
}

# Target specific files that are most likely to have user-facing text
files=(
    "src/components/layout/navbar.tsx"
    "src/components/layout/footer.tsx"
    "src/components/layout/navigation-sidebar.tsx"
    "src/components/cart/cart-sheet.tsx"
    "src/components/wishlist/wishlist-sheet.tsx"
    "src/components/auth/auth-sidebar.tsx"
    "src/components/search/search-bar.tsx"
    "src/app/page.tsx"
    "src/app/shop/page.tsx"
    "src/app/about/page.tsx"
    "src/app/contact/page.tsx"
    "src/app/wishlist/page.tsx"
)

# Update all target files
for file in "${files[@]}"; do
    update_file "$file"
done

echo "Translation cleanup completed!"