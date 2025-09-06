import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Product, ProductFilters } from '../../types';
import { ProductCard } from './ProductCard';
import { apiService } from '../../services/api';

const categories = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Health & Beauty',
  'Toys & Games',
  'Automotive',
  'Other'
];

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'All Categories',
    minPrice: 0,
    maxPrice: 100000,
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await apiService.getProducts({
        category: filters.category !== 'All Categories' ? filters.category : undefined,
        minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice < 100000 ? filters.maxPrice : undefined,
        search: filters.searchQuery || undefined
      });

      if (result.data?.products) {
        setProducts(result.data.products.map(p => ({
          id: p._id,
          title: p.title,
          description: p.description,
          category: p.category,
          price: p.price,
          imageUrl: p.imageUrl,
          seller: p.seller,
          sellerName: p.sellerName,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        })));
      } else {
        setError(result.error || 'Failed to load products');
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedLoadProducts = React.useCallback(
    debounce(() => {
      loadProducts();
    }, 500),
    [filters]
  );

  useEffect(() => {
    if (filters.searchQuery !== '') {
      debouncedLoadProducts();
    } else {
      loadProducts();
    };
  }, [filters.searchQuery, debouncedLoadProducts]);

  const handleFilterChange = (key: keyof ProductFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All Categories',
      minPrice: 0,
      maxPrice: 100000,
      searchQuery: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Products</h1>
        <p className="text-gray-600">Find eco-friendly and sustainable products from our community</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, descriptions, or sellers..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </span>
            {(filters.category !== 'All Categories' || filters.minPrice > 0 || filters.maxPrice < 100000 || filters.searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full rounded-md border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <X className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {filters.searchQuery || filters.category !== 'All Categories' || filters.minPrice > 0 || filters.maxPrice < 100000
              ? 'Try adjusting your search criteria or filters.'
              : 'No products have been listed yet. Be the first to add a product!'}
          </p>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}