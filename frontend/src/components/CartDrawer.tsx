import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/utils';
import type { CartItem, CartHandlers } from '@/hooks/useCart';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotalCents: number;
  totalItems: number;
  handlers: CartHandlers;
  onCheckout: () => void;
}

export function CartDrawer({
  open,
  onClose,
  items,
  subtotalCents,
  totalItems,
  handlers,
  onCheckout,
}: CartDrawerProps) {
  const deliveryFee = subtotalCents >= 3000 ? 0 : 299;
  const totalCents = subtotalCents + deliveryFee;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart
            {totalItems > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl">
              🛒
            </div>
            <div>
              <p className="font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some fresh groceries to get started!
              </p>
            </div>
            <Button onClick={onClose} variant="outline" className="mt-2">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5 py-3">
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 bg-muted/40 rounded-xl p-3"
                  >
                    {/* Emoji placeholder */}
                    <div className="w-12 h-12 rounded-lg bg-accent/40 flex items-center justify-center text-2xl shrink-0">
                      🛒
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.priceCents)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 rounded-lg hover:bg-primary/10"
                        onClick={() => handlers.decreaseQuantity(item.productId)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 rounded-lg hover:bg-primary/10"
                        onClick={() => handlers.increaseQuantity(item.productId)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 rounded-lg hover:bg-destructive/10 hover:text-destructive ml-1"
                        onClick={() => handlers.removeItem(item.productId)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-5 py-4 border-t border-border bg-card">
              {/* Order summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-primary font-medium' : 'font-medium'}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatPrice(3000 - subtotalCents)} more for free delivery
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="price-text">{formatPrice(totalCents)}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11 gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
