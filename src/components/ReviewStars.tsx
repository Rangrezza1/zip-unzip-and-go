import { Star } from 'lucide-react';

interface ReviewStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const ReviewStars = ({ rating, size = 14, interactive = false, onRate }: ReviewStarsProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        >
          <Star
            className={`${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  );
};

export default ReviewStars;
