import { useQuery } from '@tanstack/react-query';
import { fetchCollectionProducts } from '@/lib/shopify';

export function useCollectionProducts(handle: string | undefined, count: number = 50) {
  return useQuery({
    queryKey: ['collection-products', handle, count],
    queryFn: () => fetchCollectionProducts(handle!, count),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}
