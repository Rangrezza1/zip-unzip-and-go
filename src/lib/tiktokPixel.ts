// TikTok Pixel event tracking utilities
// Assumes ttq is loaded globally via index.html script

declare global {
  interface Window {
    ttq?: {
      identify: (data: Record<string, string>) => void;
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}

function getTtq() {
  return window.ttq;
}

interface TikTokContent {
  content_id: string;
  content_type: 'product' | 'product_group';
  content_name: string;
}

interface TikTokEventParams {
  contents: TikTokContent[];
  value: number;
  currency: string;
}

export function trackViewContent(productId: string, productName: string, price: number, currency: string = 'PKR') {
  getTtq()?.track('ViewContent', {
    contents: [{ content_id: productId, content_type: 'product', content_name: productName }],
    value: price,
    currency,
  } satisfies TikTokEventParams);
}

export function trackAddToCart(productId: string, productName: string, price: number, currency: string = 'PKR') {
  getTtq()?.track('AddToCart', {
    contents: [{ content_id: productId, content_type: 'product', content_name: productName }],
    value: price,
    currency,
  } satisfies TikTokEventParams);
}

export function trackInitiateCheckout(contents: TikTokContent[], totalValue: number, currency: string = 'PKR') {
  getTtq()?.track('InitiateCheckout', {
    contents,
    value: totalValue,
    currency,
  });
}

export function trackSearch(query: string) {
  getTtq()?.track('Search', {
    contents: [],
    value: 0,
    currency: 'PKR',
    search_string: query,
  });
}

export function trackPageView() {
  getTtq()?.page();
}
