import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCollectionProducts } from '@/hooks/useCollectionProducts';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import { Loader2, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { ShopifyProduct } from '@/lib/shopify';

const SORT_OPTIONS = [
  { label: 'Featured', value: '' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Best Selling', value: 'best-selling' },
];

const CollectionPage = () => {
  const { collection } = useParams<{ collection?: string }>();
  const { data: collectionData, isLoading: collectionLoading } = useCollectionProducts(collection);
  const { data: allProducts, isLoading: allLoading } = useProducts(50);
  const isSpecificCollection = !!collection;
  const products = isSpecificCollection ? collectionData?.products : allProducts;
  const isLoading = isSpecificCollection ? collectionLoading : allLoading;
  const title = isSpecificCollection ? (collectionData?.title || collection) : 'All Products';
  const description = isSpecificCollection ? (collectionData?.description || `Browse our ${title} collection`) : 'Browse our complete collection';
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ShopifyProduct | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999]);

  const sortedProducts = products ? [...products]
    .filter(p => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      if (activeSort === 'price-asc') return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
      if (activeSort === 'price-desc') return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
      return 0;
    }) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="bg-charcoal text-cream py-8 md:py-12 text-center">
          <div className="container">
            <h1 className="font-display text-2xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-cream/60 text-xs md:text-sm">{description}</p>
          </div>
        </div>
        <div className="container py-4 md:py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setFilterOpen(true)} className="flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors md:hidden">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
              </button>
              {!isLoading && sortedProducts.length > 0 && (
                <p className="text-xs text-muted-foreground">{sortedProducts.length} products</p>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
                Sort <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-background border shadow-lg z-20 min-w-[180px]">
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setActiveSort(opt.value); setSortOpen(false); }}
                        className={`block w-full text-left px-4 py-2.5 text-xs tracking-wider transition-colors ${activeSort === opt.value ? 'bg-secondary font-semibold' : 'hover:bg-secondary/50'}`}
                      >{opt.label}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}
          {!isLoading && sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-2">No products found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
            </div>
          )}
          {sortedProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {sortedProducts.map(product => (
                <ProductCard key={product.node.id} product={product} onQuickView={() => setQuickViewProduct(product)} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      {filterOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={() => setFilterOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-background shadow-2xl flex flex-col" style={{ animation: 'slide-from-left 0.25s ease-out' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-display text-base font-bold">Filters</span>
              <button onClick={() => setFilterOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-xs font-bold tracking-[0.15em] uppercase mb-3">Sort By</h4>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setActiveSort(opt.value)}
                    className={`block w-full text-left py-2 text-sm transition-colors ${activeSort === opt.value ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                  >{opt.label}</button>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-[0.15em] uppercase mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[[0, 1000], [1000, 3000], [3000, 5000], [5000, 10000], [0, 99999]].map(([min, max]) => (
                    <button key={`${min}-${max}`} onClick={() => setPriceRange([min, max])}
                      className={`block w-full text-left py-1.5 text-sm transition-colors ${priceRange[0] === min && priceRange[1] === max ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                    >{max === 99999 ? 'All Prices' : `Rs. ${min.toLocaleString()} - Rs. ${max.toLocaleString()}`}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-auto border-t p-4">
              <button onClick={() => { setPriceRange([0, 99999]); setActiveSort(''); }} className="w-full cta-button-outline text-xs py-2.5">Clear All</button>
            </div>
          </div>
          <style>{`@keyframes slide-from-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
        </div>
      )}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default CollectionPage;
