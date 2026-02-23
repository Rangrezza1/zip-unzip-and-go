import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { CollectionSectionSettings, useThemeStore } from '@/stores/themeStore';
import { Loader2 } from 'lucide-react';

interface Props {
  config: CollectionSectionSettings;
}

const HeadingDecoration = ({ style }: { style: CollectionSectionSettings['headingStyle'] }) => {
  switch (style) {
    case 'underline':
      return <div className="w-12 h-0.5 bg-primary mx-auto mt-2 animate-[grow_0.5s_ease-out]" />;
    case 'accent-bar':
      return <div className="w-8 h-1 bg-primary mx-auto mt-2 rounded-full" />;
    case 'divider':
      return (
        <div className="flex items-center gap-3 justify-center mt-2">
          <div className="h-px w-12 bg-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="h-px w-12 bg-border" />
        </div>
      );
    case 'icon':
      return <div className="text-primary text-lg mt-1">✦</div>;
    default:
      return null;
  }
};

const DynamicCollectionShowcase = ({ config }: Props) => {
  const animationsEnabled = useThemeStore((s) => s.theme.animationsEnabled);
  const { data: products, isLoading } = useProducts(config.productLimit, config.collectionQuery || undefined);

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[config.gridColumns];

  return (
    <section className={`py-6 md:py-10 ${config.animationEnabled && animationsEnabled ? 'animate-fade-in' : ''}`}>
      <div className="container">
        <div className="text-center mb-6">
          <h2 className="section-title">{config.headline}</h2>
          <HeadingDecoration style={config.headingStyle} />
          {config.subheading && (
            <p className="text-sm text-muted-foreground mt-2">{config.subheading}</p>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && products && products.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No products found for this collection.</p>
        )}

        {!isLoading && products && products.length > 0 && (
          <div className={`grid ${gridClass} gap-2 md:gap-4`}>
            {products.map((product) => (
              <div
                key={product.node.id}
                className={config.shadowEffect ? 'shadow-md hover:shadow-lg transition-shadow rounded-sm overflow-hidden' : ''}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {config.ctaText && (
          <div className="text-center mt-6">
            <a href={config.ctaLink || '/collections'} className="cta-button-outline inline-block">
              {config.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicCollectionShowcase;
