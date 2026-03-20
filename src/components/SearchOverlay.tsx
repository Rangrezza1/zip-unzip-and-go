import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { fetchProducts, ShopifyProduct, formatPrice, getDiscountPercentage } from '@/lib/shopify';
import { trackSearch } from '@/lib/tiktokPixel';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults([]);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const products = await fetchProducts(8, `title:${query}*`);
        setResults(products);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background animate-fade-in">
      <div className="container max-w-lg pt-4">
        <div className="flex items-center gap-3 border-b border-foreground/20 pb-3">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-body"
          />
          <button onClick={onClose} className="p-1 active:scale-95 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 max-h-[80vh] overflow-y-auto">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map(product => {
                const price = product.node.priceRange.minVariantPrice;
                const compareAt = product.node.compareAtPriceRange?.maxVariantPrice?.amount;
                const discount = getDiscountPercentage(price.amount, compareAt);

                return (
                  <a
                    key={product.node.id}
                    href={`/product/${product.node.handle}`}
                    onClick={onClose}
                    className="flex gap-3 p-2.5 hover:bg-secondary/50 transition-colors active:bg-secondary"
                  >
                    {product.node.images.edges[0] && (
                      <img
                        src={product.node.images.edges[0].node.url}
                        alt={product.node.images.edges[0].node.altText || product.node.title}
                        className="w-12 h-[60px] object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-2 leading-tight">{product.node.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-sm font-bold">
                          {formatPrice(price.amount, price.currencyCode)}
                        </span>
                        {discount && compareAt && (
                          <span className="price-compare text-[10px]">
                            {formatPrice(compareAt, price.currencyCode)}
                          </span>
                        )}
                        {discount && (
                          <span className="text-[10px] font-bold text-destructive">-{discount}%</span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No products found for "{query}"</p>
          )}
          {!query && (
            <p className="text-center text-muted-foreground/60 text-xs py-8">Start typing to search...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
