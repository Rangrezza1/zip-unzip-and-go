import { useEffect } from 'react';
import { ShoppingBag, Minus, Plus, Trash2, Loader2, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/shopify';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 3000;

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const currencyCode = items[0]?.price.currencyCode || 'PKR';

  const shippingProgress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0);

  useEffect(() => { if (open) syncCart(); }, [open, syncCart]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[380px] bg-background shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-display text-base font-semibold">
            Cart ({totalItems})
          </h2>
          <button onClick={onClose} className="p-1 active:scale-95 transition-transform" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="px-4 py-3 border-b bg-secondary/30">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[11px] text-muted-foreground mb-1.5">
                Add <span className="font-bold text-foreground">{formatPrice(remainingForFreeShipping.toString())}</span> more for <span className="font-bold text-foreground">FREE SHIPPING</span>
              </p>
            ) : (
              <p className="text-[11px] font-semibold text-foreground mb-1.5">
                🎉 You've unlocked FREE SHIPPING!
              </p>
            )}
            <div className="shipping-bar">
              <div className="shipping-bar-fill" style={{ width: `${shippingProgress}%` }} />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-8">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">Your cart is empty</p>
              <p className="text-xs text-muted-foreground/70">Browse our collection and add items</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {items.map((item) => {
                const imageUrl = item.product.node.images?.edges?.[0]?.node?.url;
                return (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="w-[72px] h-[90px] bg-secondary overflow-hidden flex-shrink-0">
                      {imageUrl && (
                        <img src={imageUrl} alt={item.product.node.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs leading-tight line-clamp-2">{item.product.node.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.selectedOptions.map(o => o.value).join(' / ')}
                      </p>
                      <p className="font-bold text-sm mt-1">
                        {formatPrice(item.price.amount, item.price.currencyCode)}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center border">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs w-6 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t px-4 py-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Subtotal</span>
                <span className="text-base font-bold">
                  {formatPrice(totalPrice.toString(), currencyCode)}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Shipping & taxes calculated at checkout</p>
              <button
                onClick={handleCheckout}
                disabled={isLoading || isSyncing}
                className="cta-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Checkout</>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground underline transition-colors py-1"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
