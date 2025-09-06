import { User, Product } from '../types';

const USERS_KEY = 'ecofind_users';
const PRODUCTS_KEY = 'ecofind_products';
const CURRENT_USER_KEY = 'ecofind_current_user';

export const storageUtils = {
  // User management
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  findUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  },

  // Product management
  getProducts(): Product[] {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  },

  saveProduct(product: Product): void {
    const products = this.getProducts();
    products.push(product);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  updateProduct(updatedProduct: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  },

  deleteProduct(productId: string): void {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  getProductsByUser(userId: string): Product[] {
    const products = this.getProducts();
    return products.filter(product => product.sellerId === userId);
  },

  // Current user session
  getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  clearCurrentUser(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Generate unique IDs
  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
};