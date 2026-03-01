import { CheckCircle2, MapPin, Clock, Package, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import type { OrderSummary } from './CheckoutPage';

interface OrderConfirmationPageProps {
  orderSummary: OrderSummary;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

const DELIVERY_TIME_LABELS: Record<string, string> = {
  '9am-12pm': 'Today, 9:00 AM – 12:00 PM',
  '12pm-3pm': 'Today, 12:00 PM – 3:00 PM',
  '3pm-6pm': 'Today, 3:00 PM – 6:00 PM',
  '6pm-9pm': 'Today, 6:00 PM – 9:00 PM',
  'tomorrow-morning': 'Tomorrow Morning',
  'tomorrow-afternoon': 'Tomorrow Afternoon',
};

export function OrderConfirmationPage({
  orderSummary,
  onContinueShopping,
  onViewOrders,
}: OrderConfirmationPageProps) {
  const deliveryLabel = DELIVERY_TIME_LABELS[orderSummary.deliveryTime] ?? orderSummary.deliveryTime;

  return (
    <main className="container mx-auto px-4 py-12 pb-16 max-w-2xl">
      {/* Success Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Order Confirmed! 🎉
        </h1>
        <p className="text-muted-foreground text-base">
          Thank you, <strong className="text-foreground">{orderSummary.buyerName}</strong>! Your fresh groceries are on their way.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5">
          <span className="text-xs text-muted-foreground">Order ID:</span>
          <code className="text-xs font-mono font-semibold text-foreground">
            {orderSummary.orderId.slice(0, 20)}...
          </code>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-primary/8 border border-primary/20 rounded-xl p-5 mb-6 space-y-3">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          Delivery Details
        </h2>
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Delivery Address</p>
            <p className="text-muted-foreground">{orderSummary.deliveryAddress}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Estimated Delivery</p>
            <p className="text-muted-foreground">{deliveryLabel}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
        <div className="space-y-2">
          {orderSummary.items.map(item => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(item.priceCents * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(orderSummary.subtotalCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className={orderSummary.totalCents === orderSummary.subtotalCents ? 'text-primary font-medium' : ''}>
              {orderSummary.totalCents === orderSummary.subtotalCents ? 'FREE' : formatPrice(orderSummary.totalCents - orderSummary.subtotalCents)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total Paid</span>
            <span className="price-text">{formatPrice(orderSummary.totalCents)}</span>
          </div>
        </div>
      </div>

      {/* Friendly message */}
      <div className="bg-accent/30 rounded-xl p-4 mb-8 text-center">
        <p className="text-sm text-accent-foreground">
          🌿 Your order is being prepared with care. Fresh, quality groceries will arrive at your door soon!
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onContinueShopping}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11 gap-2 group"
        >
          <Home className="w-4 h-4" />
          Continue Shopping
        </Button>
        <Button
          onClick={onViewOrders}
          variant="outline"
          className="flex-1 rounded-xl h-11 gap-2 group"
        >
          View All Orders
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </main>
  );
}
