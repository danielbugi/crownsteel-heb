'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, User, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCartStore } from '@/store/cart-store';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { NavigationSidebar } from './navigation-sidebar';
import { UserMenuSidebar } from './user-menu-sidebar';
import { AuthSidebar } from '@/components/auth/auth-sidebar';
// import { useSettings } from '@/contexts/settings-context';
import { useLanguage } from '@/contexts/language-context';
import { useWishlistStore } from '@/store/wishlist-store';
import Logo from '../ui/logo';

export function Navbar() {
  const { data: session } = useSession();
  const { getTotalItems, toggleCart } = useCartStore();
  // const { settings } = useSettings();
  const { t, direction } = useLanguage();
  const router = useRouter();
  const [totalItems, setTotalItems] = useState(0);
  const [mounted, setMounted] = useState(false);
  // const totalItems = getTotalItems();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // Wishlist
  const { getItemCount: getWishlistCount, toggleWishlist } = useWishlistStore();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistMounted, setWishlistMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTotalItems(getTotalItems());
  }, [getTotalItems]);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = useCartStore.subscribe((state) => {
      setTotalItems(state.getTotalItems());
    });

    return unsubscribe;
  }, [mounted]);

  useEffect(() => {
    setWishlistMounted(true);
    setWishlistCount(getWishlistCount());
  }, [getWishlistCount]);

  useEffect(() => {
    if (!wishlistMounted) return;

    const unsubscribe = useWishlistStore.subscribe((state) => {
      setWishlistCount(state.getItemCount());
    });

    return unsubscribe;
  }, [wishlistMounted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <>
      {/* Navigation Sidebar */}
      <NavigationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <header className="sticky top-0 py-2 z-40 w-full bg-black text-white shadow-lg">
        <nav
          className="container flex h-20 items-center justify-between px-4 md:px-6"
          aria-label="Main navigation"
          dir={direction}
        >
          {/* Left Side - Hamburger Menu */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Center - Logo */}
          <Logo />

          {/* Right Side - Icons Only */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* ✅ WISHLIST ICON - ADD THIS */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10"
              onClick={toggleWishlist}
              aria-label={`${t('nav.wishlist')}${wishlistMounted && wishlistCount > 0 ? ` (${wishlistCount} items)` : ''}`}
            >
              <Heart className="h-5 w-5" />
              {wishlistMounted && wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold shadow-lg"
                  aria-label={`${wishlistCount} items in wishlist`}
                >
                  {wishlistCount}
                </span>
              )}
            </Button>

            {/* Globe Icon - Language Toggle */}
            <LanguageToggle />

            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10"
              onClick={toggleCart}
              aria-label={`${t('nav.cart')}${mounted && totalItems > 0 ? ` (${totalItems} items)` : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold-500 text-white text-xs flex items-center justify-center font-bold shadow-lg"
                  aria-label={`${totalItems} items in cart`}
                >
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User Icon */}
            {session ? (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setIsUserMenuOpen(true)}
                aria-label="User menu"
              >
                <Avatar className="h-7 w-7 md:h-8 md:w-8 border-2 border-gold-400">
                  <AvatarImage
                    src={session.user?.image || undefined}
                    alt={session.user?.name || 'User'}
                  />
                  <AvatarFallback className="bg-gold-500 text-white text-xs">
                    {session.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setIsAuthModalOpen(true)}
                aria-label="Sign in"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </nav>

        {/* Search Bar Dropdown */}
        {showSearch && (
          <div className="border-t border-white/10 bg-black">
            <div className="container px-4 py-4">
              <form
                onSubmit={handleSearch}
                className="relative max-w-md mx-auto"
              >
                <Input
                  type="search"
                  placeholder={t('nav.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full  bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 text-white hover:bg-white/10"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Auth Sidebar */}
      <AuthSidebar
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Menu Sidebar */}
      <UserMenuSidebar
        isOpen={session ? isUserMenuOpen : false}
        onClose={() => setIsUserMenuOpen(false)}
        user={
          session
            ? {
                name: session.user?.name,
                email: session.user?.email,
                image: session.user?.image,
                role: (session.user as { role?: string })?.role,
              }
            : null
        }
      />
    </>
  );
}
