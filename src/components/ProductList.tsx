import React, { useState, useEffect, useRef } from 'react';
import { fetchRings, type Rings } from '../services/productService';
import type { Ring } from '../types/product';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const pageSize = 4; // Hardcoded

  const [allProducts, setAllProducts] = useState<Ring[]>([]);
  //const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const fetchedPages = useRef<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (fetchedPages.current.has(page)) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetchRings(page).then((response: Rings) => {
      if (response.data.length > 0) {
        setAllProducts(prev => [...prev, ...response.data]);
      }

      fetchedPages.current.add(page);
      setHasMore(response.pagination.hasNextPage);
      setLoading(false);
    });
  }, [page]);

  const handleNext = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setPage(prev => prev - 1);
    setHasMore(true);
  };

  const visibleProducts = allProducts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="product-carousel-container">
      <h1>Products</h1>
      <div className="carousel-wrapper">
        <button 
          onClick={handlePrev} 
          className="carousel-arrow prev" 
          disabled={page === 1}
        >
          &#8249;
        </button>
        <div className="carousel-content">
          {visibleProducts.map(product => (
            <div className="product-card-wrapper" key={product.ringId}>
              <ProductCard product={product} />
            </div>
          ))}
          {loading && visibleProducts.length === 0 && <p>Loading initial products...</p>}
        </div>
        <button 
          onClick={handleNext} 
          className="carousel-arrow next"
          disabled={!hasMore}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default ProductList;