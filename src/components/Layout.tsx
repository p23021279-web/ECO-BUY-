import React from 'react';
import { Search, User, ShoppingBag, Plus, LogOut, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => onViewChange('home')}
              >
                <ShoppingBag className="h-8 w-8 text-emerald-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">EcoFinds</span>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.username}!</span>
                
                {/* Cart Button */}
                <button
                  onClick={() => onViewChange('cart')}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'cart'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4 inline mr-1" />
                  Cart
                  {isAuthenticated && getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>

                {/* Orders Button */}
                <button
                  onClick={() => onViewChange('orders')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'orders'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-100'
                  }`}
                >
                  <Package className="h-4 w-4 inline mr-1" />
                  My Orders
                </button>

                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-4 w-4 inline mr-1" />
                  Dashboard
                </button>
                <button
                  onClick={() => onViewChange('add-product')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'add-product'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Add Product
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4 inline mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onViewChange('login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onViewChange('register')}
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};