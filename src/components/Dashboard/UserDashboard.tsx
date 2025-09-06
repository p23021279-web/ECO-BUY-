import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types';
import { apiService } from '../../services/api';
import { ProductCard } from '../Products/ProductCard';
import { ProductForm } from '../Products/ProductForm';

interface UserDashboardProps {
  onViewChange: (view: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onViewChange }) => {
  const { user } = useAuth();
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProducts();
    }
  }, [user]);

  const loadUserProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await apiService.getUserProducts();
      
      if (result.data?.products) {
        setUserProducts(result.data.products.map(p => ({
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
        setError(result.error || 'Failed to load your products');
      }
    } catch (err) {
      setError('Failed to load your products');
      console.error('Load user products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const result = await apiService.deleteProduct(productId);
      
      if (result.error) {
        alert('Failed to delete product: ' + result.error);
      } else {
        loadUserProducts();
      }
    } catch (err) {
      alert('Failed to delete product. Please try again.');
      console.error('Delete product error:', err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadUserProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct || undefined}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your product listings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadUserProducts}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{userProducts.length}</p>
                  <p className="text-gray-600">Active Listings</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">₹</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{userProducts.reduce((total, product) => total + product.price, 0).toFixed(2)}
                  </p>
                  <p className="text-gray-600">Total Value</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">#</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(userProducts.map(p => p.category)).size}
                  </p>
                  <p className="text-gray-600">Categories</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {userProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} showSellerInfo={false} />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                        title="Edit product"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Package className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">
                Start by creating your first product listing to share with the community.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};