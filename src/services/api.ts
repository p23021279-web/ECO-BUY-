const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error or invalid response' };
    }
  }

  // Auth endpoints
  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ username, email, password })
    });

    const result = await this.handleResponse<{ token: string; user: any }>(response);
    
    if (result.data?.token) {
      localStorage.setItem('auth_token', result.data.token);
    }
    
    return result;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });

    const result = await this.handleResponse<{ token: string; user: any }>(response);
    
    if (result.data?.token) {
      localStorage.setItem('auth_token', result.data.token);
    }
    
    return result;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ user: any }>(response);
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  // Product endpoints
  async getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/products?${params}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{
      products: any[];
      total: number;
      totalPages: number;
      currentPage: number;
    }>(response);
  }

  async getUserProducts() {
    const response = await fetch(`${API_BASE_URL}/products/my-products`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ products: any[] }>(response);
  }

  async createProduct(productData: {
    title: string;
    description: string;
    category: string;
    price: number;
    imageUrl?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    return this.handleResponse<{ product: any }>(response);
  }

  async updateProduct(id: string, productData: {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    imageUrl?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    return this.handleResponse<{ product: any }>(response);
  }

  async deleteProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ message: string }>(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse<{ message: string; timestamp: string }>(response);
  }

  // Order endpoints
  async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      phone: string;
    };
  }) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData)
    });

    return this.handleResponse<{ order: any }>(response);
  }

  async getMyOrders() {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ orders: any[] }>(response);
  }

  async getOrder(orderId: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ order: any }>(response);
  }

  async updateOrderStatus(orderId: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    return this.handleResponse<{ order: any }>(response);
  }
}

export const apiService = new ApiService();