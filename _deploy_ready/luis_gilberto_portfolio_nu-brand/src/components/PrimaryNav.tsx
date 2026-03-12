import { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

interface PrimaryNavProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function PrimaryNav({ isDark, toggleTheme }: PrimaryNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const navLinks = [
    { label: 'Portfolio', href: '/', active: false },
    { label: 'Timeline', href: '/timeline', active: false },
    { label: 'Brand', href: '/brand', active: true },
    { label: 'Insights', href: '#insights', active: false },
    { label: 'The Hub', href: '#hub', active: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="text-2xl font-serif font-bold text-foreground">
            Luis Gilberto
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuLink
                      href={link.href}
                      className={`transition-colors duration-200 font-normal text-base ${
                        link.active 
                          ? 'text-primary font-medium' 
                          : 'text-foreground/70 hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hover:bg-transparent"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hover:bg-transparent"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hover:bg-transparent"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-background border-t border-border">
            <NavigationMenu orientation="vertical" className="w-full">
              <NavigationMenuList className="flex-col items-start gap-4 w-full">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.label} className="w-full">
                    <NavigationMenuLink
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`transition-colors duration-200 text-base block py-2 ${
                        link.active 
                          ? 'text-primary font-medium' 
                          : 'text-foreground/70 hover:text-primary font-normal'
                      }`}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
      </nav>
    </header>
  );
}
