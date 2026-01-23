import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchDialog from './SearchDialog';

interface TopNavBarProps {
  onMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export default function TopNavBar({ onMenuToggle, mobileMenuOpen }: TopNavBarProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? savedTheme === 'dark' : true;
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/70 backdrop-blur-xl border-b border-border/20">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
          
          <div className="text-xl font-semibold text-text-primary">
            The Portal
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 bg-transparent border border-border/50 rounded-lg text-text-tertiary hover:border-border transition-colors"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm">Search...</span>
            <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="bg-transparent text-text-secondary hover:text-text-primary hover:bg-transparent"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Moon className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Sun className="w-5 h-5" strokeWidth={1.5} />
            )}
          </Button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-medium text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity">
            JD
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="bg-transparent text-text-secondary hover:text-text-primary hover:bg-transparent"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
