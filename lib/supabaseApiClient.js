// API Client for Supabase integration
import { supabase } from './supabase.js';
import { supabaseAuth } from './supabaseAuth.js';

export class SupabaseApiClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  }

  // Get current session token
  async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token 
      ? { Authorization: `Bearer ${session.access_token}` }
      : {};
  }

  // Make API request with automatic auth headers
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const authHeaders = await this.getAuthHeaders();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle auth errors
      if (response.status === 401) {
        await supabaseAuth.signOut();
        window.location.href = '/admin/login';
        throw new Error('Authentication required');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Admin Authentication
  admin = {
    login: async (email, password) => {
      const { user, admin, session, error } = await supabaseAuth.admin.signIn(email, password);
      
      if (error) {
        throw new Error(error);
      }

      return { user, admin, session };
    },

    logout: async () => {
      const { error } = await supabaseAuth.signOut();
      if (error) throw new Error(error);
    },

    getCurrentUser: async () => {
      const { user, admin, error } = await supabaseAuth.admin.getCurrentAdmin();
      if (error) throw new Error(error);
      return { user, admin };
    }
  };

  // Products API
  products = {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return this.request(`/admin/products${params ? `?${params}` : ''}`);
    },

    getById: async (id) => {
      return this.request(`/admin/products/${id}`);
    },

    create: async (productData) => {
      return this.request('/admin/products', {
        method: 'POST',
        body: productData,
      });
    },

    update: async (id, updates) => {
      return this.request(`/admin/products/${id}`, {
        method: 'PUT',
        body: updates,
      });
    },

    delete: async (id) => {
      return this.request(`/admin/products/${id}`, {
        method: 'DELETE',
      });
    },

    // Public product methods (no auth required)
    public: {
      getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return this.request(`/products${params ? `?${params}` : ''}`);
      },

      getBySlug: async (slug) => {
        return this.request(`/products/${slug}`);
      }
    }
  };

  // Orders API
  orders = {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return this.request(`/admin/orders${params ? `?${params}` : ''}`);
    },

    getById: async (id) => {
      return this.request(`/admin/orders/${id}`);
    },

    create: async (orderData) => {
      return this.request('/admin/orders', {
        method: 'POST',
        body: orderData,
      });
    },

    update: async (id, updates) => {
      return this.request(`/admin/orders/${id}`, {
        method: 'PUT',
        body: updates,
      });
    },

    updateStatus: async (id, status) => {
      return this.request(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: { status },
      });
    }
  };

  // Customers API
  customers = {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return this.request(`/admin/customers${params ? `?${params}` : ''}`);
    },

    getById: async (id) => {
      return this.request(`/admin/customers/${id}`);
    },

    update: async (id, updates) => {
      return this.request(`/admin/customers/${id}`, {
        method: 'PUT',
        body: updates,
      });
    },

    getAnalytics: async (customerId) => {
      return this.request(`/admin/customers/${customerId}/analytics`);
    }
  };

  // Analytics API
  analytics = {
    getDashboard: async () => {
      return this.request('/admin/analytics/dashboard');
    },

    getMetrics: async (timeRange = '30d') => {
      return this.request(`/admin/analytics/metrics?range=${timeRange}`);
    },

    getChartData: async (type, timeRange = '30d') => {
      return this.request(`/admin/analytics/charts/${type}?range=${timeRange}`);
    }
  };

  // Customer-facing APIs
  customer = {
    // Authentication
    auth: {
      signUp: async (email, password, customerData = {}) => {
        const { user, customer, error } = await supabaseAuth.customer.signUp(
          email, 
          password, 
          customerData
        );
        
        if (error) throw new Error(error);
        return { user, customer };
      },

      signIn: async (email, password) => {
        const { user, customer, error } = await supabaseAuth.customer.signIn(email, password);
        
        if (error) throw new Error(error);
        return { user, customer };
      },

      signOut: async () => {
        const { error } = await supabaseAuth.signOut();
        if (error) throw new Error(error);
      },

      getCurrentUser: async () => {
        const { user, customer, error } = await supabaseAuth.customer.getCurrentCustomer();
        if (error) throw new Error(error);
        return { user, customer };
      },

      updateProfile: async (updates) => {
        const { customer, error } = await supabaseAuth.customer.updateProfile(updates);
        if (error) throw new Error(error);
        return customer;
      }
    },

    // Cart operations
    cart: {
      get: async () => {
        return this.request('/cart');
      },

      add: async (productId, quantity = 1, variantDetails = {}) => {
        return this.request('/cart/add', {
          method: 'POST',
          body: { productId, quantity, variantDetails },
        });
      },

      update: async (productId, quantity) => {
        return this.request('/cart/update', {
          method: 'PUT',
          body: { productId, quantity },
        });
      },

      remove: async (productId) => {
        return this.request('/cart/remove', {
          method: 'DELETE',
          body: { productId },
        });
      },

      clear: async () => {
        return this.request('/cart/clear', {
          method: 'DELETE',
        });
      }
    },

    // Order operations
    orders: {
      getAll: async () => {
        return this.request('/orders');
      },

      getById: async (id) => {
        return this.request(`/orders/${id}`);
      },

      create: async (orderData) => {
        return this.request('/orders', {
          method: 'POST',
          body: orderData,
        });
      }
    }
  };
}

// Create singleton instance
export const apiClient = new SupabaseApiClient();

// React hooks for API integration
import { useState, useEffect } from 'react';

// Auth hook for admin users
export const useAdminAuth = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { user, admin } = await apiClient.admin.getCurrentUser();
        if (mounted) {
          setUser(user);
          setAdmin(admin);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setAdmin(null);
        } else if (event === 'SIGNED_IN' && session) {
          await checkAuth();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { user, admin } = await apiClient.admin.login(email, password);
      setUser(user);
      setAdmin(admin);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.admin.logout();
      setUser(null);
      setAdmin(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    user,
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user && !!admin
  };
};

// Auth hook for customers
export const useCustomerAuth = () => {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { user, customer } = await apiClient.customer.auth.getCurrentUser();
        if (mounted) {
          setUser(user);
          setCustomer(customer);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setCustomer(null);
        } else if (event === 'SIGNED_IN' && session) {
          await checkAuth();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    customer,
    loading,
    error,
    isAuthenticated: !!user && !!customer
  };
};

// Cart hook
export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiClient.customer.cart.get();
      setCart(response.data.cart);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, variantDetails = {}) => {
    try {
      setLoading(true);
      await apiClient.customer.cart.add(productId, quantity, variantDetails);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await apiClient.customer.cart.update(productId, quantity);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await apiClient.customer.cart.remove(productId);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.customer.cart.clear();
      setCart(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
    itemCount: cart?.items?.length || 0,
    totalAmount: cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  };
};

export default apiClient;