// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ShoppingCart, Eye, Heart, Sparkles } from 'lucide-react';
// import { useCartStore } from '@/store/cart-store';
// import { useWishlistStore } from '@/store/wishlist-store';
// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import { QuickViewModal } from '@/components/shop/quick-view-modal';
// import { useSession } from 'next-auth/react';

// interface Product {
//   id: string;
//   name: string;
//   slug: string;
//   price: number;
//   comparePrice: number | null;
//   image: string;
//   images: string[];
//   description?: string;
//   inStock: boolean;
//   featured: boolean;
//   inventory?: number;
//   createdAt?: string;
//   category: {
//     id: string;
//     name: string;
//     slug: string;
//   };
// }

// interface ProductCardProps {
//   product: Product;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const { addItem: addToCart } = useCartStore();
//   const [isHovered, setIsHovered] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [showQuickView, setShowQuickView] = useState(false);
//   const { isInWishlist, toggleItem: toggleWishlist } = useWishlistStore();

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (!product.inStock) {
//       toast.error('This item is currently out of stock');
//       return;
//     }
//     addToCart({
//       id: product.id,
//       productId: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       quantity: 1,
//     });
//     toast.success('Added to cart!');
//   };

//   const handleQuickView = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setShowQuickView(true);
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('he-IL', {
//       style: 'currency',
//       currency: 'ILS',
//       minimumFractionDigits: 0,
//     }).format(price);
//   };

//   const discountPercentage = product.comparePrice
//     ? Math.round(
//         ((product.comparePrice - product.price) / product.comparePrice) * 100
//       )
//     : 0;

//   const isNew = product.createdAt
//     ? new Date(product.createdAt) >
//       new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
//     : false;

//   const isBestSeller = product.inventory
//     ? product.inventory < 10 && product.inventory > 0
//     : false;

//   return (
//     <>
//       <Link href={`/shop/${product.slug}`}>
//         <Card
//           className="group border-border bg-card hover:shadow-2xl transition-all duration-500 overflow-hidden "
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <div className="relative aspect-square overflow-hidden bg-secondary/30">
//             <Image
//               src={product.image}
//               alt={product.name}
//               fill
//               className={`object-cover transition-all duration-700 ${
//                 imageLoaded ? 'opacity-100' : 'opacity-0'
//               }`}
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//               onLoad={() => setImageLoaded(true)}
//             />

//             {!imageLoaded && (
//               <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/50 to-secondary animate-shimmer"></div>
//             )}

//             <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 ">
//               {isNew && (
//                 <Badge className="bg-black text-white border-none font-mono font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1">
//                   <Sparkles className="h-3 w-3" />
//                   New
//                 </Badge>
//               )}

//               {discountPercentage > 0 && (
//                 <Badge className="bg-black text-white border-none font-mono font-semibold shadow-lg backdrop-blur-sm ">
//                   -{discountPercentage}% OFF
//                 </Badge>
//               )}

//               {isBestSeller && !isNew && (
//                 <Badge className="bg-black text-white border-none font-mono font-semibold shadow-lg backdrop-blur-sm">
//                   Best Seller
//                 </Badge>
//               )}

//               {product.featured && !isNew && !isBestSeller && (
//                 <Badge className="bg-black text-white border-none font-mono font-semibold shadow-lg backdrop-blur-sm">
//                   Featured
//                 </Badge>
//               )}
//             </div>

//             {!product.inStock && (
//               <div className="absolute top-3 right-3 z-10">
//                 <Badge
//                   variant="destructive"
//                   className="font-semibold shadow-lg backdrop-blur-sm"
//                 >
//                   Out of Stock
//                 </Badge>
//               </div>
//             )}

//             {product.inStock && product.inventory && product.inventory <= 3 && (
//               <div className="absolute top-3 right-3 z-10">
//                 <Badge className="bg-orange-500 text-white border-none font-semibold shadow-lg backdrop-blur-sm">
//                   Only {product.inventory} left
//                 </Badge>
//               </div>
//             )}

//             <div
//               className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
//                 isHovered && product.inStock
//                   ? 'opacity-100 '
//                   : 'opacity-0  pointer-events-none'
//               }`}
//               style={{
//                 top:
//                   !product.inStock ||
//                   (product.inventory && product.inventory <= 3)
//                     ? '3.5rem'
//                     : '0.75rem',
//               }}
//             >
//               <Button
//                 size="icon"
//                 variant="secondary"
//                 className="rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm h-9 w-9"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   toast.success('Added to wishlist!');
//                 }}
//               >
//                 <Heart className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="icon"
//                 variant="secondary"
//                 className="rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm h-9 w-9"
//                 onClick={handleQuickView}
//               >
//                 <Eye className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* <div
//               className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-all duration-300 ${
//                 isHovered
//                   ? 'translate-y-0 opacity-100'
//                   : 'translate-y-full opacity-0'
//               }`}
//             >
//               <Button
//                 className="w-full bg-gold-600 hover:bg-gold-700 text-white font-semibold shadow-xl"
//                 onClick={handleAddToCart}
//                 disabled={!product.inStock}
//                 size="sm"
//               >
//                 <ShoppingCart className="mr-2 h-4 w-4" />
//                 {product.inStock ? 'Add to Cart' : 'Out of Stock'}
//               </Button>
//             </div> */}
//           </div>

//           <CardContent className="p-4">
//             <p className="text-xs uppercase tracking-wider text-black font-semibold mb-2">
//               {product.category.name}
//             </p>

//             <h3 className="text-base md:text-m mb-3 line-clamp-2 leading-tight">
//               {product.name}
//             </h3>

//             <div className="flex items-center gap-2 flex-wrap">
//               <p className="text-s md:text-s font-bold text-foreground">
//                 {formatPrice(product.price)}
//               </p>
//               {product.comparePrice && (
//                 <p className="text-base md:text-s text-muted-foreground line-through">
//                   {formatPrice(product.comparePrice)}
//                 </p>
//               )}
//             </div>

//             {/* {product.inStock ? (
//               <p className="text-xs md:text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
//                 <span className="h-2 w-2 bg-green-600 rounded-full"></span>
//                 In Stock
//               </p>
//             ) : (
//               <p className="text-xs md:text-sm text-red-600 mt-2 font-medium flex items-center gap-1">
//                 <span className="h-2 w-2 bg-red-600 rounded-full"></span>
//                 Out of Stock
//               </p>
//             )} */}
//           </CardContent>
//         </Card>
//       </Link>

//       <QuickViewModal
//         product={product}
//         open={showQuickView}
//         onOpenChange={setShowQuickView}
//       />
//     </>
//   );
// }

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Heart, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store'; // ✅ ADD THIS
import { useSession } from 'next-auth/react'; // ✅ ADD THIS
import { useState } from 'react';
import toast from 'react-hot-toast';
import { QuickViewModal } from '@/components/shop/quick-view-modal';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  description?: string;
  inStock: boolean;
  featured: boolean;
  inventory?: number;
  createdAt?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  isWishlistItem?: boolean; // New prop to indicate if this is used in wishlist context
}

export function ProductCard({
  product,
  isWishlistItem = false,
}: ProductCardProps) {
  // Cart store
  const { addItem } = useCartStore();

  // ✅ Wishlist store with renamed methods
  const {
    isInWishlist,
    toggleItem: toggleWishlist,
    removeItem: removeFromWishlist,
  } = useWishlistStore();

  // ✅ Session for auth check
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  // State
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // ✅ Check if in wishlist
  const inWishlist = isInWishlist(product.id);

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }

    // Add to cart
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    // If this is a wishlist item, also remove from wishlist
    if (isWishlistItem) {
      removeFromWishlist(product.id, isAuthenticated);
      toast.success('Moved to cart!');
    } else {
      toast.success('Added to cart!');
    }
  };

  // ✅ Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    toggleWishlist(product.id, isAuthenticated);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  const isNew = product.createdAt
    ? new Date(product.createdAt) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    : false;

  const isBestSeller = product.inventory
    ? product.inventory < 10 && product.inventory > 0
    : false;

  return (
    <>
      <Link href={`/shop/${product.slug}`}>
        <Card
          className="group border-border bg-card hover:shadow-2xl transition-all duration-500 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-square overflow-hidden bg-secondary/30">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {!product.inStock && (
                <Badge variant="destructive" className="shadow-lg">
                  Out of Stock
                </Badge>
              )}
              {product.inStock &&
                product.inventory &&
                product.inventory <= 3 && (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 shadow-lg"
                  >
                    Only {product.inventory} left!
                  </Badge>
                )}
              {discountPercentage > 0 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 shadow-lg"
                >
                  {discountPercentage}% OFF
                </Badge>
              )}
              {isNew && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 shadow-lg"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
              {isBestSeller && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 shadow-lg"
                >
                  Best Seller
                </Badge>
              )}
            </div>

            {/* ✅ Action Buttons - INCLUDING WISHLIST */}
            <div
              className={`absolute right-3 flex flex-col gap-2 z-10 transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                top:
                  !product.inStock ||
                  (product.inventory && product.inventory <= 3)
                    ? '3.5rem'
                    : '0.75rem',
              }}
            >
              {/* ✅ WISHLIST BUTTON */}
              <Button
                size="icon"
                variant="secondary"
                className={`rounded-full shadow-lg backdrop-blur-sm h-9 w-9 transition-colors ${
                  inWishlist
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white/95 hover:bg-white'
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`h-4 w-4 transition-all ${
                    inWishlist ? 'fill-current' : ''
                  }`}
                />
              </Button>

              {/* Quick View Button */}
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm h-9 w-9"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Cart Button on Hover */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-all duration-300 ${
                isHovered && product.inStock
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-full opacity-0'
              }`}
            >
              <Button
                className="w-full bg-gold-600 hover:bg-gold-700 text-white font-semibold shadow-xl"
                onClick={handleCartAction}
                disabled={!product.inStock}
                size="sm"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isWishlistItem ? 'Move to Cart' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wider text-black font-semibold mb-2">
              {product.category.name}
            </p>

            <h3 className="text-base md:text-m mb-3 line-clamp-2 leading-tight">
              {product.name}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-s md:text-s font-bold text-foreground">
                {formatPrice(product.price)}
              </p>
              {product.comparePrice && (
                <p className="text-base md:text-s text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>

      <QuickViewModal
        product={product}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  );
}
