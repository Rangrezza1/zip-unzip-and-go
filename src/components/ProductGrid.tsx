import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { Loader2, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface ProductGridProps {
  title?: string;
  count?: number;
  query?: string;
}

const SORT_OPTIONS = [
  { label: 'Featured', value: '' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Best Selling', value: 'best-selling' },
];

const ProductGrid = ({ title = "Our Collection", count = 20, query }: ProductGridProps) => {
  const { data: products, isLoading, error } = useProducts(count, query);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('');

  const sortedProducts = products ? [...products].sort((a, b) => {
    if (activeSort === 'price-asc') return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
    if (activeSort === 'price-desc') return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
    return 0;
  }) : [];

  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="section-title">{title}</h2>
          
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sort
              <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-background border shadow-lg rounded-sm z-20 min-w-[180px]">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setActiveSort(opt.value); setSortOpen(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-xs tracking-wider transition-colors ${
                        activeSort === opt.value ? 'bg-secondary font-semibold' : 'hover:bg-secondary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {!isLoading && sortedProducts.length > 0 && (
          <p className="text-xs text-muted-foreground mb-4">{sortedProducts.length} products</p>
        )}
        
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <p className="text-center text-muted-foreground py-16">
            Failed to load products. Please try again.
          </p>
        )}

        {!isLoading && !error && sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">
              Add products by telling us what you'd like to sell!
            </p>
          </div>
        )}

        {sortedProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {sortedProducts.map(product => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
