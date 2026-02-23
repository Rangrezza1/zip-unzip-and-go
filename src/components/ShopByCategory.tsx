const CATEGORIES = [
  { title: 'New Arrivals', slug: 'new', emoji: '✨' },
  { title: 'Best Sellers', slug: 'best-sellers', emoji: '🔥' },
  { title: 'Sale', slug: 'sale', emoji: '🏷️' },
  { title: 'All Products', slug: '', emoji: '🛍️' },
];

const ShopByCategory = () => {
  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <h2 className="section-title mb-4">Shop by Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
          {CATEGORIES.map(cat => (
            <a
              key={cat.slug}
              href={cat.slug ? `/collections/${cat.slug}` : '/collections'}
              className="flex-shrink-0 snap-start w-[140px] md:w-auto md:flex-1 bg-secondary/50 hover:bg-secondary transition-colors p-4 md:p-6 text-center group"
            >
              <span className="text-2xl md:text-3xl block mb-2">{cat.emoji}</span>
              <span className="text-xs font-bold tracking-[0.1em] uppercase group-hover:text-primary transition-colors">{cat.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
