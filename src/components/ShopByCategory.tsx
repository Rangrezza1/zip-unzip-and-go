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
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
  };

  if (enabledItems.length === 0) return null;

  return (
    <section className="py-5 md:py-8">
      <div className="container">
        {/* Gen Z header with emoji accent */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold tracking-tight uppercase">
              Shop by Category
            </h2>
            <span className="text-lg">🔥</span>
          </div>
          <div className="hidden md:flex gap-1.5">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 border-2 border-foreground/20 rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 border-2 border-foreground/20 rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-all disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable category cards */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide"
          >
            {enabledItems.map((cat) => (
              <a
                key={cat.id}
                href={cat.slug ? `/collections/${cat.slug}` : '/collections'}
                className="flex-shrink-0 snap-start w-[140px] md:w-[170px] group/card"
              >
                {/* Image container — object-contain ensures full visibility */}
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-secondary/60 border border-border/40">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl">🛍️</span>
                    </div>
                  )}
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/60 to-transparent" />
                  {/* Title overlay */}
                  {carousel.showTitle && (
                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-background drop-shadow-md line-clamp-2 leading-tight">
                        {cat.title}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>

          {/* Mobile scroll indicators */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-background/90 shadow-lg rounded-full flex items-center justify-center md:hidden"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-background/90 shadow-lg rounded-full flex items-center justify-center md:hidden"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
