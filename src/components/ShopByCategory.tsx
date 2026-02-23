import { useThemeStore } from '@/stores/themeStore';

const ShopByCategory = () => {
  const categoryItems = useThemeStore((s) => s.theme.categoryItems);
  const enabledItems = categoryItems.filter((c) => c.enabled);

  if (enabledItems.length === 0) return null;

  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <h2 className="section-title mb-4">Shop by Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
          {enabledItems.map((cat) => (
            <a
              key={cat.id}
              href={cat.slug ? `/collections/${cat.slug}` : '/collections'}
              className="flex-shrink-0 snap-start w-[140px] md:w-auto md:flex-1 bg-secondary/50 hover:bg-secondary transition-colors text-center group overflow-hidden"
            >
              {cat.imageUrl ? (
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-muted flex items-center justify-center">
                  <span className="text-3xl text-muted-foreground">🛍️</span>
                </div>
              )}
              <div className="p-3">
                <span className="text-xs font-bold tracking-[0.1em] uppercase group-hover:text-primary transition-colors">
                  {cat.title}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
