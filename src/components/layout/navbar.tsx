'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShoppingCart, Search, Menu, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCartStore } from '@/store/cart-store';
import { NavigationSidebar } from './navigation-sidebar';
import { UserMenuSidebar } from './user-menu-sidebar';
import { AuthSidebar } from '@/components/auth/auth-sidebar';
import { useWishlistStore } from '@/store/wishlist-store';
import { SearchBar } from '@/components/search/search-bar';
import Logo from '../logo/logo';

export function Navbar() {
  const { data: session } = useSession();
  const { getTotalItems, toggleCart } = useCartStore();
  // const { settings } = useSettings();
  const [totalItems, setTotalItems] = useState(0);
  const [mounted, setMounted] = useState(false);
  // const totalItems = getTotalItems();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSearch &&
        !(event.target as Element).closest('.search-container')
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  return (
    <>
      {/* Navigation Sidebar */}
      <NavigationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <header className="sticky top-0 z-40 w-full bg-white text-gray-900 border-b border-gray-200 shadow-sm">
        {/* Responsive Navbar Container */}
        <div className="container px-4 md:px-6">
          {/* Mobile Layout: Logo on top, icons below */}
          <div className="sm:hidden">
            {/* Logo centered on top */}
            <div className="flex justify-center items-center">
              <Logo />
            </div>

            {/* Icons and hamburger on bottom with space-between */}
            <div className="flex items-center justify-between">
              {/* Left - Hamburger Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-900 hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </Button>

              {/* Right - Icons and Search */}
              <div className="flex items-center space-x-1 search-container">
                {/* Inline Search for Mobile */}
                <SearchBar
                  showSearch={showSearch}
                  onClose={() => setShowSearch(false)}
                />

                {/* Search Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setShowSearch(!showSearch)}
                  aria-label="Search"
                >
                  <Search className="size-5" />
                </Button>

                {/* Wishlist Icon */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-900 hover:bg-gray-100"
                    onClick={toggleWishlist}
                    aria-label={`Wishlist${wishlistMounted && wishlistCount > 0 ? ` (${wishlistCount} items)` : ''}`}
                  >
                    <Heart className="size-4" />
                  </Button>
                  {wishlistMounted && wishlistCount > 0 && (
                    <span className="absolute top-0 right-0.5 h-4 w-4 min-w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </div>

                {/* Cart Icon */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-900 hover:bg-gray-100"
                    onClick={toggleCart}
                    aria-label={`Cart${mounted && totalItems > 0 ? ` (${totalItems} items)` : ''}`}
                  >
                    <ShoppingCart className="size-4" />
                  </Button>
                  {mounted && totalItems > 0 && (
                    <span className="absolute top-0 right-0.5 h-4 w-4 min-w-4 rounded-full bg-gray-900 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>

                {/* User Icon */}
                {session ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(true)}
                    aria-label="User menu"
                  >
                    <Avatar className="h-6 w-6 border-2 border-gray-300">
                      <AvatarImage
                        src={session.user?.image || undefined}
                        alt={session.user?.name || 'User'}
                      />
                      <AvatarFallback className="bg-gray-900 text-white text-xs font-semibold">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsAuthModalOpen(true)}
                    aria-label="Sign in"
                  >
                    <User className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout: Grid layout */}
          <nav
            className="hidden sm:grid h-12 items-center"
            aria-label="Main navigation"
            style={{
              gridTemplateColumns: '1fr auto 1fr',
              gap: '2rem',
            }}
          >
            {/* Left Side - Hamburger Menu and Search */}
            <div className="flex items-center justify-start">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-900 hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>

              {/* Inline Search */}
              <div className="flex items-center search-container">
                {/* Search Input - slides in from the right */}
                <SearchBar
                  showSearch={showSearch}
                  onClose={() => setShowSearch(false)}
                />

                {/* Search Icon Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setShowSearch(!showSearch)}
                  aria-label="Search"
                >
                  <Search className="size-5" />
                </Button>
              </div>
            </div>

            {/* Center - Logo */}
            <div className="flex items-center justify-center">
              <Logo />
            </div>

            {/* Right Side - Icons */}
            <div className="flex items-center justify-end space-x-1">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={toggleWishlist}
                  aria-label={`Wishlist${wishlistMounted && wishlistCount > 0 ? ` (${wishlistCount} items)` : ''}`}
                >
                  <Heart className="size-5" />
                </Button>
                {wishlistMounted && wishlistCount > 0 && (
                  <span className="absolute top-0 right-0.5 h-4 w-4 min-w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={toggleCart}
                  aria-label={`Cart${mounted && totalItems > 0 ? ` (${totalItems} items)` : ''}`}
                >
                  <ShoppingCart className="size-5" />
                </Button>
                {mounted && totalItems > 0 && (
                  <span className="absolute top-0 right-0.5 h-4 w-4 min-w-4 rounded-full bg-gray-900 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>

              {session ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(true)}
                  aria-label="User menu"
                >
                  <Avatar className="h-7 w-7 md:h-7 md:w-7 border-2 border-gray-300">
                    <AvatarImage
                      src={session.user?.image || undefined}
                      alt={session.user?.name || 'User'}
                    />
                    <AvatarFallback className="bg-gray-900 text-white text-xs">
                      {session.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsAuthModalOpen(true)}
                  aria-label="Sign in"
                >
                  <User className="size-5" />
                </Button>
              )}
            </div>
          </nav>
        </div>
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
