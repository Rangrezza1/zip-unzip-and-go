import { useState, useRef, useEffect, useCallback } from 'react';
import { useThemeStore } from '@/stores/themeStore';

const MobileHeroCarousel = () => {
  const heroBanners = useThemeStore((s) => s.theme.heroBanners);
  const autoRotate = useThemeStore((s) => s.theme.heroAutoRotate);
  const interval = useThemeStore((s) => s.theme.heroRotateInterval);

  const banners = heroBanners.length > 0 ? heroBanners : [];
  const count = banners.length;

  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Card width = 80%, gap on each side = 10%
  const CARD_WIDTH_PERCENT = 80;
  const PEEK_PERCENT = 10;

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth || 375;
  }, []);

  const getOffset = useCallback((index: number) => {
    const cw = getContainerWidth();
    const cardW = (CARD_WIDTH_PERCENT / 100) * cw;
    const centerOffset = (cw - cardW) / 2;
    return -(index * cardW) + centerOffset - (index * 8); // 8px gap
  }, [getContainerWidth]);

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || count <= 1) return;
    autoTimerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, interval * 1000);
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [autoRotate, interval, count]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setTranslateX(0);
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = getContainerWidth() * 0.15;
    if (translateX < -threshold) {
      setCurrent((c) => (c + 1) % count);
    } else if (translateX > threshold) {
      setCurrent((c) => (c - 1 + count) % count);
    }
    setTranslateX(0);
  };

  if (count === 0) return null;

  // Build infinite array: [last, ...all, first] for visual peek
  // We use CSS transforms instead for true infinite feel
  const getVisibleSlides = () => {
    if (count === 1) return [{ banner: banners[0], index: 0 }];
    const slides: { banner: typeof banners[0]; index: number }[] = [];
    for (let i = -1; i <= count; i++) {
      const idx = ((i % count) + count) % count;
      slides.push({ banner: banners[idx], index: i });
    }
    return slides;
  };

  const slides = getVisibleSlides();
  const cw = getContainerWidth();
  const cardW = (CARD_WIDTH_PERCENT / 100) * cw;
  const gap = 8;
  const centerOffset = (cw - cardW) / 2;

  // For the extended array, index -1 is at position 0, index 0 at position 1, etc.
  // current=0 means we want index 0 centered
  // offset so that `current` slide is centered
  const baseTranslate = -((current + 1) * (cardW + gap)) + centerOffset;
  const finalTranslate = baseTranslate + (isDragging ? translateX : 0);

  return (
    <section className="relative overflow-hidden bg-secondary/30 md:hidden">
      <div
        ref={containerRef}
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${finalTranslate}px)`,
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          {slides.map((slide, i) => {
            const isActive = slide.index === current;
            return (
              <div
                key={`${slide.banner.id}-${i}`}
                className="flex-shrink-0"
                style={{ width: `${cardW}px` }}
              >
                {slide.banner.ctaLink ? (
                  <a href={slide.banner.ctaLink} className="block">
                    <SlideContent banner={slide.banner} isActive={isActive} />
                  </a>
                ) : (
                  <SlideContent banner={slide.banner} isActive={isActive} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot pagination */}
      {count > 1 && (
        <div className="flex justify-center gap-1.5 py-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-5 h-1.5 bg-foreground'
                  : 'w-1.5 h-1.5 bg-foreground/25'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const SlideContent = ({ banner, isActive }: { banner: { id: string; imageUrl: string; title: string; subtitle: string; ctaText: string }; isActive: boolean }) => (
  <div
    className="relative overflow-hidden transition-all duration-400"
    style={{
      aspectRatio: '3/4',
      opacity: isActive ? 1 : 0.5,
      transform: isActive ? 'scale(1)' : 'scale(0.95)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}
  >
    {banner.imageUrl ? (
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="w-full h-full object-cover"
        loading="eager"
        draggable={false}
      />
    ) : (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-xs">No image</span>
      </div>
    )}
    {/* Overlay text */}
    {(banner.title || banner.subtitle || banner.ctaText) && (
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-16">
        {banner.title && (
          <h2 className="text-lg font-bold text-white leading-tight mb-1">{banner.title}</h2>
        )}
        {banner.subtitle && (
          <p className="text-white/70 text-[11px] mb-2 line-clamp-2">{banner.subtitle}</p>
        )}
        {banner.ctaText && (
          <span className="inline-block bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-4 py-1.5">
            {banner.ctaText}
          </span>
        )}
      </div>
    )}
  </div>
);

export default MobileHeroCarousel;
