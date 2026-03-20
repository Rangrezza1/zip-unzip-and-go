import { useState, useEffect, useCallback } from 'react';
import { trackViewContent, trackAddToCart } from '@/lib/tiktokPixel';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { formatPrice, getDiscountPercentage, getProductBadges, getBadgeClass } from '@/lib/shopify';
import { Loader2, Minus, Plus, ChevronDown, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import useEmblaCarousel from 'embla-carousel-react';
import SalesCounter from '@/components/widgets/SalesCounter';
import LiveViewerCount from '@/components/widgets/LiveViewerCount';
import CountdownTimer from '@/components/widgets/CountdownTimer';
import ProductReviewSection from '@/components/ProductReviewSection';
import RecommendedProducts from '@/components/RecommendedProducts';

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProduct(handle || '');
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const whatsapp = useThemeStore(s => s.theme.whatsapp ?? { enabled: false, phoneNumber: '', message: '' });
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [initialized, setInitialized] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveImage(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(activeImage);
  }, [activeImage, emblaApi]);

  useEffect(() => {
    if (product && !initialized) {
      const options = product.options || [];
      const initial: Record<string, string> = {};
      options.forEach((opt: { name: string; values: string[] }) => { initial[opt.name] = opt.values[0]; });
      setSelectedOptions(initial);
      setInitialized(true);
    }
  }, [product, initialized]);

  if (isLoading) {
    return (<><AnnouncementBar /><Header /><div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div><Footer /></>);
  }
  if (!product) {
    return (<><AnnouncementBar /><Header /><div className="flex justify-center items-center min-h-[60vh]"><p className="text-muted-foreground text-sm">Product not found</p></div><Footer /></>);
  }

  const images = product.images?.edges || [];
  const variants = product.variants?.edges || [];
  const options = product.options || [];
  const currentOpts = Object.keys(selectedOptions).length > 0 ? selectedOptions : Object.fromEntries(options.map((o: { name: string; values: string[] }) => [o.name, o.values[0]]));

  const getSelectedVariant = () => variants.find((v: { node: { selectedOptions: Array<{ name: string; value: string }> } }) => v.node.selectedOptions.every((so: { name: string; value: string }) => currentOpts[so.name] === so.value))?.node;

  const selectedVariant = getSelectedVariant();
  const price = selectedVariant?.price || product.priceRange?.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const discount = getDiscountPercentage(price?.amount, compareAtPrice?.amount);
  const badges = getProductBadges(product.tags || []);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    const variant = variants.find((v: { node: { selectedOptions: Array<{ name: string; value: string }> } }) => v.node.selectedOptions.every((so: { name: string; value: string }) => newOptions[so.name] === so.value))?.node;
    if (variant?.image?.url) {
      const imgIdx = images.findIndex((img: { node: { url: string } }) => img.node.url === variant.image.url);
      if (imgIdx >= 0) setActiveImage(imgIdx);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({ product: { node: product }, variantId: selectedVariant.id, variantTitle: selectedVariant.title, price: selectedVariant.price, quantity, selectedOptions: selectedVariant.selectedOptions || [] });
    toast.success('Added to cart', { description: product.title, position: 'top-center' });
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    await addItem({ product: { node: product }, variantId: selectedVariant.id, variantTitle: selectedVariant.title, price: selectedVariant.price, quantity, selectedOptions: selectedVariant.selectedOptions || [] });
    const checkoutUrl = useCartStore.getState().getCheckoutUrl();
    if (checkoutUrl) window.open(checkoutUrl, '_blank');
  };

  const handleWhatsApp = () => {
    if (!whatsapp.phoneNumber) return;
    const text = encodeURIComponent(`${whatsapp.message}\n\n${product.title}\n${price ? formatPrice(price.amount, price.currencyCode) : ''}\n${window.location.href}`);
    window.open(`https://wa.me/${whatsapp.phoneNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const accordionItems = [
    { id: 'description', title: 'Description', content: product.descriptionHtml || product.description || 'No description available.' },
    { id: 'shipping', title: 'Delivery & Returns', content: 'Standard delivery in 3-5 business days. Easy returns within 7 days of delivery.' },
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="pb-20 md:pb-8">
        <div className="md:container md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            <div>
              <div className="md:hidden">
                <div ref={emblaRef} className="overflow-hidden embla-gallery">
                  <div className="flex">
                    {images.map((img: { node: { url: string; altText: string | null } }, idx: number) => (
                      <div key={idx} className="flex-[0_0_100%] min-w-0">
                        <div className="aspect-[3/4] bg-secondary">
                          <img src={img.node.url} alt={img.node.altText || product.title} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 py-3">
                    {images.map((_: unknown, idx: number) => (
                      <button key={idx} onClick={() => setActiveImage(idx)} className={`gallery-dot ${idx === activeImage ? 'gallery-dot-active' : ''}`} />
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <div className="aspect-[3/4] bg-secondary overflow-hidden mb-3">
                  {images[activeImage] && <img src={images[activeImage].node.url} alt={images[activeImage].node.altText || product.title} className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500" />}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto thumb-scroll">
                    {images.map((img: { node: { url: string; altText: string | null } }, idx: number) => (
                      <button key={idx} onClick={() => setActiveImage(idx)} className={`w-16 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${idx === activeImage ? 'border-foreground' : 'border-transparent hover:border-muted-foreground/30'}`}>
                        <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 md:px-0 pt-4 md:pt-0">
              {(badges.length > 0 || discount) && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {discount && <span className="badge-sale">-{discount}% OFF</span>}
                  {badges.map(badge => <span key={badge.label} className={getBadgeClass(badge.type)}>{badge.label}</span>)}
                </div>
              )}
              <SalesCounter />
              <h1 className="font-display text-xl md:text-2xl font-bold mb-2 leading-tight mt-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-foreground">{price && formatPrice(price.amount, price.currencyCode)}</span>
                {compareAtPrice && discount && <span className="price-compare text-sm">{formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}</span>}
                {discount && <span className="text-xs font-bold text-destructive bg-destructive/10 px-1.5 py-0.5">SAVE {discount}%</span>}
              </div>
              <div className="mb-4">
                <LiveViewerCount />
              </div>
              {options.filter((o: { name: string; values: string[] }) => o.name !== 'Title' || o.values.length > 1).map((option: { name: string; values: string[] }) => (
                <div key={option.name} className="mb-4">
                  <label className="text-xs font-bold tracking-[0.15em] uppercase mb-2 block">{option.name}: <span className="font-normal text-muted-foreground">{currentOpts[option.name]}</span></label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value: string) => {
                      const isSelected = currentOpts[option.name] === value;
                      const testOpts = { ...currentOpts, [option.name]: value };
                      const variant = variants.find((v: { node: { selectedOptions: Array<{ name: string; value: string }> } }) => v.node.selectedOptions.every((so: { name: string; value: string }) => testOpts[so.name] === so.value))?.node;
                      const available = variant?.availableForSale !== false;
                      return (
                        <button key={value} onClick={() => handleOptionChange(option.name, value)} disabled={!available}
                          className={`min-w-[44px] px-3 py-2 text-xs font-medium border transition-all active:scale-95 ${isSelected ? 'border-foreground bg-foreground text-background' : available ? 'border-border hover:border-foreground' : 'border-border/40 text-muted-foreground/40 line-through cursor-not-allowed'}`}
                        >{value}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="mb-5">
                <label className="text-xs font-bold tracking-[0.15em] uppercase mb-2 block">Quantity</label>
                <div className="flex items-center border w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <CountdownTimer />
              <div className="hidden md:flex flex-col gap-2.5 mb-6">
                <button onClick={handleAddToCart} disabled={cartLoading || !selectedVariant?.availableForSale} className="cta-button w-full flex items-center justify-center gap-2 disabled:opacity-50">
                  {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Cart'}
                </button>
                <button onClick={handleBuyNow} disabled={cartLoading || !selectedVariant?.availableForSale} className="cta-button-outline w-full disabled:opacity-50">Buy Now</button>
                {whatsapp.enabled && whatsapp.phoneNumber && (
                  <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                  </button>
                )}
                {selectedVariant && !selectedVariant.availableForSale && <p className="text-destructive text-xs font-semibold text-center">Out of Stock</p>}
              </div>
              <div className="border-t">
                {accordionItems.map(item => (
                  <div key={item.id} className="border-b">
                    <button onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)} className="w-full flex items-center justify-between py-3.5 text-xs font-bold tracking-[0.15em] uppercase">
                      {item.title}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openAccordion === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ${openAccordion === item.id ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                      <div className="text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <RecommendedProducts currentHandle={handle} />
        <ProductReviewSection productHandle={handle || ''} productTitle={product.title} />
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t px-3 py-2 md:hidden z-50">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Price</p>
            <p className="font-bold text-sm">{price && formatPrice(price.amount, price.currencyCode)}</p>
            {compareAtPrice && discount && <p className="text-[10px] text-muted-foreground line-through">{formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}</p>}
          </div>
          {discount && (
            <span className="text-[10px] font-bold text-white bg-destructive px-2 py-0.5 rounded">SAVE {discount}%</span>
          )}
        </div>
        <div className="flex gap-1.5 mb-1.5">
          <button onClick={handleAddToCart} disabled={cartLoading || !selectedVariant?.availableForSale} className="flex-1 cta-button flex items-center justify-center gap-1 disabled:opacity-50 py-1.5 text-[9px]">
            {cartLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Add to Cart'}
          </button>
          <button onClick={handleBuyNow} disabled={cartLoading || !selectedVariant?.availableForSale} className="flex-1 cta-button-outline flex items-center justify-center py-1.5 text-[9px] disabled:opacity-50">
            Buy Now
          </button>
        </div>
        {whatsapp.enabled && whatsapp.phoneNumber && (
          <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-[#25D366] text-white rounded-lg active:scale-[0.98] transition-transform">
            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="white">
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.054 9.378L1.054 31.07l5.898-1.95c2.518 1.682 5.52 2.664 8.748 2.664h.008c8.824 0 16-7.176 16-16.004C31.708 6.956 24.828 0 16.004 0zm9.53 22.608c-.4 1.126-2.342 2.154-3.226 2.244-.884.09-1.706.4-5.746-1.196-4.872-1.926-7.956-6.952-8.196-7.276-.236-.324-1.956-2.6-1.956-4.96s1.236-3.52 1.676-4.004c.44-.484.96-.604 1.28-.604.32 0 .636.004.916.016.294.014.688-.112 1.076.82.4.96 1.36 3.32 1.48 3.56.12.244.2.524.04.844-.16.324-.24.524-.48.804-.236.284-.5.632-.712.848-.236.24-.484.5-.208.98.276.484 1.228 2.024 2.636 3.28 1.812 1.616 3.34 2.116 3.816 2.356.48.236.756.2 1.036-.12.276-.324 1.196-1.396 1.516-1.876.316-.484.636-.4 1.076-.236.44.16 2.796 1.316 3.276 1.556.476.236.796.356.916.556.116.196.116 1.148-.284 2.276z" />
            </svg>
            Order on WhatsApp
          </button>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
