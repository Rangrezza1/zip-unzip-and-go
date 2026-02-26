import { useThemeStore } from '@/stores/themeStore';

const ShopByCategory = () => {
  const categoryItems = useThemeStore((s) => s.theme.categoryItems);
  const carousel = useThemeStore((s) => s.theme.categoryCarousel);
  const enabledItems = categoryItems.filter((c) => c.enabled);

  if (enabledItems.length === 0) return null;

  return (
    <section className="py-5 md:py-8">
      <div className="container">
        {/* Centered header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold tracking-tight uppercase">
              Shop by Category
            </h2>
            <span className="text-lg">🔥</span>
          </div>
        </div>

        {/* Grid: 2 cols mobile/tablet, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {enabledItems.map((cat) => (
            <a
              key={cat.id}
              href={cat.slug ? `/collections/${cat.slug}` : '/collections'}
              className="group/card"
            >
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
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/60 to-transparent" />
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
      </div>
    </section>
  );
};

export default ShopByCategory;
