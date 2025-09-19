// API utilities for frontend integration
export class ApiClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken() {
    if (this.token) return this.token;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    this.setToken(null);
    return response;
  }

  // Products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getProduct(slug) {
    return this.request(`/products/${slug}`);
  }

  // Cart
  async getCart() {
    return this.request('/cart/get');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: { productId, quantity },
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request('/cart/update', {
      method: 'PUT',
      body: { productId, quantity },
    });
  }

  async removeFromCart(productId) {
    return this.request('/cart/remove', {
      method: 'DELETE',
      body: { productId },
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Orders
  async placeOrder(orderData) {
    return this.request('/orders/place', {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrderHistory(page = 1, limit = 10) {
    return this.request(`/orders/history?page=${page}&limit=${limit}`);
  }

  async getOrderDetails(orderId) {
    return this.request(`/orders/details?orderId=${orderId}`);
  }

  // Admin APIs (require admin token)
  async adminLogin(email, password) {
    const response = await this.request('/admin/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  // Admin Products
  async getAdminProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/products${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async createProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: productData,
    });
  }

  async updateProduct(productId, productData) {
    return this.request('/admin/products', {
      method: 'PUT',
      body: { productId, ...productData },
    });
  }

  async deleteProduct(productId) {
    return this.request('/admin/products', {
      method: 'DELETE',
      body: { productId },
    });
  }

  // Admin Orders
  async getAdminOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/orders${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async updateOrderStatus(orderId, status, trackingNumber = null) {
    return this.request('/admin/orders', {
      method: 'PUT',
      body: { orderId, status, trackingNumber },
    });
  }

  // Admin Customers
  async getAdminCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/customers${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  // Admin Analytics
  async getAdminAnalytics(timeframe = '30d') {
    return this.request(`/admin/analytics?timeframe=${timeframe}`);
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// React hooks for easier integration
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = apiClient.getToken();
    if (token) {
      // Verify token and get user data
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      // You would typically have a verify endpoint
      // For now, we'll assume token is valid if it exists
      setUser({ token });
      setLoading(false);
    } catch (err) {
      setError('Invalid token');
      apiClient.setToken(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.login(email, password);
      
      if (response.success) {
        setUser(response.data.user);
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      apiClient.setToken(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}

export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCart();
      
      if (response.success) {
        setCart(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await apiClient.addToCart(productId, quantity);
      
      if (response.success) {
        await fetchCart(); // Refresh cart
        return response;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setError(null);
      const response = await apiClient.updateCartItem(productId, quantity);
      
      if (response.success) {
        await fetchCart(); // Refresh cart
        return response;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const response = await apiClient.removeFromCart(productId);
      
      if (response.success) {
        await fetchCart(); // Refresh cart
        return response;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const response = await apiClient.clearCart();
      
      if (response.success) {
        setCart(null);
        return response;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    // Fetch cart on mount if user is authenticated
    const token = apiClient.getToken();
    if (token) {
      fetchCart();
    }
  }, []);

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    itemCount: cart?.summary?.totalItems || 0,
    total: cart?.summary?.total || 0
  };
}

// Error handling utility
export function handleApiError(error) {
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    apiClient.setToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return 'Please log in to continue';
  }
  
  if (error.message.includes('404')) {
    return 'The requested resource was not found';
  }
  
  if (error.message.includes('400')) {
    return error.message || 'Invalid request';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later';
  }
  
  return error.message || 'An unexpected error occurred';
}