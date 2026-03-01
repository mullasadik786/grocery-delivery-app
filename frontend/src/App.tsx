import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { useCart } from '@/hooks/useCart';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { Product } from './backend';
import type { OrderSummary } from '@/pages/CheckoutPage';

type Page = 'home' | 'catalog' | 'checkout' | 'order-confirmation' | 'orders';

interface NavParams {
  category?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [navParams, setNavParams] = useState<NavParams>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  const cart = useCart();

  const cartProductIds = useMemo(
    () => new Set(cart.items.map(i => i.productId)),
    [cart.items]
  );

  const handleNavigate = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page as Page);
    setNavParams(params ?? {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      productId: product.id,
      name: product.name,
      priceCents: Number(product.priceCents),
      imageUrl: product.imageUrl,
      category: product.category,
    });
    toast.success(`${product.name} added to cart`, {
      description: 'View your cart to checkout',
      duration: 2000,
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && currentPage !== 'catalog') {
      handleNavigate('catalog');
    }
  };

  const handleOrderSuccess = (orderId: string, summary: OrderSummary) => {
    setOrderSummary(summary);
    handleNavigate('order-confirmation');
  };

  const cartHandlers = {
    addItem: cart.addItem,
    increaseQuantity: cart.increaseQuantity,
    decreaseQuantity: cart.decreaseQuantity,
    removeItem: cart.removeItem,
    clearCart: cart.clearCart,
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onAddToCart={handleAddToCart}
            cartProductIds={cartProductIds}
            onNavigate={handleNavigate}
          />
        );
      case 'catalog':
        return (
          <CatalogPage
            onAddToCart={handleAddToCart}
            cartProductIds={cartProductIds}
            initialCategory={navParams.category}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cartItems={cart.items}
            subtotalCents={cart.subtotalCents}
            onBack={() => handleNavigate('catalog')}
            onOrderSuccess={handleOrderSuccess}
            onClearCart={cart.clearCart}
          />
        );
      case 'order-confirmation':
        return orderSummary ? (
          <OrderConfirmationPage
            orderSummary={orderSummary}
            onContinueShopping={() => handleNavigate('home')}
            onViewOrders={() => handleNavigate('orders')}
          />
        ) : null;
      case 'orders':
        return <OrdersPage />;
      default:
        return (
          <HomePage
            onAddToCart={handleAddToCart}
            cartProductIds={cartProductIds}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        cartItemCount={cart.totalItems}
        onCartClick={() => setCartOpen(true)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <div className="flex-1">
        {renderPage()}
      </div>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        subtotalCents={cart.subtotalCents}
        totalItems={cart.totalItems}
        handlers={cartHandlers}
        onCheckout={() => handleNavigate('checkout')}
      />

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
