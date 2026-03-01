import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  inCart?: boolean;
}

const PRODUCT_EMOJIS: Record<string, string> = {
  'banana': '🍌', 'milk': '🥛', 'bread': '🍞', 'orange juice': '🍊',
  'chips': '🥔', 'apple': '🍎', 'cheese': '🧀', 'croissant': '🥐',
  'coffee': '☕', 'cookie': '🍪', 'lettuce': '🥬', 'yogurt': '🥛',
  'baguette': '🥖', 'tea': '🍵', 'granola': '🌾', 'tomato': '🍅',
  'butter': '🧈', 'muffin': '🧁', 'soda': '🥤', 'pretzel': '🥨',
};

function getProductEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(PRODUCT_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🛒';
}

export function ProductCard({ product, onAddToCart, inCart }: ProductCardProps) {
  const isOutOfStock = !product.available || product.stockQuantity === BigInt(0);

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
      {/* Image area */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-muted to-accent/30">
          <span>{getProductEmoji(product.name)}</span>
        </div>
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="tag-badge text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="font-bold text-base price-text">
            {formatPrice(product.priceCents)}
          </span>
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`h-8 px-3 text-xs font-semibold rounded-lg gap-1 transition-all ${
              inCart
                ? 'bg-primary/15 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {inCart ? (
              <>
                <Plus className="w-3 h-3" />
                Add More
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
