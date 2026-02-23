import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest } from '@/lib/shopify';

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  image: { url: string; altText: string | null } | null;
}

const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

async function fetchCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const data = await storefrontApiRequest(COLLECTIONS_QUERY, { first });
  return (data?.data?.collections?.edges || []).map(
    (edge: { node: ShopifyCollection }) => edge.node
  );
}

export function useCollections(count: number = 20) {
  return useQuery<ShopifyCollection[]>({
    queryKey: ['collections', count],
    queryFn: () => fetchCollections(count),
    staleTime: 5 * 60 * 1000,
  });
}
