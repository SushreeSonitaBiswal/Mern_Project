import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, totalReviews, size = 'sm', interactive = false, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {stars.map((s) => {
          const filled = s <= Math.round(rating);
          return (
            <button
              key={s}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(s)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${starSize} ${
                  filled ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      {rating > 0 && (
        <span className="text-xs font-bold text-slate-700 ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-xs text-slate-400 font-medium">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;
