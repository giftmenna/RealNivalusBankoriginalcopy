import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const isAdminSection = location.startsWith('/admin');

  if (!isAuthenticated) {
    return (
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="20"
                viewBox="0 0 150 50"
                className="h-14 w-20 text-primary"
              >
                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20,10 L30,40 M30,10 L20,40 M40,10 L40,40 M50,10 L50,40 M60,10 L70,25 L60,40 M80,10 L75,25 L80,40 M90,10 L90,40 M90,25 L100,25 M110,10 L110,40 L120,40 M130,10 L130,40" />
                </g>
              </svg>
              <span className="font-display font-bold text-xl">Nivalus Bank</span>
            </div>

            <nav className="hidden md:flex space-x-8 items-center">
              <Button variant={location === '/' ? 'default' : 'ghost'} size="sm" asChild>
                <Link href="/">Home</Link>
              </Button>
              <Button variant={location === '/login' ? 'default' : 'ghost'} size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant={location === '/signup' ? 'default' : 'ghost'} size="sm" asChild>
                <Link href="/signup">Signup</Link>
              </Button>
              <ThemeToggle />
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                {mobileMenuOpen ? <i className="ri-close-line text-lg" /> : <i className="ri-menu-line text-lg" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-background animate-slideDown absolute left-0 right-0 shadow-md z-40">
              <div className="container mx-auto px-4 py-3 space-y-1">
                <Button variant={location === '/' ? 'default' : 'ghost'} size="sm" className="w-full justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/">Home</Link>
                </Button>
                <Button variant={location === '/login' ? 'default' : 'ghost'} size="sm" className="w-full justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant={location === '/signup' ? 'default' : 'ghost'} size="sm" className="w-full justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/signup">Signup</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }

  if (isAdminSection && user?.role === 'admin') {
    return <AdminNavbar />;
  }

  return <UserNavbar />;
}