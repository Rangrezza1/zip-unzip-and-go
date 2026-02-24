import { useCollectionProducts } from '@/hooks/useCollectionProducts';
import { useThemeStore } from '@/stores/themeStore';
import ProductCard from './ProductCard';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCallback } from 'react';

const BestSellingCarousel = () => {
  const settings = useThemeStore(s => s.theme.bestSelling ?? { enabled: true, collectionHandle: '', headline: 'Best Sellers', productLimit: 10, autoScroll: false });
  const { data, isLoading } = useCollectionProducts(settings.collectionHandle || undefined, settings.productLimit);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!settings.enabled || !settings.collectionHandle) return null;

  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title">{settings.headline}</h2>
            <div className="w-8 h-1 bg-primary rounded-full mt-2" />
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={scrollPrev} className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={scrollNext} className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && data && data.products.length > 0 && (
          <div ref={emblaRef} className="overflow-hidden -mx-1">
            <div className="flex">
              {data.products.map(product => (
                <div key={product.node.id} className="flex-[0_0_45%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 px-1">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && (!data || data.products.length === 0) && (
          <p className="text-center text-muted-foreground py-8">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default BestSellingCarousel;
