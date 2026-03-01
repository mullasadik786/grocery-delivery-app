import { ShoppingCart, Search, Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({
  cartItemCount,
  onCartClick,
  onSearch,
  searchQuery,
  currentPage,
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'catalog' },
    { label: 'Orders', page: 'orders' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
              <img
                src="/assets/generated/logo-icon.dim_128x128.png"
                alt="FreshCart logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<span class="text-primary font-bold text-lg">🌿</span>';
                }}
              />
            </div>
            <span className="font-display font-semibold text-lg text-foreground hidden sm:block group-hover:text-primary transition-colors">
              FreshCart
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search groceries..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-border focus:bg-card text-sm"
            />
          </div>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onCartClick}
            className="relative shrink-0 hover:bg-primary/10"
            aria-label={`Cart with ${cartItemCount} items`}
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                  currentPage === link.page
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
