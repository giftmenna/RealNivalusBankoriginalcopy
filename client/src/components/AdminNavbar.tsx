import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  CircleDollarSign, 
  Menu, 
  LogOut, 
  Settings,
  Building
} from 'lucide-react';

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = async () => {
    await logout();
  };
  
  const isActive = (path: string) => {
    return location.startsWith(path);
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { path: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4 mr-2" /> },
    { path: '/admin/transactions', label: 'Transactions', icon: <CircleDollarSign className="h-4 w-4 mr-2" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];
  
  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Nivalus Admin</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                className="flex items-center"
                asChild
              >
                <Link href={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? 
                <i className="ri-close-line text-lg" /> : 
                <Menu className="h-5 w-5" />
              }
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-slideDown absolute left-0 right-0 shadow-md z-20">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
