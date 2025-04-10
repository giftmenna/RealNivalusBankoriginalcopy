import React, { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full hover:bg-primary-700 dark:hover:bg-dark-lighter transition-colors"
      aria-label="Toggle theme"
    >
      <i className="ri-moon-line dark:hidden"></i>
      <i className="ri-sun-line hidden dark:block"></i>
    </button>
  );
}
