import { useState } from 'react';
import { ArrowLeft, ShoppingBag, MapPin, User, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';
import { usePlaceOrder } from '@/hooks/useQueries';
import type { CartItem } from '@/hooks/useCart';

interface CheckoutPageProps {
  cartItems: CartItem[];
  subtotalCents: number;
  onBack: () => void;
  onOrderSuccess: (orderId: string, orderData: OrderSummary) => void;
  onClearCart: () => void;
}

export interface OrderSummary {
  orderId: string;
  buyerName: string;
  deliveryAddress: string;
  items: CartItem[];
  subtotalCents: number;
  totalCents: number;
  deliveryTime: string;
}

interface FormData {
  buyerName: string;
  street: string;
  city: string;
  zip: string;
  deliveryTime: string;
}

interface FormErrors {
  buyerName?: string;
  street?: string;
  city?: string;
  zip?: string;
  deliveryTime?: string;
}

export function CheckoutPage({
  cartItems,
  subtotalCents,
  onBack,
  onOrderSuccess,
  onClearCart,
}: CheckoutPageProps) {
  const [form, setForm] = useState<FormData>({
    buyerName: '',
    street: '',
    city: '',
    zip: '',
    deliveryTime: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const placeOrder = usePlaceOrder();

  const deliveryFee = subtotalCents >= 3000 ? 0 : 299;
  const totalCents = subtotalCents + deliveryFee;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.buyerName.trim()) newErrors.buyerName = 'Name is required';
    if (!form.street.trim()) newErrors.street = 'Street address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) newErrors.zip = 'Enter a valid ZIP code';
    if (!form.deliveryTime) newErrors.deliveryTime = 'Please select a delivery time';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const deliveryAddress = `${form.street}, ${form.city}, ${form.zip}`;
    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      quantity: BigInt(item.quantity),
    }));

    try {
      const orderId = await placeOrder.mutateAsync({
        buyerName: form.buyerName.trim(),
        deliveryAddress,
        items: orderItems,
      });

      onClearCart();
      onOrderSuccess(orderId, {
        orderId,
        buyerName: form.buyerName.trim(),
        deliveryAddress,
        items: cartItems,
        subtotalCents,
        totalCents,
        deliveryTime: form.deliveryTime,
      });
    } catch (err) {
      console.error('Order failed:', err);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 pb-16 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Checkout</h1>
          <p className="text-sm text-muted-foreground">Complete your order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Info */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Personal Information</h2>
              </div>
              <div>
                <Label htmlFor="buyerName" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="buyerName"
                  value={form.buyerName}
                  onChange={e => updateField('buyerName', e.target.value)}
                  placeholder="Jane Smith"
                  className={`mt-1.5 ${errors.buyerName ? 'border-destructive' : ''}`}
                />
                {errors.buyerName && (
                  <p className="text-destructive text-xs mt-1">{errors.buyerName}</p>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Delivery Address</h2>
              </div>
              <div>
                <Label htmlFor="street" className="text-sm font-medium">
                  Street Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="street"
                  value={form.street}
                  onChange={e => updateField('street', e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                  className={`mt-1.5 ${errors.street ? 'border-destructive' : ''}`}
                />
                {errors.street && (
                  <p className="text-destructive text-xs mt-1">{errors.street}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                    placeholder="New York"
                    className={`mt-1.5 ${errors.city ? 'border-destructive' : ''}`}
                  />
                  {errors.city && (
                    <p className="text-destructive text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="zip" className="text-sm font-medium">
                    ZIP Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="zip"
                    value={form.zip}
                    onChange={e => updateField('zip', e.target.value)}
                    placeholder="10001"
                    className={`mt-1.5 ${errors.zip ? 'border-destructive' : ''}`}
                  />
                  {errors.zip && (
                    <p className="text-destructive text-xs mt-1">{errors.zip}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Delivery Time</h2>
              </div>
              <div>
                <Label htmlFor="deliveryTime" className="text-sm font-medium">
                  Preferred Time Slot <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.deliveryTime}
                  onValueChange={v => updateField('deliveryTime', v)}
                >
                  <SelectTrigger
                    id="deliveryTime"
                    className={`mt-1.5 ${errors.deliveryTime ? 'border-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9am-12pm">Today, 9:00 AM – 12:00 PM</SelectItem>
                    <SelectItem value="12pm-3pm">Today, 12:00 PM – 3:00 PM</SelectItem>
                    <SelectItem value="3pm-6pm">Today, 3:00 PM – 6:00 PM</SelectItem>
                    <SelectItem value="6pm-9pm">Today, 6:00 PM – 9:00 PM</SelectItem>
                    <SelectItem value="tomorrow-morning">Tomorrow Morning</SelectItem>
                    <SelectItem value="tomorrow-afternoon">Tomorrow Afternoon</SelectItem>
                  </SelectContent>
                </Select>
                {errors.deliveryTime && (
                  <p className="text-destructive text-xs mt-1">{errors.deliveryTime}</p>
                )}
              </div>
            </div>

            {/* Error from backend */}
            {placeOrder.isError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">
                Failed to place order. Please check your cart and try again.
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Order Summary</h2>
              </div>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotalCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-primary font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="price-text">{formatPrice(totalCents)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={placeOrder.isPending || cartItems.length === 0}
                className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11 gap-2"
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
