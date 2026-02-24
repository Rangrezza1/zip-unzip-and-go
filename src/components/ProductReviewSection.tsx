import { useProductReviews } from '@/hooks/useReviews';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import ReviewStars from './ReviewStars';

interface Props {
  productHandle: string;
  productTitle: string;
}

const ProductReviewSection = ({ productHandle, productTitle }: Props) => {
  const { data: reviews = [] } = useProductReviews(productHandle);

  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <section id="product-reviews" className="py-8 md:py-12">
      <div className="container max-w-3xl">
        <div className="text-center mb-6">
          <h2 className="section-title">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ReviewStars rating={Math.round(avgRating)} size={16} />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
        <div className="grid md:grid-cols-[1fr,1.2fr] gap-6">
          <ReviewForm productHandle={productHandle} productTitle={productTitle} />
          <div>
            <ReviewsList reviews={reviews} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviewSection;
