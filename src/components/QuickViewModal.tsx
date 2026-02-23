import { useState, useEffect } from 'react';
import { X, Minus, Plus, Loader2 } from 'lucide-react';
import { ShopifyProduct, formatPrice, getDiscountPercentage, getProductBadges, getBadgeClass } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

interface QuickViewModalProps {
  product: ShopifyProduct | null;
  onClose: () => void;
}

const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      const initial: Record<string, string> = {};
      product.node.options.forEach(opt => { initial[opt.name] = opt.values[0]; });
      setSelectedOptions(initial);
      setQuantity(1);
      setActiveImage(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const { node } = product;
  const images = node.images.edges;
  const variants = node.variants.edges;
  const options = node.options;

  const currentOpts = Object.keys(selectedOptions).length > 0 ? selectedOptions :
    Object.fromEntries(options.map(o => [o.name, o.values[0]]));

  const selectedVariant = variants.find(v =>
    v.node.selectedOptions.every(so => currentOpts[so.name] === so.value)
  )?.node;

  const price = selectedVariant?.price || node.priceRange.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const discount = getDiscountPercentage(price.amount, compareAtPrice?.amount);
  const badges = getProductBadges(node.tags || []);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    const variant = variants.find(v =>
      v.node.selectedOptions.every(so => newOptions[so.name] === so.value)
    )?.node;
    if (variant?.image?.url) {
      const idx = images.findIndex(img => img.node.url === variant.image!.url);
      if (idx >= 0) setActiveImage(idx);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success('Added to cart', { description: node.title, position: 'top-center' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 bg-background/80 backdrop-blur-sm" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[3/4] bg-secondary relative">
            {images[activeImage] && (
              <img src={images[activeImage].node.url} alt={node.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount && <span className="badge-sale">-{discount}%</span>}
              {badges.map(b => <span key={b.label} className={getBadgeClass(b.type)}>{b.label}</span>)}
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-2 left-2 right-2 flex gap-1 overflow-x-auto">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-10 h-12 flex-shrink-0 border-2 overflow-hidden ${idx === activeImage ? 'border-foreground' : 'border-transparent'}`}
                  >
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col">
            <h2 className="font-display text-lg font-bold mb-2">{node.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold">{formatPrice(price.amount, price.currencyCode)}</span>
              {compareAtPrice && discount && (
                <span className="price-compare">{formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}</span>
              )}
              {discount && <span className="text-xs font-bold text-destructive">-{discount}%</span>}
            </div>

            {options.filter(o => o.name !== 'Title' || o.values.length > 1).map(option => (
              <div key={option.name} className="mb-3">
                <label className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5 block">
                  {option.name}: <span className="font-normal text-muted-foreground">{currentOpts[option.name]}</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {option.values.map(value => {
                    const isSelected = currentOpts[option.name] === value;
                    const testOpts = { ...currentOpts, [option.name]: value };
                    const variant = variants.find(v =>
                      v.node.selectedOptions.every(so => testOpts[so.name] === so.value)
                    )?.node;
                    const available = variant?.availableForSale !== false;
                    return (
                      <button
                        key={value}
                        onClick={() => handleOptionChange(option.name, value)}
                        disabled={!available}
                        className={`min-w-[40px] px-2.5 py-1.5 text-[11px] font-medium border transition-all ${
                          isSelected ? 'border-foreground bg-foreground text-background'
                            : available ? 'border-border hover:border-foreground'
                            : 'border-border/40 text-muted-foreground/40 line-through cursor-not-allowed'
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5 block">Quantity</label>
              <div className="flex items-center border w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-secondary">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="mt-auto space-y-2">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedVariant?.availableForSale}
                className="cta-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Cart'}
              </button>
              <a href={`/product/${node.handle}`} onClick={onClose} className="block text-center text-xs text-muted-foreground hover:text-foreground underline transition-colors">
                View Full Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
