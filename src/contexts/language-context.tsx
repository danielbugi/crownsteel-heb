'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'he';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation dictionaries
const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.collections': 'Collections',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.search': 'Search jewelry...',
    'nav.cart': 'Shopping Cart',
    'nav.signin': 'Sign in',
    'nav.profile': 'Profile',
    'nav.orders': 'Orders',
    'nav.admin': 'Admin Dashboard',
    'nav.signout': 'Sign out',
    'nav.menu': 'Menu',
    'nav.wishlist': 'Favorites',

    // Wishlist
    'wishlist.title': 'My Favorites',
    'wishlist.subtitle': 'Items you love',
    'wishlist.empty': 'Your wishlist is empty',
    'wishlist.emptyDesc': 'Start adding items you love to see them here',
    'wishlist.browsProducts': 'Browse Products',
    'wishlist.addToCart': 'Add to Cart',
    'wishlist.removeFromWishlist': 'Remove',
    'wishlist.moveToCart': 'Move to Cart',
    'wishlist.itemsCount': 'items',
    'wishlist.signInPrompt': 'Sign in to save your favorites forever',
    'wishlist.signInButton': 'Sign In',
    'wishlist.limitReached': 'Guest limit reached',
    'wishlist.limitDesc': 'Sign in to save unlimited favorites',

    // Shop Dropdown (add these)
    'shop.dropdown.title': 'Shop by Category',
    'shop.dropdown.viewAll': 'View All Products',
    'shop.dropdown.featured': 'Featured Categories',

    // Auth Modal
    'auth.welcome': 'Welcome to Forge & Steel',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.continueWithGoogle': 'Continue with Google',
    'auth.orContinueWithEmail': 'Or continue with email',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.signinButton': 'Sign In',
    'auth.signupButton': 'Create Account',
    'auth.signingIn': 'Signing in...',
    'auth.creatingAccount': 'Creating account...',
    'auth.passwordMinLength': 'At least 6 characters',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",

    // Footer (update existing)
    'footer.findUs': 'Find Us',
    'footer.quickLinks': 'Quick Links',
    'footer.shopAll': 'Shop All',
    'footer.categories': 'Categories',
    'footer.aboutUs': 'About Us',
    'footer.contact': 'Contact',
    'footer.customerService': 'Customer Service',
    'footer.faq': 'FAQ',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterDesc': 'Subscribe for updates and exclusive offers',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.allRightsReserved': 'All rights reserved',

    // Shop
    'shop.title': 'Shop All Jewelry',
    'shop.description': 'Explore our complete collection',
    'shop.allCategories': 'All Categories',
    'shop.sortBy': 'Sort by',
    'shop.newest': 'Newest',
    'shop.priceLowToHigh': 'Price: Low to High',
    'shop.priceHighToLow': 'Price: High to Low',
    'shop.popular': 'Popular',
    'shop.noProducts': 'No products found',
    'shop.noProductsDesc': 'Try adjusting your filters',
    'shop.categories': 'Categories',
    'shop.allProducts': 'All Products',

    // Product
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.description': 'Description',
    'product.details': 'Details',
    'product.material': 'Material',
    'product.category': 'Category',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.addedToCart': 'Added to cart',
    'product.relatedProducts': 'Related Products',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Add some items to get started',
    'cart.continueShopping': 'Continue Shopping',
    'cart.clearCart': 'Clear Cart',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.completeOrder': 'Complete your order',
    'checkout.contactInfo': 'Contact Information',
    'checkout.email': 'Email',
    'checkout.phone': 'Mobile Phone',
    'checkout.shippingAddress': 'Shipping Address',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.postalCode': 'Postal Code',
    'checkout.idNumber': 'ID Number (optional)',
    'checkout.payment': 'Payment',
    'checkout.paymentSecure': 'Secure payment via Tranzila',
    'checkout.paymentDesc': 'You will be redirected to secure payment page',
    'checkout.continueToPayment': 'Continue to Payment',
    'checkout.processing': 'Processing...',

    // Orders
    'orders.title': 'My Orders',
    'orders.viewTrack': 'View and track your orders',
    'orders.noOrders': 'No orders yet',
    'orders.noOrdersDesc': 'Start shopping to see your orders here',
    'orders.browseProducts': 'Browse Products',
    'orders.orderNumber': 'Order',
    'orders.placedOn': 'Placed on',
    'orders.items': 'items',
    'orders.viewDetails': 'View Details',
    'orders.trackOrder': 'Track Order',
    'orders.status.PENDING': 'Pending',
    'orders.status.CONFIRMED': 'Confirmed',
    'orders.status.SHIPPED': 'Shipped',
    'orders.status.DELIVERED': 'Delivered',
    'orders.status.CANCELLED': 'Cancelled',

    // Profile
    'profile.title': 'Profile',
    'profile.manageAccount': 'Manage your account information',
    'profile.personalInfo': 'Personal Information',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email',
    'profile.emailCannotChange': 'Email cannot be changed',
    'profile.saveChanges': 'Save Changes',
    'profile.saving': 'Saving...',

    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.categories': 'Categories',
    'admin.customers': 'Customers',
    'admin.settings': 'Settings',

    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',

    // Search
    'search.resultsFor': 'Search Results for',
    'search.allProducts': 'All Products',
    'search.productsFound': 'products found',
    'search.noResults': 'No products found',
    'search.tryDifferent': 'Try adjusting your search or filters',
    'search.filters': 'Filters',
    'search.category': 'Category',
    'search.allCategories': 'All Categories',
    'search.priceRange': 'Price Range',
    'search.minPrice': 'Min Price',
    'search.maxPrice': 'Max Price',
    'search.availability': 'Availability',
    'search.inStockOnly': 'In Stock Only',
    'search.featuredOnly': 'Featured Only',
    'search.applyFilters': 'Apply Filters',
    'search.clearFilters': 'Clear Filters',
    'search.sortBy': 'Sort by',
    'search.newest': 'Newest First',
    'search.oldest': 'Oldest First',
    'search.priceLowToHigh': 'Price: Low to High',
    'search.priceHighToLow': 'Price: High to Low',
    'search.nameAZ': 'Name: A-Z',
    'search.nameZA': 'Name: Z-A',
  },
  he: {
    // Navbar
    'nav.home': 'דף הבית',
    'nav.shop': 'חנות',
    'nav.collections': 'קולקציות',
    'nav.about': 'אודות',
    'nav.contact': 'צור קשר',
    'nav.search': 'חיפוש תכשיטים...',
    'nav.cart': 'עגלת קניות',
    'nav.signin': 'התחבר',
    'nav.profile': 'פרופיל',
    'nav.orders': 'הזמנות',
    'nav.admin': 'ניהול',
    'nav.signout': 'התנתק',
    'nav.menu': 'תפריט',
    'nav.wishlist': 'מועדפים',

    // Wishlist
    'wishlist.title': 'המועדפים שלי',
    'wishlist.subtitle': 'פריטים שאהבת',
    'wishlist.empty': 'רשימת המועדפים ריקה',
    'wishlist.emptyDesc': 'התחל להוסיף פריטים שאתה אוהב כדי לראות אותם כאן',
    'wishlist.browsProducts': 'עיין במוצרים',
    'wishlist.addToCart': 'הוסף לעגלה',
    'wishlist.removeFromWishlist': 'הסר',
    'wishlist.moveToCart': 'העבר לעגלה',
    'wishlist.itemsCount': 'פריטים',
    'wishlist.signInPrompt': 'היכנס כדי לשמור את המועדפים שלך לנצח',
    'wishlist.signInButton': 'התחבר',
    'wishlist.limitReached': 'הגעת למגבלת אורחים',
    'wishlist.limitDesc': 'היכנס כדי לשמור מועדפים ללא הגבלה',

    // Auth Modal
    'auth.welcome': "ברוכים הבאים לפורג' אנד סטיל",
    'auth.signin': 'כניסה',
    'auth.signup': 'הרשמה',
    'auth.continueWithGoogle': 'המשך עם Google',
    'auth.orContinueWithEmail': 'או המשך עם אימייל',
    'auth.email': 'דוא"ל',
    'auth.password': 'סיסמה',
    'auth.confirmPassword': 'אימות סיסמה',
    'auth.fullName': 'שם מלא',
    'auth.signinButton': 'התחבר',
    'auth.signupButton': 'צור חשבון',
    'auth.signingIn': 'מתחבר...',
    'auth.creatingAccount': 'יוצר חשבון...',
    'auth.passwordMinLength': 'לפחות 6 תווים',
    'auth.alreadyHaveAccount': 'כבר יש לך חשבון?',
    'auth.dontHaveAccount': 'אין לך חשבון?',

    // Footer (update existing)
    'footer.findUs': 'תמצאו אותנו',
    'footer.quickLinks': 'קישורים מהירים',
    'footer.shopAll': 'כל המוצרים',
    'footer.categories': 'קטגוריות',
    'footer.aboutUs': 'אודות',
    'footer.contact': 'צור קשר',
    'footer.customerService': 'שירות לקוחות',
    'footer.faq': 'שאלות נפוצות',
    'footer.newsletter': 'ניוזלטר',
    'footer.newsletterDesc': 'הירשם לעדכונים והצעות בלעדיות',
    'footer.emailPlaceholder': 'הזן דוא"ל',
    'footer.allRightsReserved': 'כל הזכויות שמורות',

    // Shop
    'shop.title': 'כל התכשיטים',
    'shop.description': 'גלה את הקולקציה המלאה שלנו',
    'shop.allCategories': 'כל הקטגוריות',
    'shop.sortBy': 'מיין לפי',
    'shop.newest': 'החדשים ביותר',
    'shop.priceLowToHigh': 'מחיר: נמוך לגבוה',
    'shop.priceHighToLow': 'מחיר: גבוה לנמוך',
    'shop.popular': 'פופולרי',
    'shop.noProducts': 'לא נמצאו מוצרים',
    'shop.noProductsDesc': 'נסה לשנות את הפילטרים',
    'shop.categories': 'קטגוריות',
    'shop.allProducts': 'כל המוצרים',

    // Shop Dropdown (add these)
    'shop.dropdown.title': 'קנה לפי קטגוריה',
    'shop.dropdown.viewAll': 'כל המוצרים',
    'shop.dropdown.featured': 'קטגוריות מומלצות',

    // Product
    'product.addToCart': 'הוסף לעגלה',
    'product.buyNow': 'קנה עכשיו',
    'product.description': 'תיאור',
    'product.details': 'פרטים',
    'product.material': 'חומר',
    'product.category': 'קטגוריה',
    'product.inStock': 'במלאי',
    'product.outOfStock': 'אזל מהמלאי',
    'product.addedToCart': 'נוסף לעגלה',
    'product.relatedProducts': 'מוצרים קשורים',

    // Cart
    'cart.title': 'עגלת קניות',
    'cart.empty': 'העגלה ריקה',
    'cart.emptyDesc': 'הוסף מוצרים כדי להתחיל',
    'cart.continueShopping': 'המשך קניות',
    'cart.clearCart': 'רוקן עגלה',
    'cart.subtotal': 'סכום ביניים',
    'cart.shipping': 'משלוח',
    'cart.free': 'חינם',
    'cart.total': 'סה"כ',
    'cart.checkout': 'המשך לתשלום',
    'cart.remove': 'הסר',
    'cart.quantity': 'כמות',

    // Checkout
    'checkout.title': 'תשלום',
    'checkout.completeOrder': 'השלם את ההזמנה',
    'checkout.contactInfo': 'פרטי קשר',
    'checkout.email': 'דוא"ל',
    'checkout.phone': 'טלפון נייד',
    'checkout.shippingAddress': 'כתובת למשלוח',
    'checkout.firstName': 'שם פרטי',
    'checkout.lastName': 'שם משפחה',
    'checkout.address': 'כתובת',
    'checkout.city': 'עיר',
    'checkout.postalCode': 'מיקוד',
    'checkout.idNumber': 'תעודת זהות (אופציונלי)',
    'checkout.payment': 'תשלום',
    'checkout.paymentSecure': 'תשלום מאובטח באמצעות Tranzila',
    'checkout.paymentDesc': 'תועבר לדף תשלום מאובטח',
    'checkout.continueToPayment': 'המשך לתשלום',
    'checkout.processing': 'מעבד...',

    // Orders
    'orders.title': 'ההזמנות שלי',
    'orders.viewTrack': 'צפה ועקוב אחרי ההזמנות שלך',
    'orders.noOrders': 'אין הזמנות עדיין',
    'orders.noOrdersDesc': 'התחל לקנות כדי לראות את ההזמנות שלך כאן',
    'orders.browseProducts': 'עיין במוצרים',
    'orders.orderNumber': 'הזמנה',
    'orders.placedOn': 'בוצעה ב',
    'orders.items': 'פריטים',
    'orders.viewDetails': 'צפה בפרטים',
    'orders.trackOrder': 'עקוב אחרי ההזמנה',
    'orders.status.PENDING': 'ממתין',
    'orders.status.CONFIRMED': 'אושר',
    'orders.status.SHIPPED': 'נשלח',
    'orders.status.DELIVERED': 'נמסר',
    'orders.status.CANCELLED': 'בוטל',

    // Profile
    'profile.title': 'פרופיל',
    'profile.manageAccount': 'נהל את פרטי החשבון שלך',
    'profile.personalInfo': 'מידע אישי',
    'profile.fullName': 'שם מלא',
    'profile.email': 'דוא"ל',
    'profile.emailCannotChange': 'לא ניתן לשנות את הדוא"ל',
    'profile.saveChanges': 'שמור שינויים',
    'profile.saving': 'שומר...',

    // Admin
    'admin.dashboard': 'לוח בקרה',
    'admin.products': 'מוצרים',
    'admin.orders': 'הזמנות',
    'admin.categories': 'קטגוריות',
    'admin.customers': 'לקוחות',
    'admin.settings': 'הגדרות',

    // Common
    'common.loading': 'טוען...',
    'common.save': 'שמור',
    'common.cancel': 'ביטול',
    'common.delete': 'מחק',
    'common.edit': 'ערוך',
    'common.add': 'הוסף',
    'common.search': 'חיפוש',
    'common.filter': 'סנן',
    'common.close': 'סגור',
    'common.confirm': 'אשר',
    'common.yes': 'כן',
    'common.no': 'לא',

    // Search
    'search.resultsFor': 'תוצאות חיפוש עבור',
    'search.allProducts': 'כל המוצרים',
    'search.productsFound': 'מוצרים נמצאו',
    'search.noResults': 'לא נמצאו מוצרים',
    'search.tryDifferent': 'נסה לשנות את החיפוש או הפילטרים',
    'search.filters': 'סינון',
    'search.category': 'קטגוריה',
    'search.allCategories': 'כל הקטגוריות',
    'search.priceRange': 'טווח מחירים',
    'search.minPrice': 'מחיר מינימום',
    'search.maxPrice': 'מחיר מקסימום',
    'search.availability': 'זמינות',
    'search.inStockOnly': 'במלאי בלבד',
    'search.featuredOnly': 'מומלצים בלבד',
    'search.applyFilters': 'החל סינון',
    'search.clearFilters': 'נקה סינון',
    'search.sortBy': 'מיין לפי',
    'search.newest': 'החדשים ביותר',
    'search.oldest': 'הישנים ביותר',
    'search.priceLowToHigh': 'מחיר: נמוך לגבוה',
    'search.priceHighToLow': 'מחיר: גבוה לנמוך',
    'search.nameAZ': 'שם: א-ת',
    'search.nameZA': 'שם: ת-א',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('he'); // Default to Hebrew
  const [direction, setDirection] = useState<Direction>('rtl');

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'he')) {
      setLanguageState(saved);
      setDirection(saved === 'he' ? 'rtl' : 'ltr');
    }
  }, []);

  // Update document direction and save to localStorage
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDirection(lang === 'he' ? 'rtl' : 'ltr');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
