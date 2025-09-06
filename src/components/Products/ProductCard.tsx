import React from 'react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showSellerInfo?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showSellerInfo = true }) => {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = '#login';
      return;
    }
    addToCart(product);
  };

  // Check if user is the seller of this product
  const isOwnProduct = user && product.seller === user.id;
  const isProductInCart = isInCart(product.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
        <img
          src={product.imageUrl || 'https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-emerald-600 ml-2">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            {product.category}
          </span>
          
          {showSellerInfo && (
            <div className="text-gray-500">
              <p className="font-medium">{product.sellerName}</p>
              <p className="text-xs">{formatDate(product.createdAt)}</p>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-4">
          {!user ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Login to Add Cart
            </button>
          ) : isOwnProduct ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Your Product
            </button>
          ) : isProductInCart ? (
            <button
              disabled
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md cursor-not-allowed flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              In Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};