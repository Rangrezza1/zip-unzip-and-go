import { useRef, useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { useCollectionProducts } from '@/hooks/useCollectionProducts';
import { useProducts } from '@/hooks/useProducts';
import { ShopifyProduct, formatPrice, getDiscountPercentage, getProductBadges, getBadgeClass } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { ChevronLeft, ChevronRight, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import ReviewCount from './ReviewCount';

const RecommendedProducts = ({ currentHandle }: { currentHandle?: string }) => {
  const settings = useThemeStore(s => s.theme.recommendedProducts ?? {
    enabled: true, headline: 'You May Also Like 🔥', subheading: 'Curated picks just for you',
    collectionHandle: '', productLimit: 10, showBadges: true, showPrice: true, autoScroll: false, scrollSpeed: 3,
  });

  const { data: collectionData } = useCollectionProducts(settings.collectionHandle || '');
  const { data: allProducts } = useProducts(settings.productLimit, !settings.collectionHandle ? undefined : undefined);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!settings.enabled) return null;

  const rawProducts: ShopifyProduct[] = settings.collectionHandle
    ? (collectionData?.products || [])
    : (allProducts || []);

  // Filter out current product and limit
  const products = rawProducts
    .filter(p => p.node.handle !== currentHandle)
    .slice(0, settings.productLimit);

  if (products.length === 0) return null;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.rec-card')?.clientWidth || 200;
    el.scrollBy({ left: dir === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' });
  };

  return (
    <section className="py-8 md:py-12 overflow-hidden">
      <div className="container px-4">
        {/* Gen Z header — centered */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg md:text-xl font-bold tracking-tight">{settings.headline}</h2>
            </div>
            {settings.subheading && (
              <p className="text-xs text-muted-foreground">{settings.subheading}</p>
            )}
          </div>
          <div className="hidden md:flex items-center gap-1.5 mt-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <RecommendedCard
              key={product.node.id}
              product={product}
              showBadges={settings.showBadges}
              showPrice={settings.showPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const RecommendedCard = ({ product, showBadges, showPrice }: {
  product: ShopifyProduct;
  showBadges: boolean;
  showPrice: boolean;
}) => {
  const { node } = product;
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const firstVariant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const compareAtPrice = node.compareAtPriceRange?.maxVariantPrice?.amount;
  const discount = getDiscountPercentage(price.amount, compareAtPrice);
  const badges = getProductBadges(node.tags || []);
  const primaryImage = node.images.edges[0]?.node;
  const hoverImage = node.images.edges[1]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });
    toast.success('Added to cart', { description: node.title, position: 'top-center' });
  };

  return (
    <a
      href={`/product/${node.handle}`}
      className="rec-card snap-start flex-shrink-0 w-[155px] md:w-[200px] group block"
    >
      <div className="relative overflow-hidden bg-secondary rounded-xl aspect-[3/4]">
        {primaryImage && (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText || node.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {hoverImage && (
          <img
            src={hoverImage.url}
            alt={hoverImage.altText || node.title}
            className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Badges */}
        {showBadges && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && <span className="badge-sale text-[10px] px-1.5 py-0.5">-{discount}%</span>}
            {badges.map(badge => (
              <span key={badge.label} className={`${getBadgeClass(badge.type)} text-[10px] px-1.5 py-0.5`}>
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Quick add */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !firstVariant?.availableForSale}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-foreground/90 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 disabled:opacity-50 active:scale-95"
          aria-label="Add to cart"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="pt-2 px-0.5">
        <ReviewCount productHandle={node.handle} />
        <h3 className="text-[11px] md:text-xs font-medium leading-tight line-clamp-2 mb-1">{node.title}</h3>
        {showPrice && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {discount && compareAtPrice && (
              <>
                <span className="text-[10px] text-muted-foreground line-through">
                  {formatPrice(compareAtPrice, price.currencyCode)}
                </span>
                <span className="text-[9px] font-bold text-destructive bg-destructive/10 px-1 py-0.5 rounded">
                  -{discount}%
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </a>
  );
};

export default RecommendedProducts;
