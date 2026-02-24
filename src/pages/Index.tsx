import { useEffect } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import ShopByCategory from '@/components/ShopByCategory';
import PromoBanner from '@/components/PromoBanner';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import FeaturedCollectionShowcase from '@/components/FeaturedCollectionShowcase';
import BestSellingCarousel from '@/components/BestSellingCarousel';
import AllReviewsSection from '@/components/AllReviewsSection';
import { useThemeStore } from '@/stores/themeStore';
import { useCollections } from '@/hooks/useCollections';

const Index = () => {
  const { theme, syncFeaturedCollections, syncCategoryItems, syncHeaderNav } = useThemeStore();
  const { data: collections } = useCollections();

  useEffect(() => {
    if (collections && collections.length > 0) {
      syncFeaturedCollections(collections.map(c => ({ handle: c.handle, title: c.title })));
      syncCategoryItems(collections.map(c => ({ handle: c.handle, title: c.title, imageUrl: c.image?.url || '' })));
      syncHeaderNav(collections.map(c => ({ handle: c.handle, title: c.title })));
    }
  }, [collections, syncFeaturedCollections, syncCategoryItems, syncHeaderNav]);

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <SectionWrapper sectionId="hero">
          <HeroBanner />
        </SectionWrapper>
        <SectionWrapper sectionId="categories">
          <ShopByCategory />
        </SectionWrapper>
        <BestSellingCarousel />
        {theme.featuredCollections.map((fc) => (
          <FeaturedCollectionShowcase key={fc.id} config={fc} />
        ))}
        <SectionWrapper sectionId="promo">
          <PromoBanner />
        </SectionWrapper>
        <AllReviewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
