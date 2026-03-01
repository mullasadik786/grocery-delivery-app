import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: bigint | number): string {
  const amount = typeof cents === 'bigint' ? Number(cents) : cents;
  return `$${(amount / 100).toFixed(2)}`;
}

export function getCategoryImage(category: string): string {
  const map: Record<string, string> = {
    'Fruits & Vegetables': '/assets/generated/cat-fruits-veggies.dim_400x300.png',
    'Dairy': '/assets/generated/cat-dairy.dim_400x300.png',
    'Bakery': '/assets/generated/cat-bakery.dim_400x300.png',
    'Beverages': '/assets/generated/cat-beverages.dim_400x300.png',
    'Snacks': '/assets/generated/cat-snacks.dim_400x300.png',
  };
  return map[category] ?? '/assets/generated/cat-snacks.dim_400x300.png';
}

export const CATEGORIES = [
  'Fruits & Vegetables',
  'Dairy',
  'Bakery',
  'Beverages',
  'Snacks',
] as const;

export type Category = typeof CATEGORIES[number];
