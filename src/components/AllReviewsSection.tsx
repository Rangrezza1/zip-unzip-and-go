import { useAllReviews } from '@/hooks/useReviews';
import ReviewsList from './ReviewsList';
import ReviewStars from './ReviewStars';
import { useThemeStore } from '@/stores/themeStore';

const AllReviewsSection = () => {
  const enabled = useThemeStore(s => s.theme.reviewsSection?.enabled ?? true);
  const headline = useThemeStore(s => s.theme.reviewsSection?.headline ?? 'What Our Customers Say');
  const limit = useThemeStore(s => s.theme.reviewsSection?.displayCount ?? 10);
  const { data: reviews = [] } = useAllReviews(limit);

  if (!enabled || reviews.length === 0) return null;

  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  return (
    <section className="py-8 md:py-12 bg-secondary/30">
      <div className="container max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="section-title">{headline}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ReviewStars rating={Math.round(avgRating)} size={16} />
            <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} from {reviews.length} reviews</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map(review => (
            <a key={review.id} href={`/product/${review.product_handle}#product-reviews`} className="block bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {review.image_url && (
                  <img src={review.image_url} alt="Review" className="w-14 h-14 object-cover rounded border flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <ReviewStars rating={review.rating} size={12} />
                  <p className="text-xs font-semibold mt-1">{review.reviewer_name}</p>
                  <p className="text-[10px] text-primary font-medium">{review.product_title}</p>
                  {review.review_text && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{review.review_text}</p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllReviewsSection;
