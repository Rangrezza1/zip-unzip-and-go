import { ShopifyProduct, formatPrice, getDiscountPercentage, getProductBadges, getBadgeClass } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ShopifyProduct;
  onQuickView?: () => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
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
    toast.success('Added to cart', {
      description: node.title,
      position: 'top-center',
    });
  };

  return (
    <a href={`/product/${node.handle}`} className="product-card group block">
      <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
        {primaryImage && (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText || node.title}
            className="product-card-image group-hover:scale-105"
            loading="lazy"
          />
        )}
        {hoverImage && (
          <img
            src={hoverImage.url}
            alt={hoverImage.altText || node.title}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="badge-sale">-{discount}%</span>
          )}
          {badges.map(badge => (
            <span key={badge.label} className={getBadgeClass(badge.type)}>
              {badge.label}
            </span>
          ))}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading || !firstVariant?.availableForSale}
          className="absolute bottom-0 left-0 right-0 bg-foreground/90 text-background flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary disabled:opacity-50 md:translate-y-full md:group-hover:translate-y-0"
          aria-label="Add to cart"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><ShoppingBag className="w-3.5 h-3.5" /> Add to Cart</>}
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isLoading || !firstVariant?.availableForSale}
          className="md:hidden absolute bottom-2 right-2 w-8 h-8 rounded-full bg-foreground/90 text-background flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
          aria-label="Add to cart"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
        </button>

        {onQuickView && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
            className="hidden md:block absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            Quick View
          </button>
        )}
      </div>

      <div className="px-1 py-2.5">
        <h3 className="text-xs font-medium leading-tight line-clamp-2 mb-1">{node.title}</h3>
        <div className="flex items-center gap-1.5">
          <span className="price-current text-sm">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {discount && compareAtPrice && (
            <span className="price-compare">
              {formatPrice(compareAtPrice, price.currencyCode)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
