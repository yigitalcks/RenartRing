import React from 'react';

function ProductSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="product-image-container skeleton-shimmer">
        <div className="skeleton-image"></div>
      </div>
      <div className="product-info">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-price"></div>
        <div className="color-selector">
          <div className="skeleton-color-icon"></div>
          <div className="skeleton-color-icon"></div>
          <div className="skeleton-color-icon"></div>
        </div>
        <div className="skeleton-line skeleton-color-name"></div>
        <div className="skeleton-stars">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-star"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductSkeleton); 