// Database helpers for Supabase - replaces MongoDB models
import { supabase, createAdminClient, TABLES, supabaseHelpers } from './supabase.js';

// Product operations
export const ProductModel = {
  // Get all products with filtering and pagination
  async getAll(filters = {}) {
    try {
      let query = supabase.from(TABLES.PRODUCTS).select('*');
      
      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }
      if (filters.search) {
        query = supabaseHelpers.buildSearch(query, filters.search, ['name', 'description', 'category']);
      }
      
      // Apply pagination
      if (filters.page && filters.limit) {
        query = supabaseHelpers.buildPagination(query, filters.page, filters.limit);
      }
      
      // Apply sorting
      query = supabaseHelpers.buildSort(query, filters.sortBy, filters.sortOrder);
      
      const { data, error, count } = await query;
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Get product by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('id', id)
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Get product by slug
  async getBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('slug', slug)
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Create new product (admin only)
  async create(productData) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from(TABLES.PRODUCTS)
        .insert([productData])
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Update product (admin only)
  async update(id, updates) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from(TABLES.PRODUCTS)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Delete product (admin only)
  async delete(id) {
    try {
      const adminClient = createAdminClient();
      const { error } = await adminClient
        .from(TABLES.PRODUCTS)
        .delete()
        .eq('id', id);
      
      return supabaseHelpers.formatResponse(null, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  }
};

// Customer operations
export const CustomerModel = {
  // Get all customers (admin only)
  async getAll(filters = {}) {
    try {
      const adminClient = createAdminClient();
      let query = adminClient.from(TABLES.CUSTOMERS).select('*');
      
      // Apply filters
      if (filters.tier) {
        query = query.eq('tier', filters.tier);
      }
      if (filters.search) {
        query = supabaseHelpers.buildSearch(query, filters.search, ['first_name', 'last_name', 'email']);
      }
      
      // Apply pagination
      if (filters.page && filters.limit) {
        query = supabaseHelpers.buildPagination(query, filters.page, filters.limit);
      }
      
      // Apply sorting
      query = supabaseHelpers.buildSort(query, filters.sortBy, filters.sortOrder);
      
      const { data, error } = await query;
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Get customer by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CUSTOMERS)
        .select('*')
        .eq('id', id)
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Get customer by user ID (for authenticated users)
  async getByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CUSTOMERS)
        .select('*')
        .eq('user_id', userId)
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Create new customer
  async create(customerData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CUSTOMERS)
        .insert([customerData])
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Update customer
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CUSTOMERS)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  }
};

// Order operations
export const OrderModel = {
  // Get all orders with optional filtering
  async getAll(filters = {}) {
    try {
      const adminClient = createAdminClient();
      let query = adminClient
        .from(TABLES.ORDERS)
        .select(`
          *,
          customer:customers(*),
          order_items:order_items(*, product:products(*))
        `);
      
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }
      if (filters.search) {
        query = supabaseHelpers.buildSearch(query, filters.search, ['order_number']);
      }
      
      // Apply pagination
      if (filters.page && filters.limit) {
        query = supabaseHelpers.buildPagination(query, filters.page, filters.limit);
      }
      
      // Apply sorting
      query = supabaseHelpers.buildSort(query, filters.sortBy, filters.sortOrder);
      
      const { data, error } = await query;
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Get order by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select(`
          *,
          customer:customers(*),
          order_items:order_items(*, product:products(*))
        `)
        .eq('id', id)
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Create new order
  async create(orderData, orderItems) {
    try {
      const adminClient = createAdminClient();
      
      // Start transaction
      const { data: order, error: orderError } = await adminClient
        .from(TABLES.ORDERS)
        .insert([orderData])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Add order items
      const itemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: order.id
      }));
      
      const { data: items, error: itemsError } = await adminClient
        .from(TABLES.ORDER_ITEMS)
        .insert(itemsWithOrderId)
        .select();
      
      if (itemsError) throw itemsError;
      
      return supabaseHelpers.formatResponse({ ...order, order_items: items });
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Update order
  async update(id, updates) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from(TABLES.ORDERS)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  }
};

// Cart operations
export const CartModel = {
  // Get cart items for user
  async getByCustomerId(customerId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CART_ITEMS)
        .select(`
          *,
          product:products(*)
        `)
        .eq('customer_id', customerId);
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Add item to cart
  async addItem(customerId, productId, quantity, variantDetails = {}) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CART_ITEMS)
        .upsert([{
          customer_id: customerId,
          product_id: productId,
          quantity,
          variant_details: variantDetails
        }])
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Update cart item quantity
  async updateQuantity(customerId, productId, quantity) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CART_ITEMS)
        .update({ quantity })
        .eq('customer_id', customerId)
        .eq('product_id', productId)
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Remove item from cart
  async removeItem(customerId, productId) {
    try {
      const { error } = await supabase
        .from(TABLES.CART_ITEMS)
        .delete()
        .eq('customer_id', customerId)
        .eq('product_id', productId);
      
      return supabaseHelpers.formatResponse(null, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Clear entire cart
  async clearCart(customerId) {
    try {
      const { error } = await supabase
        .from(TABLES.CART_ITEMS)
        .delete()
        .eq('customer_id', customerId);
      
      return supabaseHelpers.formatResponse(null, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  }
};

// Analytics operations
export const AnalyticsModel = {
  // Get analytics data
  async getDashboardMetrics() {
    try {
      const adminClient = createAdminClient();
      
      // Get various metrics in parallel
      const [
        { data: orders },
        { data: customers },
        { data: products },
        { data: recentOrders }
      ] = await Promise.all([
        adminClient.from(TABLES.ORDERS).select('total_amount, status, created_at'),
        adminClient.from(TABLES.CUSTOMERS).select('total_spent, tier, created_at'),
        adminClient.from(TABLES.PRODUCTS).select('stock, price, is_active'),
        adminClient.from(TABLES.ORDERS)
          .select('*, customer:customers(first_name, last_name)')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);
      
      // Calculate metrics
      const totalRevenue = orders?.reduce((sum, order) => 
        order.status === 'delivered' ? sum + parseFloat(order.total_amount) : sum, 0) || 0;
      
      const totalOrders = orders?.length || 0;
      const totalCustomers = customers?.length || 0;
      const totalProducts = products?.filter(p => p.is_active)?.length || 0;
      
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      return supabaseHelpers.formatResponse({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        averageOrderValue,
        recentOrders: recentOrders || []
      });
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Record analytics event
  async recordMetric(metricName, value, data = {}) {
    try {
      const adminClient = createAdminClient();
      const { data: result, error } = await adminClient
        .from(TABLES.ANALYTICS)
        .insert([{
          metric_name: metricName,
          metric_value: value,
          metric_data: data
        }])
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(result, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  }
};

// Admin user operations
export const AdminUserModel = {
  // Get admin by user ID
  async getByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ADMIN_USERS)
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  // Create admin user
  async create(adminData) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from(TABLES.ADMIN_USERS)
        .insert([adminData])
        .select()
        .single();
      
      return supabaseHelpers.formatResponse(data, error);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  }
};