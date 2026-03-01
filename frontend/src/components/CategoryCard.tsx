import { getCategoryImage } from '@/lib/utils';

interface CategoryCardProps {
  category: string;
  isActive?: boolean;
  onClick: (category: string) => void;
}

export function CategoryCard({ category, isActive, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={() => onClick(category)}
      className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 text-left w-full ${
        isActive
          ? 'border-primary shadow-card-hover scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:shadow-card hover:scale-[1.01]'
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={getCategoryImage(category)}
          alt={category}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
            target.parentElement!.innerHTML = `<span class="text-4xl">🛒</span>`;
          }}
        />
      </div>
      <div
        className={`px-3 py-2.5 transition-colors ${
          isActive ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'
        }`}
      >
        <p className="text-sm font-semibold truncate">{category}</p>
      </div>
    </button>
  );
}
