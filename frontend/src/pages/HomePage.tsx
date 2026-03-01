import { useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetAllProducts } from '@/hooks/useQueries';
import { CATEGORIES } from '@/lib/utils';
import type { Product } from '../backend';

interface HomePageProps {
  onAddToCart: (product: Product) => void;
  cartProductIds: Set<string>;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export function HomePage({ onAddToCart, cartProductIds, onNavigate }: HomePageProps) {
  const { data: products, isLoading } = useGetAllProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    onNavigate('catalog', { category });
  };

  const featuredProducts = products
    ? (activeCategory
        ? products.filter(p => p.category === activeCategory)
        : products
      ).slice(0, 8)
    : [];

  return (
    <main className="pb-16">
      {/* Hero */}
      <HeroBanner onShopNow={() => onNavigate('catalog')} />

      {/* Categories */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Find exactly what you need</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat}
              category={cat}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Featured Products</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Our most popular picks</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => onNavigate('catalog')}
            className="text-primary hover:text-primary hover:bg-primary/10 gap-1 text-sm font-semibold"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between items-center pt-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                inCart={cartProductIds.has(product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Value Props Banner */}
      <section className="container mx-auto px-4 mt-14">
        <div className="bg-gradient-to-r from-primary/10 via-accent/20 to-primary/5 rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { emoji: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery available in your area' },
            { emoji: '🌿', title: 'Always Fresh', desc: 'Sourced daily from local farms and suppliers' },
            { emoji: '💳', title: 'Easy Checkout', desc: 'Simple, secure ordering in just a few clicks' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <span className="text-4xl">{emoji}</span>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
