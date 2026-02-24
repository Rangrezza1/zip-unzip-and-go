import { useReviewCounts } from '@/hooks/useReviews';
import ReviewStars from './ReviewStars';

interface Props {
  productHandle: string;
}

const ReviewCount = ({ productHandle }: Props) => {
  const { data: counts } = useReviewCounts();
  const info = counts?.[productHandle];
  if (!info || info.count === 0) return null;

  return (
    <a
      href={`/product/${productHandle}#product-reviews`}
      className="flex items-center gap-1.5 mb-1 hover:opacity-80 transition-opacity"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ReviewStars rating={Math.round(info.avgRating)} size={11} />
      <span className="text-[10px] text-muted-foreground">({info.count})</span>
    </a>
  );
};

export default ReviewCount;
