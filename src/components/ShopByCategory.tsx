import { useRef, useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ShopByCategory = () => {
  const categoryItems = useThemeStore((s) => s.theme.categoryItems);
  const carousel = useThemeStore((s) => s.theme.categoryCarousel);
  const enabledItems = categoryItems.filter((c) => c.enabled);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const sizeMap = { small: 'w-[90px] md:w-[110px]', medium: 'w-[120px] md:w-[150px]', large: 'w-[160px] md:w-[200px]' };
  const imgSizeMap = { small: 'h-[90px] md:h-[110px]', medium: 'h-[120px] md:h-[150px]', large: 'h-[160px] md:h-[200px]' };
  const itemClass = sizeMap[carousel.itemSize || 'small'];
  const imgClass = imgSizeMap[carousel.itemSize || 'small'];

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [enabledItems.length]);

  // Auto-scroll
  useEffect(() => {
    if (!carousel.autoScroll || enabledItems.length <= 3) return;
    const el = scrollRef.current;
    if (!el) return;
    let direction = 1;
    const timer = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 5) direction = -1;
      if (el.scrollLeft <= 5) direction = 1;
      el.scrollBy({ left: direction * 2, behavior: 'smooth' });
    }, 50 / (carousel.scrollSpeed || 3));
    return () => clearInterval(timer);
  }, [carousel.autoScroll, carousel.scrollSpeed, enabledItems.length]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  if (enabledItems.length === 0) return null;

  return (
    <section className="py-4 md:py-6">
      <div className="container">
        <h2 className="section-title mb-3 text-base md:text-lg">Shop by Category</h2>
        <div className="relative group">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 shadow-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide"
          >
            {enabledItems.map((cat) => (
              <a
                key={cat.id}
                href={cat.slug ? `/collections/${cat.slug}` : '/collections'}
                className={`flex-shrink-0 snap-start ${itemClass} bg-secondary/50 hover:bg-secondary transition-colors text-center group/card overflow-hidden`}
              >
                {cat.imageUrl ? (
                  <div className={`w-full ${imgClass} overflow-hidden ${carousel.roundedImages ? 'rounded-full mx-auto aspect-square' : ''}`}
                    style={carousel.roundedImages ? { width: '80%', margin: '8% auto 0' } : undefined}
                  >
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className={`w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300 ${carousel.roundedImages ? 'rounded-full' : ''}`}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className={`w-full ${imgClass} bg-muted flex items-center justify-center`}>
                    <span className="text-2xl text-muted-foreground">🛍️</span>
                  </div>
                )}
                {carousel.showTitle && (
                  <div className="p-2">
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.1em] uppercase group-hover/card:text-primary transition-colors line-clamp-1">
                      {cat.title}
                    </span>
                  </div>
                )}
              </a>
            ))}
          </div>
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 shadow-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
