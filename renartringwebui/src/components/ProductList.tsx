import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchRings } from '../services/productService';
import type { Ring, Rings, GoldData } from '../types/product';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

function ProductList() {
  const [products, setProducts] = useState<Ring[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const goldPriceRef = useRef<GoldData | null>(null);
  const lastProductRef = useRef<HTMLDivElement>(null);

  const loadProducts = useCallback(async (pageToLoad: number) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const response: Rings = await fetchRings(pageToLoad);
      
      if (response.data.length > 0) {
        setProducts(prev => pageToLoad === 1 ? response.data : [...prev, ...response.data]);
        setPage(pageToLoad + 1);
        setHasMore(response.pagination.hasNextPage);

        goldPriceRef.current = response.goldData;
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadProducts(page);
        }
      },
      { threshold: 1.0 }
    );

    if (lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, loading, loadProducts]);

  useEffect(() => {
    loadProducts(1);
  }, []);

  return (
    <div className="product-container">
      <h1>Rings</h1>
      
      <div className="product-grid">
        {products.map((product, index) => (
          <div 
            key={product.ringId}
            className="product-item"
            ref={index === products.length - 1 ? lastProductRef : null}
          >
            <ProductCard product={product} goldPrice={goldPriceRef.current?.price || 0} />
          </div>
        ))}
        
        {/* Loading skeletons */}
        {loading && (
          <>
            {[...Array(8)].map((_, index) => (
              <div key={`skeleton-${index}`} className="product-item">
                <ProductSkeleton />
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* End message */}
      {!hasMore && !loading && products.length > 0 && (
        <div className="end-message">
          <p>All products loaded</p>
        </div>
      )}
      
      {/* No products message */}
      {!hasMore && !loading && products.length === 0 && (
        <div className="no-products">
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;