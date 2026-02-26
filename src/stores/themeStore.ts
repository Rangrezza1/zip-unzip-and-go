import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SectionSettings {
  id: string;
  type: string;
  enabled: boolean;
  backgroundColor: string;
  backgroundImage: string;
  paddingTop: number;
  paddingBottom: number;
  marginTop: number;
  marginBottom: number;
  textAlign: 'left' | 'center' | 'right';
  animationEnabled: boolean;
  decorativeStyle: 'none' | 'divider' | 'dots' | 'wave';
  settings: Record<string, unknown>;
}

export interface CollectionSectionSettings {
  collectionQuery: string;
  headline: string;
  subheading: string;
  headingStyle: 'none' | 'underline' | 'accent-bar' | 'icon' | 'divider';
  ctaText: string;
  ctaLink: string;
  productLimit: number;
  gridColumns: 2 | 3 | 4;
  hoverImage: boolean;
  quickAdd: boolean;
  saleBadge: boolean;
  tagBadges: boolean;
  shadowEffect: boolean;
  animationEnabled: boolean;
}

export interface FeaturedCollectionSection {
  id: string;
  collectionHandle: string;
  enabled: boolean;
  headline: string;
  subheading: string;
  headingStyle: 'none' | 'underline' | 'accent-bar' | 'icon' | 'divider';
  ctaText: string;
  productLimit: number;
  gridColumns: 2 | 3 | 4;
  shadowEffect: boolean;
  animationEnabled: boolean;
}

export interface HeroBanner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  enabled: boolean;
}

export interface AnnouncementMessage {
  id: string;
  text: string;
  emoji: string;
  enabled: boolean;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  link: string;
  enabled: boolean;
}

export interface CategoryCarouselSettings {
  itemSize: 'small' | 'medium' | 'large';
  autoScroll: boolean;
  scrollSpeed: number;
  showTitle: boolean;
  roundedImages: boolean;
}

export interface SalesCounterSettings {
  enabled: boolean;
  minSales: number;
  maxSales: number;
  minHours: number;
  maxHours: number;
}

export interface LiveViewersSettings {
  enabled: boolean;
  minViewers: number;
  maxViewers: number;
  fluctuation: number;
  intervalSeconds: number;
}

export interface RecentSalesSettings {
  enabled: boolean;
  productNames: string[];
  productImageUrl: string;
  displayDuration: number;
  initialDelay: number;
  repeatInterval: number;
  collectionHandle: string;
}

export interface CountdownSettings {
  enabled: boolean;
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
  resetHours: number;
  resetMinutes: number;
  resetSeconds: number;
}

export interface ProductWidgets {
  salesCounter: SalesCounterSettings;
  liveViewers: LiveViewersSettings;
  recentSales: RecentSalesSettings;
  countdown: CountdownSettings;
}

export interface ReviewsSectionSettings {
  enabled: boolean;
  headline: string;
  displayCount: number;
}

export interface BestSellingSettings {
  enabled: boolean;
  collectionHandle: string;
  headline: string;
  productLimit: number;
}

export interface WhatsAppSettings {
  enabled: boolean;
  phoneNumber: string;
  message: string;
}

export interface RecommendedProductsSettings {
  enabled: boolean;
  headline: string;
  subheading: string;
  collectionHandle: string;
  productLimit: number;
  showBadges: boolean;
  showPrice: boolean;
  autoScroll: boolean;
  scrollSpeed: number;
}

export interface ThemeSettings {
  // Announcement bar
  announcementMessages: AnnouncementMessage[];
  announcementSticky: boolean;
  announcementSpeed: number;
  showCountdown: boolean;

  // Header nav
  headerNavItems: HeaderNavItem[];

  // Category carousel
  categoryCarousel: CategoryCarouselSettings;

  categoryItems: CategoryItem[];
  heroBanners: HeroBanner[];
  heroAutoRotate: boolean;
  heroRotateInterval: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientEnabled: boolean;
  gradientFrom: string;
  gradientTo: string;
  fontFamily: string;
  headingFontWeight: string;
  buttonStyle: 'rounded' | 'square';
  borderRadius: number;
  sectionSpacing: number;
  containerWidth: number;
  saleBadgeColor: string;
  tagBadgeColor: string;
  animationsEnabled: boolean;
  stickyHeader: boolean;
  stickyAddToCart: boolean;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  sections: SectionSettings[];
  collectionSections: CollectionSectionSettings[];
  featuredCollections: FeaturedCollectionSection[];
  productWidgets: ProductWidgets;
  reviewsSection: ReviewsSectionSettings;
  bestSelling: BestSellingSettings;
  whatsapp: WhatsAppSettings;
  recommendedProducts: RecommendedProductsSettings;
}

const defaultSections: SectionSettings[] = [
  { id: 'hero', type: 'hero', enabled: true, backgroundColor: '', backgroundImage: '', paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, textAlign: 'center', animationEnabled: true, decorativeStyle: 'none', settings: {} },
  { id: 'categories', type: 'categories', enabled: true, backgroundColor: '', backgroundImage: '', paddingTop: 24, paddingBottom: 24, marginTop: 0, marginBottom: 0, textAlign: 'center', animationEnabled: true, decorativeStyle: 'none', settings: {} },
  { id: 'products', type: 'products', enabled: true, backgroundColor: '', backgroundImage: '', paddingTop: 24, paddingBottom: 24, marginTop: 0, marginBottom: 0, textAlign: 'left', animationEnabled: true, decorativeStyle: 'none', settings: {} },
  { id: 'promo', type: 'promo', enabled: true, backgroundColor: '', backgroundImage: '', paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, textAlign: 'center', animationEnabled: true, decorativeStyle: 'none', settings: {} },
];

const defaultAnnouncements: AnnouncementMessage[] = [
  { id: 'a1', text: 'Fast Delivery & Easy Exchange Policy', emoji: '⚡', enabled: true },
  { id: 'a2', text: 'All Payment Methods Accepted', emoji: '💳', enabled: true },
  { id: 'a3', text: 'Free Shipping on Orders Above Rs. 3,000', emoji: '📦', enabled: true },
];

const defaultTheme: ThemeSettings = {
  announcementMessages: defaultAnnouncements,
  announcementSticky: false,
  announcementSpeed: 20,
  showCountdown: true,
  headerNavItems: [],
  categoryCarousel: {
    itemSize: 'small',
    autoScroll: false,
    scrollSpeed: 3,
    showTitle: true,
    roundedImages: false,
  },
  categoryItems: [],
  heroBanners: [
    { id: 'default-1', imageUrl: '', title: 'Upto 50% OFF', subtitle: 'Premium Lawn & Dhanak collections. Shop Now Before It\'s Gone!', ctaText: 'Shop Now', ctaLink: '/collections' },
  ],
  heroAutoRotate: true,
  heroRotateInterval: 5,
  primaryColor: '38 65% 50%',
  secondaryColor: '35 15% 90%',
  accentColor: '38 65% 50%',
  gradientEnabled: false,
  gradientFrom: '38 65% 50%',
  gradientTo: '36 70% 38%',
  fontFamily: 'DM Sans',
  headingFontWeight: '600',
  buttonStyle: 'square',
  borderRadius: 4,
  sectionSpacing: 40,
  containerWidth: 1400,
  saleBadgeColor: '0 72% 51%',
  tagBadgeColor: '38 65% 50%',
  animationsEnabled: true,
  stickyHeader: true,
  stickyAddToCart: true,
  freeShippingThreshold: 3000,
  lowStockThreshold: 5,
  sections: defaultSections,
  collectionSections: [],
  featuredCollections: [],
  productWidgets: {
    salesCounter: { enabled: true, minSales: 15, maxSales: 40, minHours: 10, maxHours: 24 },
    liveViewers: { enabled: true, minViewers: 20, maxViewers: 75, fluctuation: 5, intervalSeconds: 8 },
    recentSales: { enabled: true, productNames: [], productImageUrl: '', displayDuration: 4, initialDelay: 3, repeatInterval: 10, collectionHandle: '' },
    countdown: { enabled: true, label: 'Hurry! Offer ends in', hours: 1, minutes: 24, seconds: 48, resetHours: 1, resetMinutes: 30, resetSeconds: 60 },
  },
  reviewsSection: { enabled: true, headline: 'What Our Customers Say', displayCount: 10 },
  bestSelling: { enabled: true, collectionHandle: '', headline: 'Best Sellers', productLimit: 10 },
  whatsapp: { enabled: true, phoneNumber: '', message: 'Hi! I want to order this product:' },
  recommendedProducts: { enabled: true, headline: 'You May Also Like 🔥', subheading: 'Curated picks just for you', collectionHandle: '', productLimit: 10, showBadges: true, showPrice: true, autoScroll: false, scrollSpeed: 3 },
};

interface ThemeStore {
  theme: ThemeSettings;
  updateTheme: (partial: Partial<ThemeSettings>) => void;
  updateSection: (id: string, partial: Partial<SectionSettings>) => void;
  addSection: (section: SectionSettings) => void;
  removeSection: (id: string) => void;
  reorderSections: (sections: SectionSettings[]) => void;
  duplicateSection: (id: string) => void;
  addCollectionSection: () => void;
  updateCollectionSection: (index: number, partial: Partial<CollectionSectionSettings>) => void;
  removeCollectionSection: (index: number) => void;
  addHeroBanner: () => void;
  updateHeroBanner: (id: string, partial: Partial<HeroBanner>) => void;
  removeHeroBanner: (id: string) => void;
  updateCategoryItem: (id: string, partial: Partial<CategoryItem>) => void;
  removeCategoryItem: (id: string) => void;
  reorderCategoryItems: (items: CategoryItem[]) => void;
  syncCategoryItems: (shopifyCollections: { handle: string; title: string; imageUrl: string }[]) => void;
  addFeaturedCollection: (handle: string, title: string) => void;
  updateFeaturedCollection: (id: string, partial: Partial<FeaturedCollectionSection>) => void;
  removeFeaturedCollection: (id: string) => void;
  reorderFeaturedCollections: (collections: FeaturedCollectionSection[]) => void;
  syncFeaturedCollections: (shopifyCollections: { handle: string; title: string }[]) => void;
  // Announcement
  addAnnouncementMessage: () => void;
  updateAnnouncementMessage: (id: string, partial: Partial<AnnouncementMessage>) => void;
  removeAnnouncementMessage: (id: string) => void;
  // Header nav
  syncHeaderNav: (collections: { handle: string; title: string }[]) => void;
  updateHeaderNavItem: (id: string, partial: Partial<HeaderNavItem>) => void;
  reorderHeaderNavItems: (items: HeaderNavItem[]) => void;
  // Save/export
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: defaultTheme,

      updateTheme: (partial) =>
        set({ theme: { ...get().theme, ...partial } }),

      updateSection: (id, partial) =>
        set({ theme: { ...get().theme, sections: get().theme.sections.map((s) => s.id === id ? { ...s, ...partial } : s) } }),

      addSection: (section) =>
        set({ theme: { ...get().theme, sections: [...get().theme.sections, section] } }),

      removeSection: (id) =>
        set({ theme: { ...get().theme, sections: get().theme.sections.filter((s) => s.id !== id) } }),

      reorderSections: (sections) =>
        set({ theme: { ...get().theme, sections } }),

      duplicateSection: (id) => {
        const section = get().theme.sections.find((s) => s.id === id);
        if (!section) return;
        const newSection = { ...section, id: `${section.id}-${Date.now()}` };
        const idx = get().theme.sections.findIndex((s) => s.id === id);
        const sections = [...get().theme.sections];
        sections.splice(idx + 1, 0, newSection);
        set({ theme: { ...get().theme, sections } });
      },

      addCollectionSection: () =>
        set({ theme: { ...get().theme, collectionSections: [...get().theme.collectionSections, { collectionQuery: '', headline: `Collection ${get().theme.collectionSections.length + 1}`, subheading: 'Handpicked for you', headingStyle: 'accent-bar', ctaText: 'View All', ctaLink: '/collections', productLimit: 8, gridColumns: 4, hoverImage: true, quickAdd: true, saleBadge: true, tagBadges: true, shadowEffect: false, animationEnabled: true }] } }),

      updateCollectionSection: (index, partial) =>
        set({ theme: { ...get().theme, collectionSections: get().theme.collectionSections.map((s, i) => i === index ? { ...s, ...partial } : s) } }),

      removeCollectionSection: (index) =>
        set({ theme: { ...get().theme, collectionSections: get().theme.collectionSections.filter((_, i) => i !== index) } }),

      addHeroBanner: () =>
        set({ theme: { ...get().theme, heroBanners: [...get().theme.heroBanners, { id: `banner-${Date.now()}`, imageUrl: '', title: 'New Banner', subtitle: 'Edit this banner', ctaText: 'Shop Now', ctaLink: '/collections' }] } }),

      updateHeroBanner: (id, partial) =>
        set({ theme: { ...get().theme, heroBanners: get().theme.heroBanners.map((b) => b.id === id ? { ...b, ...partial } : b) } }),

      removeHeroBanner: (id) =>
        set({ theme: { ...get().theme, heroBanners: get().theme.heroBanners.filter((b) => b.id !== id) } }),

      updateCategoryItem: (id, partial) =>
        set({ theme: { ...get().theme, categoryItems: get().theme.categoryItems.map((c) => c.id === id ? { ...c, ...partial } : c) } }),

      removeCategoryItem: (id) =>
        set({ theme: { ...get().theme, categoryItems: get().theme.categoryItems.filter((c) => c.id !== id) } }),

      reorderCategoryItems: (items) =>
        set({ theme: { ...get().theme, categoryItems: items } }),

      syncCategoryItems: (shopifyCollections) => {
        const existing = get().theme.categoryItems;
        const existingHandles = new Set(existing.map(c => c.slug));
        const newItems = shopifyCollections
          .filter(c => !existingHandles.has(c.handle))
          .map(c => ({
            id: `cat-${c.handle}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: c.title,
            slug: c.handle,
            imageUrl: c.imageUrl,
            enabled: true,
          }));
        if (newItems.length > 0) {
          set({ theme: { ...get().theme, categoryItems: [...existing, ...newItems] } });
        }
      },

      addFeaturedCollection: (handle, title) =>
        set({ theme: { ...get().theme, featuredCollections: [...get().theme.featuredCollections, {
          id: `fc-${handle}-${Date.now()}`,
          collectionHandle: handle,
          enabled: true,
          headline: title,
          subheading: '',
          headingStyle: 'accent-bar',
          ctaText: 'View All',
          productLimit: 8,
          gridColumns: 4,
          shadowEffect: false,
          animationEnabled: true,
        }] } }),

      updateFeaturedCollection: (id, partial) =>
        set({ theme: { ...get().theme, featuredCollections: get().theme.featuredCollections.map((fc) => fc.id === id ? { ...fc, ...partial } : fc) } }),

      removeFeaturedCollection: (id) =>
        set({ theme: { ...get().theme, featuredCollections: get().theme.featuredCollections.filter((fc) => fc.id !== id) } }),

      reorderFeaturedCollections: (collections) =>
        set({ theme: { ...get().theme, featuredCollections: collections } }),

      syncFeaturedCollections: (shopifyCollections) => {
        const existing = get().theme.featuredCollections;
        const existingHandles = new Set(existing.map(fc => fc.collectionHandle));
        const newCollections = shopifyCollections
          .filter(c => !existingHandles.has(c.handle))
          .map(c => ({
            id: `fc-${c.handle}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            collectionHandle: c.handle,
            enabled: true,
            headline: c.title,
            subheading: '',
            headingStyle: 'accent-bar' as const,
            ctaText: 'View All',
            productLimit: 8,
            gridColumns: 4 as const,
            shadowEffect: false,
            animationEnabled: true,
          }));
        if (newCollections.length > 0) {
          set({ theme: { ...get().theme, featuredCollections: [...existing, ...newCollections] } });
        }
      },

      // Announcement
      addAnnouncementMessage: () =>
        set({ theme: { ...get().theme, announcementMessages: [...get().theme.announcementMessages, { id: `ann-${Date.now()}`, text: 'New announcement', emoji: '🔔', enabled: true }] } }),

      updateAnnouncementMessage: (id, partial) =>
        set({ theme: { ...get().theme, announcementMessages: get().theme.announcementMessages.map((m) => m.id === id ? { ...m, ...partial } : m) } }),

      removeAnnouncementMessage: (id) =>
        set({ theme: { ...get().theme, announcementMessages: get().theme.announcementMessages.filter((m) => m.id !== id) } }),

      // Header nav
      syncHeaderNav: (collections) => {
        const existing = get().theme.headerNavItems;
        if (existing.length > 0) return; // don't overwrite manual config
        const items: HeaderNavItem[] = [
          { id: 'nav-home', label: 'Home', link: '/', enabled: true },
          ...collections.map(c => ({
            id: `nav-${c.handle}`,
            label: c.title,
            link: `/collections/${c.handle}`,
            enabled: true,
          })),
          { id: 'nav-shop-all', label: 'Shop All', link: '/collections', enabled: true },
        ];
        set({ theme: { ...get().theme, headerNavItems: items } });
      },

      updateHeaderNavItem: (id, partial) =>
        set({ theme: { ...get().theme, headerNavItems: get().theme.headerNavItems.map((n) => n.id === id ? { ...n, ...partial } : n) } }),

      reorderHeaderNavItems: (items) =>
        set({ theme: { ...get().theme, headerNavItems: items } }),

      // Save/export
      exportSettings: () => JSON.stringify(get().theme, null, 2),

      importSettings: (json: string) => {
        try {
          const parsed = JSON.parse(json);
          set({ theme: { ...defaultTheme, ...parsed } });
          return true;
        } catch { return false; }
      },

      resetTheme: () => set({ theme: defaultTheme }),
    }),
    {
      name: 'theme-settings',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const persistedState = persisted as { theme?: Partial<ThemeSettings> } | undefined;
        const pt = persistedState?.theme || {};
        return {
          ...current,
          theme: {
            ...defaultTheme,
            ...pt,
            productWidgets: { ...defaultTheme.productWidgets, ...(pt.productWidgets || {}) },
            reviewsSection: { ...defaultTheme.reviewsSection, ...(pt.reviewsSection || {}) },
            bestSelling: { ...defaultTheme.bestSelling, ...(pt.bestSelling || {}) },
            whatsapp: { ...defaultTheme.whatsapp, ...(pt.whatsapp || {}) },
          },
        } as ThemeStore;
      },
    }
  )
);
