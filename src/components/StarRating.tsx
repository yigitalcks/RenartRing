interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  const filledStars = Math.round(rating);

  return (
    <div className="star-rating">
      <div className="stars">
        {[...Array(maxRating)].map((_, i) => (
          <span key={i} className={`star ${i < filledStars ? 'filled' : ''}`}>
            &#9733;
          </span>
        ))}
      </div>
      <span className="rating-text">{rating.toFixed(1)}/{maxRating}</span>
    </div>
  );
}

export default StarRating;