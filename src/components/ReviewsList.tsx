import { Review } from '@/hooks/useReviews';
import ReviewStars from './ReviewStars';
import { formatDistanceToNow } from 'date-fns';

interface ReviewsListProps {
  reviews: Review[];
  compact?: boolean;
}

const ReviewsList = ({ reviews, compact = false }: ReviewsListProps) => {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {reviews.map(review => (
        <div key={review.id} className="border-b pb-4 last:border-b-0">
          <div className="flex items-start gap-3">
            {review.image_url && (
              <img src={review.image_url} alt="Review" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded border flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ReviewStars rating={review.rating} size={12} />
                {!compact && <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </span>}
              </div>
              <p className="text-xs font-semibold">{review.reviewer_name}</p>
              {!compact && <p className="text-[10px] text-muted-foreground">{review.product_title}</p>}
              {review.review_text && (
                <p className={`text-xs text-muted-foreground mt-1 ${compact ? 'line-clamp-2' : ''}`}>{review.review_text}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
