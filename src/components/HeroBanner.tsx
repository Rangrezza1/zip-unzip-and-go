import { useState, useEffect, useCallback } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = () => {
  const heroBanners = useThemeStore((s) => s.theme.heroBanners);
  const autoRotate = useThemeStore((s) => s.theme.heroAutoRotate);
  const interval = useThemeStore((s) => s.theme.heroRotateInterval);
  const [current, setCurrent] = useState(0);

  const banners = heroBanners.length > 0 ? heroBanners : [];

  const next = useCallback(() => {
    if (banners.length <= 1) return;
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    if (banners.length <= 1) return;
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (!autoRotate || banners.length <= 1) return;
    const timer = setInterval(next, interval * 1000);
    return () => clearInterval(timer);
  }, [autoRotate, interval, banners.length, next]);

  useEffect(() => {
    if (current >= banners.length) setCurrent(0);
  }, [banners.length, current]);

  if (banners.length === 0) {
    return (
      <section className="relative bg-charcoal overflow-hidden">
        <div className="container py-12 md:py-20 text-center">
          <p className="text-cream/60 font-body text-sm">No banners configured. Add banners from /admin.</p>
        </div>
      </section>
    );
  }

  const banner = banners[current];

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (banner.ctaLink) {
      return (
        <a href={banner.ctaLink} className="block cursor-pointer">
          {children}
        </a>
      );
    }
    return <>{children}</>;
  };

  return (
    <section className="relative bg-charcoal overflow-hidden hidden md:block">
      <Wrapper>
        <div className="relative">
          {banner.imageUrl ? (
            <div className="relative">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              {(banner.title || banner.subtitle || banner.ctaText) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    {banner.title && (
                      <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-4">
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && (
                      <p className="text-cream/70 max-w-sm mx-auto mb-6 font-body text-xs md:text-sm">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.ctaText && (
                      <span className="inline-block bg-primary text-primary-foreground font-semibold tracking-wider uppercase text-xs py-3 px-8 hover:opacity-90 transition-opacity">
                        {banner.ctaText}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="container py-12 md:py-20 text-center">
              <p className="text-primary text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3 font-body font-medium">
                Premium Collection
              </p>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-4">
                {banner.title.includes('OFF') ? (
                  <>
                    {banner.title.replace('OFF', '')}<br />
                    <span className="text-primary">OFF</span>
                  </>
                ) : (
                  banner.title
                )}
              </h2>
              <p className="text-cream/60 max-w-sm mx-auto mb-6 font-body text-xs md:text-sm">
                {banner.subtitle}
              </p>
              {banner.ctaText && (
                <span className="inline-block bg-primary text-primary-foreground font-semibold tracking-wider uppercase text-xs py-3 px-8 hover:opacity-90 transition-opacity">
                  {banner.ctaText}
                </span>
              )}
            </div>
          )}
        </div>
      </Wrapper>

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-cream p-2 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-cream p-2 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? 'bg-primary' : 'bg-cream/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;
