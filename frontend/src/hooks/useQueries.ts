import { useQuery, useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Order, OrderItem } from '../backend';

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      buyerName,
      deliveryAddress,
      items,
    }: {
      buyerName: string;
      deliveryAddress: string;
      items: OrderItem[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.placeOrder(buyerName, deliveryAddress, items);
    },
  });
}
