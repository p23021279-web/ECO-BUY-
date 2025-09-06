import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const result = await apiService.getCurrentUser();
          if (result.data?.user) {
            setUser({
              id: result.data.user._id,
              username: result.data.user.username,
              email: result.data.user.email,
              createdAt: result.data.user.createdAt
            });
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const result = await apiService.register(username, email, password);
      
      if (result.data?.user) {
        const userData = {
          id: result.data.user._id,
          username: result.data.user.username,
          email: result.data.user.email,
          createdAt: result.data.user.createdAt
        };
        setUser(userData);
        return true;
      } else {
        console.error('Registration failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await apiService.login(email, password);
      
      if (result.data?.user) {
        const userData = {
          id: result.data.user._id,
          username: result.data.user.username,
          email: result.data.user.email,
          createdAt: result.data.user.createdAt
        };
        setUser(userData);
        return true;
      } else {
        console.error('Login failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};