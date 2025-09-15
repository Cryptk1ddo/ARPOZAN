import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// For development, create a fallback client if env vars are not set properly
let supabase;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url') {
  console.warn('⚠️  Supabase environment variables not configured. Using mock client for development.');
  
  // Create a mock Supabase client for development
  supabase = {
    auth: {
      signInWithPassword: async ({ email, password }) => {
        if (email === 'admin@arpozan.com' && password === 'admin123') {
          return {
            data: {
              user: {
                id: 'demo-user-id',
                email: 'admin@arpozan.com',
                email_confirmed_at: new Date().toISOString()
              }
            },
            error: null
          };
        }
        return {
          data: { user: null },
          error: { message: 'Invalid login credentials' }
        };
      },
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null } }),
      onAuthStateChange: (callback) => {
        // Mock auth state change
        setTimeout(() => {
          callback('SIGNED_OUT', null);
        }, 100);
        return {
          data: {
            subscription: { unsubscribe: () => {} }
          }
        };
      }
    },
    from: (table) => ({
      select: () => ({
        eq: () => ({ data: [], error: null }),
        gte: () => ({ data: [], error: null }),
        range: () => ({ data: [], error: null, count: 0 }),
        order: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null })
      }),
      insert: () => ({
        select: () => ({
          single: () => ({ data: null, error: null })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({ data: null, error: null })
          })
        })
      }),
      delete: () => ({
        eq: () => ({ error: null })
      })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }

// Auth helpers
export const auth = {
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Products
  products: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug)
        `)
        .eq('is_active', true)
        .order('sort_order')
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug)
        `)
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (product) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      return { data, error }
    }
  },

  // Orders
  orders: {
    getAll: async (limit = 50, offset = 0) => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users(name, email),
          order_items(
            *,
            products(name, image_url)
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users(name, email, phone),
          order_items(
            *,
            products(name, image_url, slug)
          )
        `)
        .eq('id', id)
        .single()
      return { data, error }
    },

    updateStatus: async (id, status) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    addTracking: async (id, trackingNumber) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: trackingNumber,
          status: 'shipping',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Users
  users: {
    getAll: async (limit = 50, offset = 0) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          orders(id, order_number, total_amount, status, created_at),
          wishlist(
            product_id,
            products(name, image_url)
          )
        `)
        .eq('id', id)
        .single()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    updateLoyaltyPoints: async (id, points) => {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          loyalty_points: points,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Reviews
  reviews: {
    getAll: async (limit = 50, offset = 0) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users(name, email),
          products(name, slug)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      return { data, error }
    },

    approve: async (id) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ 
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    reject: async (id) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ 
          is_approved: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Analytics
  analytics: {
    getDashboardStats: async () => {
      // Get total orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      // Get total users
      const { data: usersData } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      // Get product views (if analytics_events table exists)
      const { data: eventsData } = await supabase
        .from('analytics_events')
        .select('event_type, created_at')
        .eq('event_type', 'product_view')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      return {
        totalOrders: ordersData?.length || 0,
        totalRevenue: ordersData?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0,
        newUsers: usersData?.length || 0,
        productViews: eventsData?.length || 0
      }
    },

    getTopProducts: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          products(name, image_url)
        `)
        .order('quantity', { ascending: false })
        .limit(5)
      return { data, error }
    }
  },

  // FAQs
  faqs: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select(`
          *,
          products(name)
        `)
        .order('sort_order')
      return { data, error }
    },

    create: async (faq) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert(faq)
        .select()
        .single()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id) => {
      const { data, error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id)
      return { data, error }
    }
  },

  // Categories
  categories: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order')
      return { data, error }
    },

    create: async (category) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id) => {
      const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      return { data, error }
    }
  }
}

// Real-time subscriptions
export const subscriptions = {
  orders: (callback) => {
    return supabase
      .channel('orders_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        callback
      )
      .subscribe()
  },

  users: (callback) => {
    return supabase
      .channel('users_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        callback
      )
      .subscribe()
  }
}

export default supabase