import React, { useState } from 'react';
import type { Ring } from '../types/product';
import StarRating from './StarRating';

type ColorKey = 'yellow' | 'rose' | 'white';

const colorDisplayNames: Record<ColorKey, string> = {
  yellow: 'Yellow Gold',
  rose: 'Rose Gold',
  white: 'White Gold',
};

const GOLD_PRICE_PER_GRAM = 123.45; 

function ProductCard({product}: {product: Ring}){
  const [selectedColor, setSelectedColor] = useState<ColorKey>('white');

  const calculatedPrice = product.weight * GOLD_PRICE_PER_GRAM;
  const ratingOutOfFive = product.popularityScore * 5;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.images[selectedColor]}
          alt={`${product.name} in ${selectedColor}`}
          className="product-image"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${calculatedPrice.toFixed(2)} USD</p>
        <div className="color-selector">
          {(Object.keys(product.images) as ColorKey[]).map(color => (
            <button
              key={color}
              className={`color-icon ${color} ${selectedColor === color ? 'selected' : ''}`}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select ${color}`}
            />
          ))}
        </div>
        <p className="color-name">{colorDisplayNames[selectedColor]}</p>
        <StarRating rating={ratingOutOfFive} />
      </div>
    </div>
  );
}

export default ProductCard;