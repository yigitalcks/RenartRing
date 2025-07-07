import React, { useState, useEffect } from 'react';
import { fetchRings, type Rings } from '../services/productService';
import type { Ring } from '../types/product';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Ring[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Eğer daha fazla ürün yoksa ve bu ilk sayfa değilse, istek yapma.
    if (!hasMore && page > 1) return;
    setLoading(true);

    fetchRings(page).then((response: Rings) => {
      if (response.data.length > 0) {
        setAllProducts(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.pagination.hasNextPage);
      setLoading(false);
    });
  }, [page]);

  const handleNext = () => {
    const nextGroupExists = currentIndex + 4 < allProducts.length;

    if (nextGroupExists) {
      setCurrentIndex(prev => prev + 4);
    } else if (hasMore && !loading) {
      setPage(prev => prev + 1);
      setCurrentIndex(prev => prev + 4);
    }
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 4));
  };

  const visibleProducts = allProducts.slice(currentIndex, currentIndex + 4);

  return (
    <div className="product-carousel-container">
      <h1>Products</h1>
      <div className="carousel-wrapper">
        <button 
          onClick={handlePrev} 
          className="carousel-arrow prev" 
          disabled={currentIndex === 0}
        >
          &#8249;
        </button>
        <div className="carousel-content">
          {visibleProducts.map(product => (
            // `key` olarak artık benzersiz olan `ringId`'yi kullanıyoruz.
            <div className="product-card-wrapper" key={product.ringId}>
              <ProductCard product={product} />
            </div>
          ))}
          {loading && visibleProducts.length === 0 && <p>Loading initial products...</p>}
        </div>
        <button 
          onClick={handleNext} 
          className="carousel-arrow next"
          disabled={!hasMore && currentIndex + 4 >= allProducts.length}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default ProductList;