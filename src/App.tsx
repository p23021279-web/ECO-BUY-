import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/Layout';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ProductList } from './components/Products/ProductList';
import { ProductForm } from './components/Products/ProductForm';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { ShoppingCart } from './components/Cart/ShoppingCart';
import { MyOrders } from './components/Orders/MyOrders';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const { isAuthenticated } = useAuth();

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  // Handle hash-based navigation for login redirect
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#login') {
        setCurrentView('login');
        window.location.hash = '';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm onViewChange={handleViewChange} />;
      case 'register':
        return <RegisterForm onViewChange={handleViewChange} />;
      case 'add-product':
        if (!isAuthenticated) {
          setCurrentView('login');
          return <LoginForm onViewChange={handleViewChange} />;
        }
        return (
          <div className="py-8">
            <ProductForm
              onSave={() => setCurrentView('dashboard')}
              onCancel={() => setCurrentView('home')}
            />
          </div>
        );
      case 'dashboard':
        if (!isAuthenticated) {
          setCurrentView('login');
          return <LoginForm onViewChange={handleViewChange} />;
        }
        return <UserDashboard onViewChange={handleViewChange} />;
      case 'cart':
        if (!isAuthenticated) {
          setCurrentView('login');
          return <LoginForm onViewChange={handleViewChange} />;
        }
        return <ShoppingCart />;
      case 'orders':
        if (!isAuthenticated) {
          setCurrentView('login');
          return <LoginForm onViewChange={handleViewChange} />;
        }
        return <MyOrders />;
      case 'home':
      default:
        return <ProductList />;
    }
  };

  if (currentView === 'login' || currentView === 'register') {
    return renderContent();
  }

  return (
    <Layout currentView={currentView} onViewChange={handleViewChange}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;