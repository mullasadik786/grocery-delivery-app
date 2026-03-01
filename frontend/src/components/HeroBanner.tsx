import { ArrowRight, Truck, Leaf, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  onShopNow: () => void;
}

export function HeroBanner({ onShopNow }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-6 mb-8 min-h-[340px] md:min-h-[400px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Fresh groceries"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.08_145/0.85)] via-[oklch(0.18_0.08_145/0.55)] to-[oklch(0.18_0.08_145/0.15)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full min-h-[340px] md:min-h-[400px] px-8 md:px-14 py-10 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-3 py-1 mb-4 w-fit">
          <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
          <span className="text-primary-foreground text-xs font-semibold tracking-wide uppercase">
            Farm Fresh Delivery
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
          Fresh Groceries,
          <br />
          <span className="text-[oklch(0.85_0.14_145)]">Delivered Fast</span>
        </h1>

        <p className="text-white/80 text-base md:text-lg mb-6 leading-relaxed">
          Shop from hundreds of fresh products and get them delivered to your door in no time.
        </p>

        <Button
          onClick={onShopNow}
          size="lg"
          className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg gap-2 group"
        >
          Shop Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 mt-6">
          {[
            { icon: Truck, label: 'Free delivery over $30' },
            { icon: Clock, label: 'Same-day delivery' },
            { icon: Leaf, label: '100% fresh produce' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1"
            >
              <Icon className="w-3.5 h-3.5 text-white/90" />
              <span className="text-white/90 text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
