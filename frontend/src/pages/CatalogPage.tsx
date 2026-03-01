import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGetAllProducts } from '@/hooks/useQueries';
import { CATEGORIES } from '@/lib/utils';
import type { Product } from '../backend';

interface CatalogPageProps {
  onAddToCart: (product: Product) => void;
  cartProductIds: Set<string>;
  initialCategory?: string;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export function CatalogPage({ onAddToCart, cartProductIds, initialCategory }: CatalogPageProps) {
  const { data: products, isLoading } = useGetAllProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory ?? 'all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => Number(a.priceCents) - Number(b.priceCents));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.priceCents) - Number(a.priceCents));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy, searchQuery]);

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + (sortBy !== 'default' ? 1 : 0);

  return (
    <main className="container mx-auto px-4 py-8 pb-16">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">All Products</h1>
        <p className="text-muted-foreground mt-1">
          {isLoading ? 'Loading...' : `${filteredProducts.length} products available`}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-card border border-border rounded-xl shadow-xs">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] h-9 text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A–Z</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategory('all');
              setSortBy('default');
            }}
            className="h-9 text-sm text-muted-foreground hover:text-foreground gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
            <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
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
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">🔍</span>
          <h3 className="font-semibold text-lg text-foreground">No products found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Try adjusting your filters or search query
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSelectedCategory('all');
              setSortBy('default');
              setSearchQuery('');
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              inCart={cartProductIds.has(product.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
