import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';

export default function UserNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const [location] = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => {
    return location === path ? 'text-primary' : 'hover:text-primary';
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <i className="ri-bank-fill text-primary text-3xl"></i>
                <span className="font-display font-bold text-xl">NIVALUS BANK</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            <Button
              variant={isActive('/') ? "default" : "ghost"}
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link href="/">
                <i className="ri-home-4-line mr-1"></i> Home
              </Link>
            </Button>
            <Button
              variant={isActive('/dashboard') ? "default" : "ghost"}
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link href="/dashboard">
                <i className="ri-dashboard-line mr-1"></i> Dashboard
              </Link>
            </Button>
            <Button
              variant={isActive('/transfer') ? "default" : "ghost"}
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link href="/transfer">
                <i className="ri-exchange-funds-line mr-1"></i> Transfer
              </Link>
            </Button>
            <Button
              variant={isActive('/history') ? "default" : "ghost"}
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link href="/history">
                <i className="ri-history-line mr-1"></i> History
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={handleLogout}
            >
              <i className="ri-logout-box-line mr-1"></i> Logout
            </Button>
            <ThemeToggle />

            {/* User profile indicator */}
            <div className="flex items-center pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              ref={mobileButtonRef}
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <i className="ri-close-line text-lg" />
              ) : (
                <i className="ri-menu-line text-lg" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t bg-background animate-slideDown absolute left-0 right-0 shadow-md z-40 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {/* User profile in mobile menu */}
              <div className="flex items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{user?.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
              </div>

              <Button
                variant={isActive('/') ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/">
                  <i className="ri-home-line mr-3 text-lg"></i> Home
                </Link>
              </Button>
              <Button
                variant={isActive('/dashboard') ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/dashboard">
                  <i className="ri-dashboard-line mr-3 text-lg"></i> Dashboard
                </Link>
              </Button>
              <Button
                variant={isActive('/transfer') ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/transfer">
                  <i className="ri-exchange-funds-line mr-3 text-lg"></i> Transfer
                </Link>
              </Button>
              <Button
                variant={isActive('/history') ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/history">
                  <i className="ri-history-line mr-3 text-lg"></i> History
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <i className="ri-logout-box-line mr-3 text-lg"></i> Logout
              </Button>
            </div>
          </div>
        )}  
      </div>
    </header>
  );
}
