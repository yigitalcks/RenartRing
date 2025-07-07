import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchRings } from '../services/productService';
import type { Ring, Rings, GoldData } from '../types/product';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

function ProductList() {
  const [allProducts, setAllProducts] = useState<Ring[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Intersection observer ref for horizontal scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const goldDataRef = useRef<GoldData | null>(null);

  const loadProducts = useCallback(async (pageToLoad: number) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const response: Rings = await fetchRings(pageToLoad);
      
      if (response.data.length > 0) {
        setAllProducts(prev => [...prev, ...response.data]);
        setPage(pageToLoad + 1);
      }
      
      setHasMore(response.pagination.hasNextPage);
      goldDataRef.current = response.goldData;
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading]);

  // Intersection observer callback for horizontal scrolling
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadProducts(page);
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 200px 0px 0px' // Right margin for horizontal
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, page, loadProducts]);

  // Handle manual scroll for horizontal navigation
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Load initial products
  useEffect(() => {
    loadProducts(1);
  }, []);

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="product-horizontal-container">
      <h1>Products</h1>
      
      <div className="horizontal-scroll-wrapper">
        {/* Scroll buttons */}
        <button 
          className="scroll-button scroll-left" 
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          &#8249;
        </button>
        
        {/* Horizontal scrolling container */}
        <div 
          className="product-horizontal-scroll" 
          ref={scrollContainerRef}
        >
          {/* Initial loading state */}
          {initialLoading && (
            <>
              {[...Array(6)].map((_, index) => (
                <div key={`skeleton-${index}`} className="product-card-horizontal">
                  <ProductSkeleton />
                </div>
              ))}
            </>
          )}
          
          {/* Products */}
          {!initialLoading && allProducts.map((product, index) => {
            // Attach ref to the last few products to trigger loading
            if (index === allProducts.length - 2) {
              return (
                <div 
                  ref={lastProductElementRef}
                  className="product-card-horizontal" 
                  key={product.ringId}
                >
                  <ProductCard product={product} goldPrice={goldDataRef.current?.price || 0} />
                </div>
              );
            }
            return (
              <div className="product-card-horizontal" key={product.ringId}>
                <ProductCard product={product} goldPrice={goldDataRef.current?.price || 0} />
              </div>
            );
          })}
          
          {/* Loading more skeletons */}
          {loading && hasMore && !initialLoading && (
            <>
              {[...Array(4)].map((_, index) => (
                <div key={`loading-skeleton-${index}`} className="product-card-horizontal">
                  <ProductSkeleton />
                </div>
              ))}
            </>
          )}
          
          {/* End indicator */}
          {!hasMore && !initialLoading && allProducts.length > 0 && (
            <div className="horizontal-end-indicator">
              <p>Tüm ürünler yüklendi</p>
            </div>
          )}
        </div>
        
        <button 
          className="scroll-button scroll-right" 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          &#8250;
        </button>
      </div>
      
      {/* No products found */}
      {!hasMore && !initialLoading && allProducts.length === 0 && (
        <div className="no-products">
          <p>Hiç ürün bulunamadı</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;